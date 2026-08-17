#!/usr/bin/env python3
"""
Générateur du site yaminanardin.fr

Le site est volontairement 100 % statique : aucune dépendance, aucun
framework, aucun outil à installer. Ce script assemble simplement les
contenus de `src/pages/*.html` dans la coquille `src/layout.html`, afin
que l'en-tête, la navigation et le pied de page ne soient écrits qu'une
seule fois.

Usage :
    python3 build.py

Les fichiers HTML produits à la racine sont versionnés : l'hébergement
n'a donc rien à exécuter.
"""

from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
SITE_URL = "https://www.yaminanardin.fr"

# --- Coordonnées : source unique de vérité -------------------------------
# Reprises telles quelles du site existant. Ne rien ajouter ici qui ne
# soit pas vérifié (pas de tarif, pas d'horaire, pas d'e-mail inventé).
TEL_DISPLAY = "07 88 69 71 51"
TEL_HREF = "+33788697151"
ADDRESS_STREET = "21 rue Titon"
ADDRESS_CITY = "75011 Paris"

# --- Navigation : définie une fois, rendue partout -----------------------
# Cinq entrées seulement. Le nom, en haut à gauche, tient lieu de retour à
# l'accueil ; le rendez-vous est traité à part, dans le gabarit.
NAV = [
    ("a-propos.html", "À propos"),
    ("approche.html", "Approche"),
    ("entreprises-institutions.html", "Activités"),
    ("cabinet.html", "Cabinet"),
    ("contact.html", "Contact"),
]

# --- Pages ---------------------------------------------------------------
# slug -> (titre SEO, meta description)
PAGES = {
    "index.html": (
        "Yamina Nardin — Psychanalyste à Paris 11e",
        "Yamina Nardin, psychanalyste à Paris 11e. Approche psychanalytique "
        "multiréférentielle et active intégrative. Cabinet 21 rue Titon, "
        "75011 Paris. Premier entretien sur rendez-vous.",
    ),
    "a-propos.html": (
        "À propos — Yamina Nardin, psychanalyste à Paris",
        "Parcours et certifications de Yamina Nardin, psychanalyste à Paris 11e : "
        "treize ans d’étude et de pratique de la psychanalyse, formations SPAI et "
        "Institut de Médiation Guillaume-Hofnung.",
    ),
    "approche.html": (
        "L’approche — Psychanalyse active intégrative | Yamina Nardin",
        "Une approche multiréférentielle ancrée dans les courants psychanalytiques "
        "centrés sur l’inconscient, ouverte aux thérapies systémiques et cognitives "
        "orientées solution. Cabinet à Paris 11e.",
    ),
    "entreprises-institutions.html": (
        "Entreprises et institutions — Médiation et groupes de parole | Yamina Nardin",
        "Interventions en entreprises et en institutions : médiation, accompagnement "
        "des équipes et groupes de parole, par Yamina Nardin, psychanalyste à Paris.",
    ),
    "cabinet.html": (
        "Le cabinet — 21 rue Titon, Paris 11e | Yamina Nardin",
        "Le cabinet de Yamina Nardin, psychanalyste, 21 rue Titon, 75011 Paris. "
        "Séances de 45 minutes, une fois par semaine, en face à face et / ou sur le divan.",
    ),
    "contact.html": (
        "Contact et rendez-vous — Yamina Nardin, psychanalyste à Paris 11e",
        "Prendre rendez-vous avec Yamina Nardin, psychanalyste à Paris 11e. "
        "Téléphone 07 88 69 71 51, cabinet 21 rue Titon, ou formulaire de contact.",
    ),
    "mentions-legales.html": (
        "Mentions légales — Yamina Nardin",
        "Mentions légales du site de Yamina Nardin, psychanalyste à Paris 11e.",
    ),
    "confidentialite.html": (
        "Politique de confidentialité — Yamina Nardin",
        "Politique de confidentialité du site de Yamina Nardin, psychanalyste à "
        "Paris 11e. Aucun traceur, aucun cookie publicitaire.",
    ),
}

# Pages exclues du sitemap et désindexées des moteurs si besoin
NOINDEX = set()


def render_nav(current):
    """Navigation d'en-tête : intitulés seuls, page courante marquée."""
    items = []
    for slug, label in NAV:
        aria = ' aria-current="page"' if slug == current else ""
        items.append(f'<li><a href="/{slug}"{aria}>{label}</a></li>')
    return "\n        ".join(items)


