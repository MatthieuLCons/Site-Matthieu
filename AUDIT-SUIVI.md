# Suivi des audits (technique + SEO/GEO) — 31 août 2026

Corrections appliquées au code du site, et ce qu'il reste à faire (actions
hors-code ou nécessitant tes décisions / tes données).

---

## ✅ Fait dans le code

### Sécurité
- **`_headers`** créé : ajoute HSTS, CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy, COOP + cache long pour `/assets/*`.
  → corrige **SEC-001** (6 en-têtes absents).
- **`.assetsignore`** créé : exclut `.git`, `.claude`, `wrangler.jsonc`, `*.md`,
  `serve.ps1`, `node_modules` du déploiement Cloudflare.
  → corrige **SEC-002** (dépôt Git exposé) — *effectif après le prochain deploy*.
- HSTS (`Strict-Transport-Security … preload`) posé → force le HTTPS sur les
  visites suivantes. **SEC-004** : le vrai 301 HTTP→HTTPS se règle avec le
  domaine propre (voir plus bas) ou l'option Cloudflare « Always Use HTTPS ».

### Performance / RGPD
- **Polices auto-hébergées** : `assets/fonts/*.woff2` (Inter + Bricolage
  Grotesque, latin + latin-ext). Le `<link>` Google Fonts et les `preconnect`
  sont supprimés des 4 pages ; `@font-face` local ajouté dans `style.css` avec
  `font-display: swap` + `preload` des 2 woff2 latin.
  → corrige **PRF-002** et le point RGPD (plus aucun appel à Google, plus de
  transfert d'IP visiteur).

### Accessibilité mobile (**MOB-002**)
- Cibles tactiles portées à 44 px : bouton menu, bascule thème, bascule FR/EN,
  logo nav, flèche « scroll ». Liens du pied de page : `min-height: 44px`.
- Tailles de police relevées : liens nav 16 px, boutons 16 px, puces
  compétences ~15 px, libellés `.tag` / `EN` ~13,6 px (libellés secondaires,
  tolérés). Plus aucun texte sous 13 px hors texte masqué.

### Balisage / données structurées / IA
- **`llms.txt`** et **`llms-full.txt`** créés (offre, modalités, FAQ, contact,
  auteur, section « résultats chiffrés » à compléter). → corrige **IA-001**.
- Schéma **`ProfessionalService`** + **`OfferCatalog`** (setting / closing /
  full-cycle) ajouté sur `/` et `/en/`, avec `provider` (Person) et
  `areaServed`.
- Schéma **`WebPage`** avec `dateModified: 2026-08-31` sur les 2 pages.
- **`sitemap.xml`** : `lastmod` ajouté. hreflang réciproques déjà en place
  (l'audit tournait sur une version en ligne plus ancienne).

### Conformité (**CNF-001**)
- `mentions-legales.html` + `en/legal-notice.html` : section **« Vos droits
  (RGPD) »** + coordonnées **CNIL** ajoutées, mention de l'auto-hébergement des
  polices. L'hébergeur (Cloudflare) était déjà présent.

### SEO éditorial — vocabulaire acheteur
- `<title>` et meta description réécrits autour de « externaliser sa
  prospection B2B », « rendez-vous qualifiés », « interlocuteur unique ».
- Hero + section « À propos » : ajout du vocabulaire offre/résultat
  (« externalisez votre prospection », « je décroche des rendez-vous
  qualifiés ») en plus de closer / setter.
- Levée d'homonymie amorcée : « closer B2B » associé au nom dans le title, la
  meta, le schéma et `llms.txt`.

### Divers
- Handler `onerror` inline retiré des `<img>` (incompatible CSP stricte) →
  déplacé dans `script.js` (`img[data-hide-on-error]`).
- `serve.ps1` (dev local) : MIME woff2/txt/xml + service des `index.html` de
  sous-dossiers.

---

## ⏳ À faire — décisions / données de ta part

### 1. Nom de domaine propre (priorité #1 des 2 audits — **INF-002**)
Tu as répondu « pas encore de domaine ». Quand tu en as un
(`matthieu.mkz-consulting.fr` en sous-domaine, ou un domaine dédié) :
1. Cloudflare → Workers → ton projet → **Custom Domains** → ajouter le domaine.
2. Activer **Always Use HTTPS** (règle le 301 HTTP→HTTPS — **SEC-004**).
3. Me redonner la main : je remplace `site-matthieu.mat-leclerc95.workers.dev`
   par le nouveau domaine dans `index.html`, `en/index.html`,
   `mentions-legales.html`, `en/legal-notice.html`, `robots.txt`,
   `sitemap.xml`, `llms.txt`, `llms-full.txt` (canonical, OG, hreflang, schema).
4. Garder une route qui redirige `*.workers.dev` en 301 vers le domaine.

### 2. Chiffres citables (SEO/GEO — E-E-A-T et citabilité IA)
Tu as choisi « je te les donnerai après ». Emplacements déjà prêts :
- `llms-full.txt` → section « Résultats chiffrés » (gabarit en commentaire).
- Il reste à créer des encadrés « à retenir » dans la page une fois les
  chiffres connus (taux de transformation, nb de RDV décrochés sur une période,
  délai moyen 1er contact → signature, 1 étude de cas nommée).

### 3. Images WebP/AVIF (**PRF-001**)
Pas d'outil de conversion disponible dans cet environnement. À faire :
convertir `assets/photo.jpg` et `assets/og-image.png` en `.webp` (via Squoosh,
`cwebp`, ou un plugin), puis servir via `<picture>` avec fallback. Gain estimé
25–35 % sur le poids image.

### 4. Défense en profondeur `.git` (**SEC-002**)
En complément du `.assetsignore`, ajouter une règle **Cloudflare WAF** qui
bloque `/.git/*` (au cas où le fichier serait réintroduit un jour).

### 5. Silo de contenu SEO (audit SEO §6) — chantier éditorial
Pages à créer (nécessitent le détail de ton offre et des cas clients réels) :
- `/externaliser-prospection-b2b` (cible « externaliser sa prospection »)
- `/closing-commercial-externalise` (cible « prise de rendez-vous b2b »)
- `/resultats` (cas clients chiffrés, témoignages nommés)
- Blog : « Setter ou closer, qui fait quoi ? », « Déléguer sa prospection sans
  perdre le contrôle », « Qu'est-ce qu'un lead qualifié ? (BANT/MEDDIC) »

### 6. Hors-site (ni code, ni moi) — rappelé pour mémoire
LinkedIn 2–3 posts/semaine · profils Malt + plateformes de closers ·
3–5 témoignages clients nommés · 2–3 backlinks (dont mkz-consulting.fr).
