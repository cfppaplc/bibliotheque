// Fonction Supabase « panier-avis » (25 nov.) : avis Web Push de Métier+ aux enseignants (sans application à installer).
// GET  → clé publique des avis (créée la première fois, gardée dans panier_vapid, jamais montrée à personne).
// POST {avis} → appelée par panier_signaler (règlement du magasin). POST {absence} → absence_signaler (27 nov.). POST {id, eleve} → avis à l'élève.
// POST {id} → appelée par panier_envoyer : avertit les appareils de l'enseignant du panier (une seule fois, panier de moins de 2 min).
// À déployer dans Supabase → Edge Functions (nom : panier-avis, « Verify JWT » désactivé).
import * as webpush from "jsr:@negrel/webpush";
import { createClient } from "jsr:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SECRET_KEY"))!);
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

async function cles() {
  let { data } = await sb.from("panier_vapid").select("cles").eq("id", 1).maybeSingle();
  if (!data) {
    const k = await webpush.generateVapidKeys({ extractable: true });
    await sb.from("panier_vapid").insert({ id: 1, cles: await webpush.exportVapidKeys(k) });
    ({ data } = await sb.from("panier_vapid").select("cles").eq("id", 1).maybeSingle());
  }
  return await webpush.importVapidKeys(data!.cles, { extractable: true });
}

