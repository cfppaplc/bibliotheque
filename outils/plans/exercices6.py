# -*- coding: utf-8 -*-
"""Dossier 6 : exercices, corrigé et fiches de montage (une page par gros plan). Produire : python3 exercices6.py (ou via generer.py 6)."""
import os, subprocess, glob, shutil, tempfile
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor, black
from dessin import wrap, FONT, FONT_B, AUTEUR, LOGO, LOGO_R, MM

PW, PH = 215.9, 279.4
VERT, GRIS = HexColor("#1a7f37"), HexColor("#666666")

QUESTIONS = [   # (feuille, question, réponse)
    ("000", "Combien de feuilles contient le dossier 6, page de garde comprise?", "10 feuilles."),
    ("M-001", "Sur quelle feuille trouve-t-on les symboles de robinetterie et d'accessoires?", "M-001 (Robinetterie et accessoires)."),
    ("M-001", "Quel robinet reconnaît-on à sa longue poignée en levier et à son corps arrondi?", "Le robinet à tournant sphérique."),
    ("M-301", "À quelle hauteur du plancher est le fond du réservoir tampon?", "450 mm (il repose sur deux socles de béton)."),
    ("M-301", "À quelle distance du plancher le tuyau de décharge de la soupape de sûreté doit-il s'arrêter?", "150 mm au-dessus du plancher, sans robinet ni réduction."),
    ("M-301", "Pourquoi n'y a-t-il aucun robinet entre la soupape de sûreté et le réservoir?", "Pour qu'on ne puisse jamais isoler la soupape du réservoir : elle doit toujours pouvoir le protéger."),
    ("M-301", "Quel est le rôle de la vanne de contrôle à trois voies?", "Mélanger ou dériver le débit; la troisième voie va vers le système."),
    ("M-301", "Sur le départ, dans quel ordre rencontre-t-on, en partant du réservoir : clapet, manomètre, robinet à vanne, vanne à trois voies, thermomètre?", "Manomètre, thermomètre, robinet à vanne, vanne à trois voies, clapet antiretour."),
    ("M-301", "Où place-t-on le circulateur et dans quelle position doit rester l'axe de son moteur?", "Sur le retour, entre deux robinets d'isolement; l'axe du moteur reste horizontal."),
    ("M-302", "Quelle couleur désigne le départ, le retour, le gaz et le condensat sur la feuille M-302?", "Rouge : départ. Bleu : retour. Jaune : gaz. Vert : condensat."),
    ("M-302", "Pourquoi neutralise-t-on le condensat de la chaudière avant de l'envoyer au drain?", "Il est acide (pH 3 à 4) et abîme les tuyaux de drainage."),
    ("M-302", "À quelle pression est tarée la soupape de sûreté de la chaudière?", "210 kPa."),
    ("M-303", "Combien de boucles alimente le collecteur et quelle est la longueur maximale d'une boucle?", "6 boucles; 100 m par boucle au maximum."),
    ("M-303", "À quoi sert le débitmètre de chaque boucle? Et le servomoteur thermique?", "Le débitmètre sert à équilibrer le débit; le servomoteur ouvre ou ferme la boucle selon le thermostat de la pièce."),
    ("P-301", "À quelle température l'eau est-elle mitigée aux appareils, et pourquoi le réservoir est-il quand même à 60 °C?", "49 °C aux appareils (contre les brûlures); 60 °C dans le réservoir pour empêcher la légionelle."),
    ("P-301", "Pourquoi utilise-t-on des raccords diélectriques sur le dessus du chauffe-eau?", "Pour éviter la corrosion galvanique entre le cuivre et l'acier du réservoir."),
    ("P-301", "Quelles sont les valeurs de la soupape T&P et à quoi sert le vase d'expansion sanitaire?", "1 034 kPa et 99 °C. Le vase absorbe la dilatation de l'eau chauffée (8 L, précharge 345 kPa)."),
    ("P-302", "À quelle profondeur la conduite d'eau entre-t-elle dans le bâtiment, et pourquoi?", "À 1 800 mm sous le sol, sous la ligne de gel."),
    ("P-302", "Dans quel ordre trouve-t-on les appareils de l'entrée d'eau?", "Robinet d'arrêt principal, union, compteur, réducteur de pression, manomètre, clapet antiretour."),
    ("P-302", "À quelle pression le réducteur règle-t-il le bâtiment, et quel est le rôle du clapet antiretour?", "350 kPa. Le clapet protège le réseau public contre le refoulement."),
    ("P-303", "Quel diamètre a la colonne de chute et d'évent, et quelle pente donne-t-on aux drains?", "Ø 3 po (89 mm); pente de 2 % (1/4 po par pied)."),
    ("P-303", "À quoi servent la garde d'eau du siphon et l'évent?", "La garde d'eau bloque les gaz d'égout; l'évent empêche l'aspiration de cette eau."),
    ("P-304", "Pourquoi perce-t-on un trou de 6 mm dans le tuyau de refoulement, dans la fosse?", "Pour éviter que la pompe se bloque par une poche d'air."),
    ("P-304", "Pourquoi place-t-on une union au-dessus du clapet de la pompe de puisard?", "Pour pouvoir sortir la pompe et la remplacer sans couper de tuyau."),
    ("P-305", "Quelle longueur minimale a le piège à sédiments, et à quelle distance maximale de l'appareil doit être le robinet à gaz?", "75 mm minimum; robinet visible et à moins de 1 800 mm de l'appareil."),
    ("P-305", "Comment vérifie-t-on l'étanchéité d'un raccord de gaz?", "À l'eau savonneuse, jamais à la flamme."),
]

