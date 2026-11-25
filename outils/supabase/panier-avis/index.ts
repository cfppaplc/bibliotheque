// Fonction Supabase « panier-avis » (25 nov.) : avis Web Push de Métier+ aux enseignants (sans application à installer).
// GET  → clé publique des avis (créée la première fois, gardée dans panier_vapid, jamais montrée à personne).
// POST {id} → appelée par panier_envoyer : avertit les appareils de l'enseignant du panier (une seule fois, panier de moins de 2 min).
// À déployer dans Supabase → Edge Functions (nom : panier-avis, « Verify JWT » désactivé).
import * as webpush from "jsr:@negrel/webpush@0.3";
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const k = await cles();
    if (req.method === "GET") return json({ cle: await webpush.exportApplicationServerKey(k) });
    const { id } = await req.json();
    const { data: p } = await sb.from("panier").select("*").eq("id", id).maybeSingle();
    if (!p || p.avise || p.etat !== "attente" || Date.now() - new Date(p.t).getTime() > 120000) return json({ ok: false });
    await sb.from("panier").update({ avise: true }).eq("id", id);
    const { data: pr } = await sb.from("panier_prof").select("abonnements").eq("ens", p.ens).maybeSingle();
    const app = await webpush.ApplicationServer.new({ contactInformation: "https://metierplus.app", vapidKeys: k });
    const items = (p.items || []) as { q?: number; nom?: string }[];
    const msg = JSON.stringify({
      title: `Magasin : panier de l'élève ${p.code} (${p.groupe})`,
      body: items.slice(0, 5).map((i) => `${i.q || 1} × ${i.nom || "?"}`).join(", ") + (items.length > 5 ? "…" : ""),
      url: "/magasin.html?mode=prof", tag: "panier-" + p.id,
    });
    const gardes: unknown[] = []; let n = 0;
    for (const s of (pr?.abonnements || []) as unknown[]) {
      try { await app.subscribe(s as never).pushTextMessage(msg, {}); gardes.push(s); n++; }
      catch (e) { if (!/\b(404|410)\b|gone|expired/i.test(String(e))) gardes.push(s); }   // appareil désabonné : on l'oublie
    }
    await sb.from("panier_prof").update({ abonnements: gardes }).eq("ens", p.ens);
    return json({ ok: true, n });
  } catch (e) { return json({ ok: false, err: String(e) }, 500); }
});
