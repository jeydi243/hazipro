# Design System Hazipro v2 — Spec

**Date :** 2026-09-21
**Branche :** `feat/design-system-v2`
**Statut :** Design validé par l'utilisateur, en attente de relecture de la spec

## Contexte et pré-mortem de la v1

Hazipro est une app B2B back-office (notes de frais, OP fournisseur, bénéficiaires, grilles tarifaires, matrices d'approbation, workflow, paramétrage). La v1 du design system (`design-system/hazipro/MASTER.md`, générée 2026-08-14) a échoué pour les raisons suivantes, identifiées lors du pré-mortem :

1. **Mauvais style pour le produit** — « SaaS (General) », Glassmorphism et pattern de landing page « Hero + Features + CTA », alors que l'app est dense en données (tables, formulaires, paramétrage).
2. **Palette contradictoire** — deux définitions dans le même fichier (table de mapping vs table des rôles), et le CSS des boutons utilisait l'orange comme primaire alors que le mapping disait bleu.
3. **Spec écrite pour une autre stack** — composants spécifiés en CSS brut (`.btn-primary`, `.card`) alors que l'app est 100 % Nuxt UI v4 + Tailwind v4.
4. **Documentation morte** — Google Fonts CDN dans la spec vs self-hosted `@fontsource-variable` dans le code ; anti-pattern « no dark mode by default » alors que l'app supporte dark/light.
5. **Icônes cassées** — `duo-icons:*`, `hugeicons:*`, `material-symbols:*` utilisées dans le shell et les tables mais non installées (seuls `lucide`, `solar`, `simple-icons` le sont), avec `serverBundle: local` → icônes non rendues.
6. **Restes du template nuxt-ui-pro** — `index.vue` (« Bienvenue sur votre template »), `settings/index.vue` (profil démo « Benjamin Canac »), lien « View page source » vers `github.com/nuxt-ui-pro/dashboard`, teams fictives Nuxt/NuxtHub/NuxtLabs, sélecteur de couleur primary dans le menu utilisateur.
7. **Liens morts** — `/settings/tiers` et `/settings/fournisseurs` dans la sidebar, pages inexistantes.
8. **Classes invalides** — `text-muted` (classe Nuxt UI v3, n'existe plus en v4) à la place de `text-(--ui-text-muted)`.
9. **Styles hors design system** — échelle green custom dans `main.css` (Nuxt UI en a une intégrée), spinner rose `#f03355`, texture `pattern.jpg` sur les headers de modales, overrides de table dupliqués par page, `text-(--ui-text-highlighted)` sur tout le corps des tables.
10. **Dérive copier-coller** — textes mi-français mi-anglais, placeholders copiés d'une page à l'autre (« Rechercher un article… » sur la page Clients), composants Classes réutilisés sur la page NF.

## Décisions validées

| Décision | Choix |
|---|---|
| Périmètre | **Fondation + shell** : MASTER.md v2, tokens appliqués (app.config.ts, main.css), correction du shell (layout, sidebar, menus). Les pages reçoivent des règles de convention et la config de table canonique ; leur restylage complet se fait page par page ensuite. |
| Direction visuelle | **Bleu profond + vert** : primary bleu profond, neutral slate, succès/validation vert, orange/ambre réservé aux alertes. |
| Mode sombre | **Light par défaut, dark disponible** (toggle conservé). |
| Approche | **Tokens-first sur Nuxt UI v4** : thème sémantique via `app.config.ts` + `@theme` Tailwind v4. Pas de couche wrapper de composants, pas de refonte custom. |
| Base de référence | Moteur ui-ux-pro-max : style « Data-Dense Dashboard » (BI, analytics financières, reporting opérationnel), dials variance 4/10, motion 2/10, densité 9/10. |

## 1. Architecture & tokens

**Fichiers sources de vérité :**

- `design-system/hazipro/MASTER.md` — réécrit en v2, décrivant la vraie stack (Nuxt UI v4 + Tailwind v4). Plus de CSS brut, plus de Glassmorphism, plus de pattern landing, plus de snippet GSAP (GSAP n'est pas une dépendance).
- `app/app.config.ts` — couleurs sémantiques Nuxt UI.
- `app/assets/css/main.css` — tokens Tailwind v4 (`@theme static`).

**Modifications `app/app.config.ts` :**

```ts
ui: {
  colors: {
    primary: "hazi",
    neutral: "slate",
    // secondary supprimé : l'orange n'est plus une couleur d'action
  },
}
```

- Supprimer le slot `modal.header` avec `pattern.jpg` (header de modale propre, sans texture).
- Conserver les overrides `dashboardGroup`, `container`, `dashboardPanel` (fonctionnels).

**Modifications `app/assets/css/main.css` :**

- Ajouter dans `@theme static` l'échelle `--color-hazi-50..950` (voir palette §2) ; conserver `--font-sans`.
- Supprimer l'échelle `--color-green-*` custom (le green intégré de Nuxt UI suffit).
- Supprimer la règle `:root:not(.dark) [data-slot="header"]` (texture pattern.jpg).
- Spinner `.loader` : supprimer le rose `#f03355` codé en dur → couleur héritée (`currentColor`), teintée par le contexte (bouton primary).
- Conserver le bloc `prefers-reduced-motion`.
- Conserver `--ui-bg` clair/sombre (#F8FAFC / #020617).

**Config de table canonique partagée :**

- Nouveau fichier `app/utils/table.ts` exportant la config `:ui` de table unique (bordures arrondies, header fond subtil, paddings compacts, nombres à droite en `tabular-nums`).
- Toutes les pages avec `UTable` importent cette config au lieu de leurs overrides `:ui` copiés-collés (6+ occurrences).
- MASTER.md v2 documente cette convention : toute nouvelle page l'utilise obligatoirement.

**MASTER.md v2 contient :** palette, typographie, densité, icônes (Lucide exclusif), conventions composants (boutons, tables, modales, badges), règles de motion/accessibilité, checklist pre-delivery. Aucune contradiction interne : une seule définition par rôle, alignée sur le code.

## 2. Palette

### Échelle primary « hazi » (bleu profond)

| Token | Valeur | Usage |
|---|---|---|
| hazi-50 | `#EFF4FF` | fonds bleutés |
| hazi-100 | `#DBEAFE` | badges, fonds de survol |
| hazi-200 | `#BFDBFE` | bordures sélection |
| hazi-300 | `#93C5FD` | accents discrets |
| hazi-400 | `#3B82F6` | **primary en mode sombre** |
| hazi-500 | `#1E40AF` | **primary clair** (boutons, liens, focus) |
| hazi-600 | `#172E6B` | hover primary clair |
| hazi-700 | `#122556` | texte sur fonds clairs (contraste) |
| hazi-800 | `#0D1B42` | textes bleus foncés |
| hazi-900 | `#09122E` | fonds brand |
| hazi-950 | `#050B1D` | réservé |

### Rôles sémantiques

| Rôle | Clair | Sombre | Notes |
|---|---|---|---|
| Primary | hazi-500 `#1E40AF` | hazi-400 `#3B82F6` | contraste 8.7:1 avec blanc ✓ |
| Neutral | slate (intégré) | slate | inchangé |
| Succès / validation | green-600 `#16A34A` (badges/texte : green-700) | green-500 | scale intégrée Nuxt UI |
| Alerte / attention | amber-600 `#D97706` (badges/texte : amber-800) | amber-500 | **réservé aux alertes, jamais en CTA** |
| Erreur | red-600 `#DC2626` | red-500 | intégré |
| Fond | `#F8FAFC` (slate-50) | `#020617` (slate-950) | inchangé |
| Carte | `#FFFFFF` | slate-900 | bordure slate-200 / slate-800 |
| Muted | slate-500 `#64748B` | slate-400 | textes secondaires |

Règles : texte ≥ 4.5:1 (clair et sombre), bordures/icônes ≥ 3:1, `#000000` jamais utilisé comme texte sur fond clair (préférer slate-900 `#0F172A`).

## 3. Typographie & densité

- **Font : Plus Jakarta Sans Variable**, conservée (self-hosted `@fontsource-variable`, continuité de marque). Pas de changement de font.
- **Chiffres tabulaires** : `font-variant-numeric: tabular-nums` (utilitaire Tailwind `tabular-nums`) sur toutes les colonnes numériques (codes, montants, taux, NIF).
- **Densité 9/10** :
  - Tables : paddings cellule `px-2 py-1.5`, corps 13px.
  - Cartes et sections : espacements serrés (gap 12–16px).
  - Formulaires : inputs 16px, labels visibles au-dessus du champ.
- **Hiérarchie de texte** : libellé principal (nom/code) en `text-(--ui-text-highlighted)` ; tout le reste du corps de table en `text-(--ui-text-muted)` ; titres de page en `text-(--ui-text-highlighted)` semibold.
- Interdits : corps < 12px, texte tout-majuscules hors badges.

## 4. Iconographie & composants

### Icônes

- **Lucide exclusivement** pour toute icône UI. `simple-icons` uniquement pour des logos de marque (aucun usage actuel après suppression du lien GitHub).
- Remplacements dans le shell : `duo-icons:id-card` → `i-lucide-id-card`, `duo-icons:user` → `i-lucide-users`, `hugeicons:workflow-circle-05` → `i-lucide-workflow`, tous les `solar:*` → équivalents Lucide (settings, list-tree, building-2, grid-2x2, percent, tags, users, shield, package, handshake).
- Remplacements dans les tables : `material-symbols:*` → `i-lucide-pencil`, `i-lucide-maximize-2`, `i-lucide-link` selon le cas.
- Tout bouton icône-seul garde un `aria-label` (déjà en place, à préserver).

### Conventions composants

- **Boutons** : une seule action primary (plein, hazi) par écran ; actions secondaires `variant="outline"` ou `soft` ; actions de ligne `color="neutral" variant="ghost"` ; destructive uniquement dans les confirmations. Plus jamais `color="secondary"` orange.
- **Tables** : config canonique partagée (§1) ; header sur fond `--ui-bg-elevated`/50 ; actions en fin de ligne ; nombres alignés à droite ; pagination standard.
- **Modales / drawers** : header propre (titre + description), footer Annuler (ghost neutral) / Confirmer (primary), destruction avec `color="error"`.
- **Badges** : fond `*-50`, texte `*-700` en clair (fond `*-400/10`, texte `*-300` en sombre) pour succès/alerte/erreur ; neutre = slate.
- **Menu utilisateur** : pas de sélecteur de couleur primary (l'identité de marque n'est pas une préférence utilisateur) ; toggle light/dark conservé.

## 5. Shell & corrections

### `app/layouts/default.vue`

- Corriger tous les préfixes d'icônes (Lucide, cf. §4).
- Supprimer les entrées mortes `Tiers` (`/settings/tiers`) et `Fournisseurs` (`/settings/fournisseurs`) du groupe « Workflow & Task » — elles reviendront avec leurs pages.
- Supprimer le groupe « Code / View page source » (lien vers `nuxt-ui-pro/dashboard`).
- Sidebar : `class="bg-(--ui-bg-elevated)/25"` → token standard sans hack d'opacité.
- Conserver le comportement responsive (mode modal, collapsible, resizable).

### `app/components/TeamsMenu.vue`

- Remplacer les teams fictives (Nuxt, NuxtHub, NuxtLabs) par les **organisations réelles** de l'utilisateur : même source de données que `app/pages/settings/organisations.vue` (table Supabase `organisations`, en lecture).
- « Create team » : supprimé (la création reste dans la page Paramètres → Organisations).
- « Manage teams » : renommé « Gérer les organisations », lien vers `/settings/organisations`.

### `app/components/UserMenu.vue`

- Remplacer « Benjamin Canac » par l'utilisateur authentifié (`useAuth()`) : nom + avatar depuis Supabase Auth.
- Supprimer la section « Theme » (sélecteur de couleur primary) ; conserver « Appearance » (Light/Dark).
- Supprimer l'item « Documentation » (lien ui.nuxt.com).
- Conserver Profile → `/profile`, Paramètres → `/settings`, Log out avec modale de confirmation.

### `app/pages/index.vue`

- Remplacer le contenu template par un tableau de bord minimal honnête : titre « Tableau de bord », carte d'accueil Hazipro, accès rapides vers les modules existants (Note de frais `/nf`, OP Fournisseur `/op`, Bénéficiaires `/beneficiaires`, Paramètres `/settings`). Aucune nouvelle feature, aucun widget de données.

### `app/pages/settings/index.vue`

- Supprimer le formulaire de profil démo nuxt-ui-pro.
- Remplacer par un hub : liste de liens vers les sections de paramétrage existantes (lookups, organisations, matrices, taux, tarifaire, users, roles, articles, clients, security, notifications, access), avec icône Lucide + description courte.

### Classes invalides

- Remplacer `text-muted` → `text-(--ui-text-muted)` partout où il apparaît (shell + pages touchées). `grep` systématique, zéro occurrence restante.

## 6. Motion & accessibilité

- **Motion subtile** : transitions 150–200ms uniquement (hover, focus, ouverture modales). Pas d'animation d'entrée sur les tables. `prefers-reduced-motion` conservé (déjà en place dans `main.css`).
- **Focus visibles** : ring primary (hazi-500 clair / hazi-400 sombre) sur tout élément focusable — défaut Nuxt UI, documenté comme exigence dans MASTER.md v2.
- **Contraste** : ≥ 4.5:1 textes (clair et sombre), ≥ 3:1 éléments graphiques.
- **Cibles tactiles** : boutons d'action ≥ 40×40px (44 recommandé) ; sur mobile, les tables utilisent le scroll horizontal (`overflow-x-auto`), pas la casse du layout.
- **A11y conservée** : `aria-label` sur boutons icônes, navigation clavier (défaut Nuxt UI), labels visibles sur les formulaires.

## 7. Vérification

- `bun run lint` : zéro erreur.
- `bun run typecheck` : zéro erreur.
- `bun run dev` : passe visuelle (clair + sombre) sur `/`, `/nf`, `/op`, `/beneficiaires`, `/workflow`, `/settings` et chaque sous-page — toutes les icônes du shell et des tables s'affichent, aucun lien mort dans la nav, contrastes conformes §6.
- MASTER.md v2 relu : aucune contradiction interne, chaque règle vérifiable dans le code.
- Pas de tests unitaires ajoutés (styling + shell ; couvert par lint/typecheck + passe visuelle).

## Hors périmètre (non-goals)

- Pas de restylage complet page par page (seule la config de table + les icônes s'appliquent partout ; le reste suivra page par page).
- Pas de nouveaux modules ni de nouvelles features.
- Pas de couche wrapper de composants.
- Pas de changement de font.
- Pas de tests visuels automatisés (pas d'infra en place).