FICHES = {   # feuille : (titre, outils, étapes, contrôles, erreurs)
    "M-301": ("Réservoir tampon, circulateur et vanne à trois voies",
              "Clés à tuyau, clé à molette, niveau, bride et joints, ruban de téflon ou pâte, manomètre d'essai, matériel de levage.",
              ["Poser les deux socles de béton de niveau, 450 mm sous le fond du réservoir.", "Déposer le réservoir sur ses socles et le caler.", "Monter la soupape de sûreté sur le dessus, sans robinet, et son tuyau de décharge jusqu'à 150 mm du plancher.",
               "Raccorder le départ au dessus : manomètre, thermomètre, robinet à vanne, vanne à trois voies, clapet.", "Raccorder le retour : robinet, circulateur (axe horizontal), robinet.",
               "Installer le purgeur d'air au point haut et le robinet de vidange au point bas.", "Remplir lentement, purger l'air, puis mettre en pression."],
              ["Aucune fuite aux brides et aux filets.", "Soupape libre, décharge ouverte sur un avaloir.", "Sens d'écoulement : flèche du circulateur et du clapet dans le bon sens."],
              ["Un robinet entre la soupape et le réservoir.", "Moteur du circulateur à la verticale.", "Clapet à l'envers."]),
    "M-302": ("Chaudière murale à condensation",
              "Niveau, perceuse, chevilles, clés à tuyau, soudure ou raccords à compression, détecteur de gaz, analyseur de combustion.",
              ["Fixer le support mural, 700 mm au-dessus du plancher, et accrocher la chaudière.", "Tirer l'évacuation et la prise d'air concentriques avec la pente vers la chaudière.", "Raccorder le départ (purgeur, manomètre, soupape 210 kPa, circulateur).",
               "Raccorder le retour : robinet d'isolement, filtre en Y, vase d'expansion.", "Raccorder le condensat par un tuyau en PVC et un neutralisant, pente continue vers le drain.", "Faire raccorder le gaz par une personne titulaire de la licence appropriée.", "Remplir, purger, puis régler avec un analyseur de combustion."],
              ["Le condensat s'écoule librement.", "Aucune fuite de gaz (eau savonneuse).", "Pression d'eau froide du circuit : environ 100 kPa."],
              ["Condensat sans neutralisant.", "Pente de l'évacuation vers l'extérieur.", "Manque de dégagement pour l'entretien."]),
    "M-303": ("Collecteur de plancher chauffant",
              "Coupe-tube, outil à sertir ou à raccords à compression, clé, pompe d'essai en pression, niveau.",
              ["Fixer la boîte du collecteur au centre de la zone, au mur.", "Monter les deux barillets (alimentation en haut, retour en bas) et les supports.", "Poser débitmètres et servomoteurs thermiques.",
               "Raccorder alimentation et retour avec robinets d'arrêt, thermomètres et purgeur.", "Relier chaque boucle (PEX-AL 16 mm) aux deux barillets, aller à gauche, retour à droite.", "Rincer et purger chaque boucle l'une après l'autre.", "Mettre en pression et équilibrer les débits."],
              ["Pression d'essai tenue 24 heures.", "Débits égaux à ±10 % entre boucles de même longueur.", "Thermostats associés aux bonnes boucles."],
              ["Boucles de plus de 100 m.", "Boucles inversées entre aller et retour.", "Air emprisonné : mal purgé."]),
    "P-301": ("Chauffe-eau électrique",
              "Clés à tuyau, coupe-tube, soudure ou raccords, ruban, niveau, multimètre.",
              ["Poser le bac de récupération et le chauffe-eau, de niveau, avec évacuation du bac.", "Visser les raccords diélectriques sur les deux nipples du dessus.", "Raccorder l'eau froide : robinet d'arrêt, clapet antiretour, vase d'expansion.",
               "Raccorder l'eau chaude vers le mélangeur thermostatique, avec dérivation d'eau froide.", "Installer la soupape T&P sur le côté; décharge jusqu'à 150 mm du plancher.", "Poser le robinet de vidange.", "Remplir complètement, purger les robinets, puis seulement après mettre sous tension."],
              ["Aucune fuite.", "Eau mitigée mesurée à 49 °C.", "Tuyau de décharge libre, sans bouchon ni robinet."],
              ["Mise sous tension avant le remplissage.", "Filets de la décharge bouchés.", "Raccords de cuivre vissés directement sur l'acier."]),
    "P-302": ("Entrée d'eau en sous-sol",
              "Carotteuse ou manchon coulé, clés à tuyau, scellant souple, manomètre, niveau.",
              ["Placer le manchon dans le mur de fondation, avec scellant des deux côtés.", "Passer la conduite à 1 800 mm sous le sol, sous la ligne de gel.", "Raccorder le robinet d'arrêt principal à tournant sphérique, à l'intérieur.",
               "Monter les unions et le compteur d'eau.", "Installer le réducteur de pression suivi du manomètre.", "Poser le clapet antiretour puis le robinet de vidange en aval du robinet principal.", "Régler le réducteur à 350 kPa."],
              ["Aucune infiltration autour du manchon.", "Pression stable après le réducteur.", "Robinet principal facile à atteindre."],
              ["Conduite trop près de la surface.", "Compteur sans unions.", "Pression laissée trop haute."]),
    "P-303": ("Mur humide : drainage et ventilation",
              "Scie, colle à ABS, niveau, mètre, tuyaux ABS 3 po et 1 1/4 po, bouchon de nettoyage.",
              ["Placer la colonne verticale de 3 po avec le bouchon de nettoyage au pied.", "Raccorder la toilette par une bride de plancher et un drain de 3 po à pente de 2 %.", "Monter le siphon de la baignoire sous le plancher.",
               "Poser le lavabo et son siphon, le bras vers la colonne.", "Prolonger la colonne à travers le plafond jusqu'au toit, 300 mm au-dessus de la toiture.", "Étancher la traversée du toit avec un solin.", "Faire un essai d'étanchéité à l'eau ou à l'air."],
              ["Pente de 2 % sur tous les drains horizontaux.", "Distance siphon-évent respectée.", "Chaque siphon garde son eau."],
              ["Drain trop plat ou trop pentu.", "Siphon sans évent.", "Colonne qui ne dépasse pas le toit."]),
    "P-304": ("Puisard et pompe de drainage",
              "Pelle, niveau, scie, colle PVC, union, clapet, prise DDFT.",
              ["Poser la fosse dans la dalle sur un lit de gravier de 20 mm.", "Raccorder le drain français perforé à la fosse.", "Placer la pompe au fond, bien d'aplomb.",
               "Monter le refoulement : trou de 6 mm, clapet, union, robinet d'arrêt.", "Faire sortir le refoulement par le mur, loin des fondations.", "Installer l'évent et le couvercle étanche.", "Brancher la pompe sur une prise DDFT dédiée et régler les flotteurs."],
              ["La pompe démarre et s'arrête au bon niveau.", "L'eau ne revient pas après l'arrêt.", "Le couvercle est bien étanche."],
              ["Pompe qui bloque : pas de trou de 6 mm.", "Eau raccordée à l'égout sanitaire.", "Flotteur coincé contre la paroi."]),
    "P-305": ("Raccord de gaz à un appareil",
              "Clés à tuyau, pâte à joint approuvée pour le gaz, détecteur de gaz, eau savonneuse. Travail réservé à une personne titulaire de la licence appropriée.",
              ["Tirer le tuyau noir de 3/4 po et le fixer avec des supports.", "Poser un té avec un piège à sédiments de 75 mm au minimum et son bouchon.", "Monter le robinet d'arrêt à tournant sphérique, visible, à moins de 1 800 mm de l'appareil.",
               "Poser l'union, puis le connecteur flexible homologué pour le gaz.", "Raccorder le connecteur à l'entrée de gaz de l'appareil.", "Vérifier toutes les jonctions à l'eau savonneuse.", "Ouvrir le gaz, purger, allumer et vérifier la flamme."],
              ["Aucune bulle à l'eau savonneuse.", "Poignée parallèle au tuyau quand le robinet est ouvert.", "Connecteur flexible libre, sans traverser de mur."],
              ["Utiliser une flamme pour chercher une fuite.", "Pas de piège à sédiments.", "Connecteur tordu ou trop long."]),
}