/* avis à tous les appareils des enseignants nommés (propriétaire du groupe + collègues du partage) */
async function envoyer(ids: string[], msg: string, k: unknown) {
  const app = await webpush.ApplicationServer.new({ contactInformation: "https://metierplus.app", vapidKeys: k as never }); let n = 0;
  for (const ens of [...new Set(ids)]) {
    const { data: pr } = await sb.from("panier_prof").select("abonnements").eq("ens", ens).maybeSingle(); if (!pr) continue;
    const gardes: unknown[] = [];
    for (const s of (pr.abonnements || []) as unknown[]) {
      try { await app.subscribe(s as never).pushTextMessage(msg, {}); gardes.push(s); n++; }
      catch (e) { if (!/\b(404|410)\b|gone|expired/i.test(String(e))) gardes.push(s); }   // appareil désabonné : on l'oublie
    }
    await sb.from("panier_prof").update({ abonnements: gardes }).eq("ens", ens);
  }
  return n;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const k = await cles();
    if (req.method === "GET") {   /* clé publique en base64url (format attendu par PushManager.subscribe) */
      const raw = new Uint8Array(await crypto.subtle.exportKey("raw", (k as CryptoKeyPair).publicKey));
      return json({ cle: btoa(String.fromCharCode(...raw)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") });
    }
    const { id, eleve, avis, comptoir, absence } = await req.json();
    if (comptoir) {   /* iPad du comptoir : nouvelle commande approuvée (code et nombre de raccords seulement) */
      const { data: p } = await sb.from("panier").select("id,code,items,etat,t_app").eq("id", id).maybeSingle();
      if (!p || p.etat !== "approuve" || Date.now() - new Date(p.t_app).getTime() > 120000) return json({ ok: false });
      const app = await webpush.ApplicationServer.new({ contactInformation: "https://metierplus.app", vapidKeys: k });
      const msg = JSON.stringify({ title: "Magasin : nouvelle commande", body: `Élève ${p.code} · ${(p.items || []).length} raccord(s) à préparer`, url: "/magasin.html?mode=magasin", tag: "comptoir-" + p.id });
      const { data: L } = await sb.from("magasin_abo").select("endpoint,abo"); let n = 0;
      for (const x of (L || [])) { try { await app.subscribe(x.abo).pushTextMessage(msg, {}); n++; } catch (e) { if (/\b(404|410)\b|gone|expired/i.test(String(e))) await sb.from("magasin_abo").delete().eq("endpoint", x.endpoint); } }
      return json({ ok: true, n });
    }
    if (absence) {   /* 27 nov. : absence signalée par l'élève (Ma carte) → enseignants qu'il a choisis */
      const MOT = ["", "Raison personnelle", "Rendez-vous", "Raison personnelle", "Services aux élèves", "Activité autorisée", "Autre"], G: Record<string, string> = { absence: "Absence", retard: "Retard", depart: "Départ hâtif" };
      const { data: a } = await sb.from("absence").select("*").eq("id", absence).maybeSingle();
      if (!a || Date.now() - new Date(a.t).getTime() > 120000) return json({ ok: false });
      const j = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("fr-CA", { weekday: "short", day: "numeric", month: "short" });
      const quand = a.du === a.au ? j(a.du) : j(a.du) + " au " + j(a.au), part = a.part === "am" ? " (avant-midi)" : a.part === "pm" ? " (après-midi)" : "";
      const chif = a.genre === "chiffre";   /* 27 nov. : genre, motif et moment chiffrés pour l'enseignant; l'avis n'en dit rien */
      const msg = JSON.stringify({ title: chif ? `Absence : L'élève ${a.code}` : `${G[a.genre] || "Absence"} : L'élève ${a.code} (${a.groupe})`, code: a.code, body: chif ? quand : `${quand}${part}${a.heure ? " · " + a.heure.replace(":", " h ") : ""} · ${MOT[a.motif] || "?"}`, url: "/magasin.html?mode=prof", tag: "abs-" + a.id });
      return json({ ok: true, n: await envoyer(a.profs || [], msg, k) });
    }
    if (avis) {   /* règlement du magasin non respecté : avis à l'enseignant de l'élève */
      const REG = ["", "Ne connaissait pas le nom exact du raccord", "Sans carte étudiante", "Consignes d'accès non respectées", "Matériel rendu sale", "Sans feuille de l'enseignant", "Bris ou usage personnel"];
      const { data: a } = await sb.from("magasin_avis").select("*").eq("id", avis).maybeSingle();
      if (!a || Date.now() - new Date(a.t).getTime() > 120000) return json({ ok: false });
      const msg = JSON.stringify({ title: `Magasin : L'élève ${a.code} (${a.groupe})`, code: a.code, body: "Règlement : " + (REG[a.regle] || "?"), url: "/magasin.html?mode=prof", tag: "avis-" + a.id });
      return json({ ok: true, n: await envoyer([a.ens, ...(a.profs || [])], msg, k) });
    }
    const { data: p } = await sb.from("panier").select("*").eq("id", id).maybeSingle();
    if (eleve) {   /* avis à l'élève : son enseignant vient de décider (une seule fois) */
      if (!p || !p.abo || p.avise_eleve || !["approuve", "refuse"].includes(p.etat)) return json({ ok: false });
      await sb.from("panier").update({ avise_eleve: true }).eq("id", id);
      const app = await webpush.ApplicationServer.new({ contactInformation: "https://metierplus.app", vapidKeys: k });
      const ok = p.etat === "approuve";
      const msg = JSON.stringify({ title: ok ? "Accepté · viens chercher ta commande" : "Ton panier est refusé", body: ok ? "Va au comptoir du magasin avec ta carte."   /* 27 nov. (Jeremy) */ : (p.motif ? "Motif : " + p.motif : "Parle à ton enseignant."), url: "/magasin.html", tag: "panier-eleve-" + p.id });
      try { await app.subscribe(p.abo).pushTextMessage(msg, {}); } catch (_) { /* appareil désabonné */ }
      return json({ ok: true });
    }
    if (!p || p.avise || p.etat !== "attente" || Date.now() - new Date(p.t).getTime() > 120000) return json({ ok: false });
    await sb.from("panier").update({ avise: true }).eq("id", id);
    const items = (p.items || []) as { q?: number; nom?: string }[];
    const msg = JSON.stringify({
      title: `L'élève ${p.code} a fait une commande`, code: p.code,   /* 27 nov. : le prénom est remis par le cellulaire de l'enseignant (sw.js), jamais lu par le serveur */
      body: items.slice(0, 5).map((i) => `${i.q || 1} × ${i.nom || "?"}`).join(", ") + (items.length > 5 ? "…" : ""),
      url: "/magasin.html?mode=prof", tag: "panier-" + p.id,
    });
    return json({ ok: true, n: await envoyer([p.ens, ...(p.profs || [])], msg, k) });
  } catch (e) { return json({ ok: false, err: String(e) }, 500); }
});