def render_nav_mobile(current):
    """Tiroir mobile : mêmes entrées, numérotées, précédées de l'accueil."""
    entries = [("index.html", "Accueil")] + NAV + [("contact.html", "Rendez-vous")]
    items = []
    for i, (slug, label) in enumerate(entries):
        href = "/" if slug == "index.html" else f"/{slug}"
        # « Rendez-vous » renvoie vers Contact : on ne le marque pas deux fois.
        aria = ' aria-current="page"' if slug == current and i < len(entries) - 1 else ""
        items.append(
            f'<li><a href="{href}"{aria}><span>{i:02d}</span>{label}</a></li>'
        )
    return "\n      ".join(items)


def render_footer_nav():
    items = [f'<li><a href="/{slug}">{label}</a></li>' for slug, label in NAV]
    return "\n          ".join(items)


def build():
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    written = []

    for slug, (title, description) in PAGES.items():
        page_file = SRC / "pages" / slug
        if not page_file.exists():
            raise SystemExit(f"Contenu manquant : {page_file}")

        content = page_file.read_text(encoding="utf-8")

        # Un bloc JSON-LD optionnel peut être placé en tête du contenu,
        # délimité par <!--JSONLD ... JSONLD-->
        jsonld = ""
        if content.startswith("<!--JSONLD"):
            end = content.index("JSONLD-->")
            jsonld = content[len("<!--JSONLD"):end].strip()
            jsonld = f'<script type="application/ld+json">\n{jsonld}\n</script>'
            content = content[end + len("JSONLD-->"):].lstrip()

        canonical = SITE_URL + ("/" if slug == "index.html" else f"/{slug}")
        robots = (
            '<meta name="robots" content="noindex, follow">'
            if slug in NOINDEX
            else '<meta name="robots" content="index, follow">'
        )

        # Le contenu est inséré d'abord, afin que les jetons de coordonnées
        # qu'il contient soient remplacés au même titre que ceux du gabarit.
        html = (
            layout.replace("{{CONTENT}}", content)
            .replace("{{TITLE}}", title)
            .replace("{{DESCRIPTION}}", description)
            .replace("{{CANONICAL}}", canonical)
            .replace("{{ROBOTS}}", robots)
            .replace("{{JSONLD}}", jsonld)
            .replace("{{NAV}}", render_nav(slug))
            .replace("{{NAV_MOBILE}}", render_nav_mobile(slug))
            .replace("{{FOOTER_NAV}}", render_footer_nav())
            .replace("{{TEL_DISPLAY}}", TEL_DISPLAY)
            .replace("{{TEL_HREF}}", TEL_HREF)
            .replace("{{ADDRESS_STREET}}", ADDRESS_STREET)
            .replace("{{ADDRESS_CITY}}", ADDRESS_CITY)
        )

        if "{{" in html:
            leftover = html[html.index("{{"): html.index("{{") + 40]
            raise SystemExit(f"Jeton non remplacé dans {slug} : {leftover!r}")

        (ROOT / slug).write_text(html, encoding="utf-8")
        written.append(slug)

    # --- sitemap.xml -----------------------------------------------------
    urls = []
    for slug in PAGES:
        if slug in NOINDEX:
            continue
        loc = SITE_URL + ("/" if slug == "index.html" else f"/{slug}")
        priority = "1.0" if slug == "index.html" else "0.8"
        if slug in ("mentions-legales.html", "confidentialite.html"):
            priority = "0.2"
        urls.append(
            f"  <url>\n    <loc>{loc}</loc>\n"
            f"    <changefreq>monthly</changefreq>\n"
            f"    <priority>{priority}</priority>\n  </url>"
        )

    sitemap = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls)
        + "\n</urlset>\n"
    )
    (ROOT / "sitemap.xml").write_text(sitemap, encoding="utf-8")

    # --- robots.txt ------------------------------------------------------
    robots_txt = (
        "User-agent: *\n"
        "Allow: /\n\n"
        f"Sitemap: {SITE_URL}/sitemap.xml\n"
    )
    (ROOT / "robots.txt").write_text(robots_txt, encoding="utf-8")

    print(f"{len(written)} pages générées : {', '.join(written)}")
    print("sitemap.xml et robots.txt mis à jour.")


if __name__ == "__main__":
    build()