def entete(c, titre, sous):
    c.setFillColor(black); c.setFont(FONT_B, 17); c.drawString(20 * MM, (PH - 24) * MM, titre)
    c.setFont(FONT, 10.5); c.drawString(20 * MM, (PH - 31) * MM, sous)
    c.drawImage(LOGO, (PW - 20 - 16 * LOGO_R) * MM, (PH - 30) * MM, 16 * LOGO_R * MM, 16 * MM)
    c.setLineWidth(.8); c.line(20 * MM, (PH - 35) * MM, (PW - 20) * MM, (PH - 35) * MM)


def liste_exos(chemin, corrige):
    c = rl_canvas.Canvas(chemin, pagesize=(PW * MM, PH * MM)); c.setTitle("Dossier 6 — " + ("corrigé" if corrige else "exercices")); c.setAuthor("Pavillon de l'Avenir")
    sous = "DOSSIER 6 — Détails de plomberie et de chauffage" + ("   (réservé à l'enseignant)" if corrige else "")
    entete(c, "CORRIGÉ" if corrige else "EXERCICES", sous); y = PH - 46
    if not corrige:
        c.setFont(FONT, 10); c.drawString(20 * MM, y * MM, "Nom : ______________________________   Groupe : ____________   Date : ______________"); y -= 8
        for l in wrap("Consigne : ouvre le dossier 6 et réponds aux questions. La feuille où se trouve la réponse est indiquée entre parenthèses.", 105): c.drawString(20 * MM, y * MM, l); y -= 5
        y -= 4
    for i, (f_, q, r) in enumerate(QUESTIONS, 1):
        lignes = wrap(f"({f_}) " + q, 92); besoin = len(lignes) * 5 + (len(wrap(r, 88)) * 4.6 + 6 if corrige else 14)
        if y - besoin < 18:
            c.showPage(); entete(c, "CORRIGÉ (suite)" if corrige else "EXERCICES (suite)", sous); y = PH - 46
        c.setFillColor(black); c.setFont(FONT_B, 10.5)
        for k, l in enumerate(lignes): c.drawString((20 if k == 0 else 26) * MM, y * MM, (f"{i}.  " if k == 0 else "") + l); y -= 5
        if corrige:
            c.setFillColor(VERT); c.setFont(FONT_B, 10)
            for l in wrap("→ " + r, 88): c.drawString(26 * MM, y * MM, l); y -= 4.6
            y -= 3
        else:
            c.setLineWidth(.4); c.line(26 * MM, (y - 4) * MM, (PW - 20) * MM, (y - 4) * MM); y -= 12
    c.save()


def fiches(chemin, codes):
    """Fiches de montage des détails présents dans un dossier (une page chacune, avec vignette de la feuille)."""
    import d6_details
    pdf = tempfile.mktemp(suffix=".pdf"); d6_details.produire(pdf, codes)
    tmp = tempfile.mkdtemp(); subprocess.run(["pdftoppm", "-r", "70", "-png", pdf, os.path.join(tmp, "p")], check=True)
    imgs = dict(zip(codes, sorted(glob.glob(os.path.join(tmp, "p-*.png")))))
    c = rl_canvas.Canvas(chemin, pagesize=(PW * MM, PH * MM)); c.setTitle("Fiches de montage"); c.setAuthor("Pavillon de l'Avenir")
    for no, (titre, outils, etapes, controles, erreurs) in FICHES.items():
        if no not in imgs: continue
        entete(c, f"FICHE DE MONTAGE — {no}", titre)
        c.drawImage(imgs[no], 20 * MM, (PH - 42 - 71) * MM, 110 * MM, 71 * MM)
        y = PH - 42 - 71 - 8
        def bloc(titre_b, items, num=False):
            nonlocal y
            c.setFillColor(black); c.setFont(FONT_B, 10.5); c.drawString(20 * MM, y * MM, titre_b); y -= 5.5
            c.setFont(FONT, 9.6)
            for i, t in enumerate(items, 1):
                for k, l in enumerate(wrap(t, 98)):
                    c.drawString((24 if k == 0 else 29) * MM, y * MM, ((f"{i}. " if num else "• ") if k == 0 else "") + l); y -= 4.3
                y -= .6
            y -= 2
        c.setFont(FONT_B, 10.5); c.drawString(135 * MM, (PH - 50) * MM, "Outils et matériel"); c.setFont(FONT, 9)
        yy = PH - 55
        for l in wrap(outils, 34): c.drawString(135 * MM, yy * MM, l); yy -= 4.2
        bloc("Étapes de montage", etapes, True); bloc("Contrôles avant la mise en service", controles); bloc("Erreurs fréquentes", erreurs)
        c.setFillColor(GRIS); c.setFont(FONT, 7.5); c.drawString(20 * MM, 12 * MM, "Dessin à des fins d'enseignement : suivre la fiche du fabricant et les codes en vigueur. " + AUTEUR)
        c.showPage()
    c.save(); shutil.rmtree(tmp); os.remove(pdf)


def montage(site, n, codes):
    if any(k in FICHES for k in codes): fiches(os.path.join(site, "plans", f"dossier-{n}-montage.pdf"), codes)


if __name__ == "__main__":
    print("Utiliser generer.py")
