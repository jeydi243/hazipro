# Design System Hazipro v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer le design system v1 (contradictoire, cassé, hérité du template nuxt-ui-pro) par une fondation v2 tokens-first sur Nuxt UI v4 — bleu profond + vert, densité 9/10, Lucide exclusif — et corriger le shell (sidebar, menus, pages d'accueil).

**Architecture:** Tokens sémantiques dans `app/app.config.ts` (`ui.colors.primary = "hazi"`, suppression de `secondary`) + échelle Tailwind v4 dans `app/assets/css/main.css` (`@theme static`). Conventions partagées : config de table canonique dans `app/utils/table.ts`, MASTER.md v2 comme source de vérité documentaire. Aucune nouvelle dépendance, aucun composant wrapper.

**Tech Stack:** Nuxt 4, Nuxt UI v4.10, Tailwind CSS v4, TypeScript, Pinia, Supabase, Vue 3.5.

**Spec de référence :** `docs/superpowers/specs/2026-09-21-design-system-v2-design.md`

**Stratégie de test :** Pas de tests unitaires ajoutés (spec §7). Vérification = `bun run lint`, `bun run typecheck`, greps de conformité, passe visuelle en `bun run dev`.

## Global Constraints

- Branche de travail : `feat/design-system-v2` (déjà créée). Ne jamais committer sur `main`.
- Le working tree contient des modifications préexistantes non liées (`app/stores/*`, `app/components/matrices/*`, `app/pages/auth.vue`, `app/types/index.ts`, etc.) : chaque commit n'ajoute **que les fichiers listés dans la tâche** (`git add <fichiers précis>`, jamais `git add -A`).
- Texte d'UI en français.
- Icônes : préfixe `i-lucide-` uniquement. Interdit : `duo-icons:*`, `hugeicons:*`, `material-symbols:*`, `solar:*` dans `app/`.
- Interdit : classe `text-muted` (v3) — utiliser `text-(--ui-text-muted)`.
- Interdit : `color="secondary"` (supprimé du thème).
- Contraste texte ≥ 4.5:1 clair et sombre ; cibles interactives ≥ 40px ; transitions 150–200ms ; `prefers-reduced-motion` respecté.
- Light par défaut, dark disponible (toggle conservé).
- Pas de nouvelle dépendance ; ne pas toucher `package.json`.
- Palette exacte (spec §2) : hazi-500 `#1E40AF`, hazi-400 `#3B82F6`, hazi-600 `#172E6B` ; fond `#F8FAFC`/`#020617` ; succès green-600, alerte amber-600, erreur red-600.

---

### Task 1: Thème sémantique — app.config.ts + main.css + purge secondary

**Files:**
- Modify: `app/app.config.ts`
- Modify: `app/assets/css/main.css`
- Delete: `app/assets/img/pattern.jpg`
- Modify: `app/components/users/Details.vue:83,101`
- Modify: `app/components/tarifaires/Details.vue:37`

**Interfaces:**
- Produces: échelle `--color-hazi-50..950` (consommée par Nuxt UI via `ui.colors.primary = "hazi"`), token `--ui-bg` inchangé, plus aucun `ui.colors.secondary`.

- [ ] **Step 1: Baseline**

Run: `bun run lint; bun run typecheck`
Expected: noter les erreurs existantes (il peut y en avoir, le working tree contient des modifications préexistantes). Ce sont la baseline ; ne pas les corriger dans ce plan.

- [ ] **Step 2: Remplacer `app/app.config.ts`**

Contenu complet du fichier :

```ts
export default defineAppConfig({
    ui: {
        colors: {
            primary: "hazi",
            neutral: "slate",
        },
        dashboardGroup: {
            base: "fixed inset-0 flex overflow-hidden",
        },
        container: {
            base: "w-full mx-auto px-4 sm:px-6 lg:px-5",
        },
        modal: {
            slots: {
                content: "bg-(--ui-bg) dark:bg-(--ui-bg)",
            },
        },
        dashboardPanel: {
            slots: {
                body:
                    "flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-2 sm:p-0",
                handle: "",
            },
            variants: {
                size: {
                    true: {
                        root: "w-full lg:w-(--width)",
                    },
                    false: {
                        root: "flex-1",
                    },
                },
            },
        },
    },
});
```

Différences avec l'existant : `primary: "blue"` → `"hazi"`, suppression de `secondary: "orange"`, suppression du slot `header` (texture pattern.jpg) dans `modal.slots`.

- [ ] **Step 3: Remplacer `app/assets/css/main.css`**

Contenu complet du fichier :

```css
@import "tailwindcss" theme(static);
@import "@nuxt/ui";
@import "@fontsource-variable/plus-jakarta-sans";

@layer base {
  :root {
    --ui-bg: #F8FAFC; /* slate-50 - fond design system Hazipro */
  }

  .dark {
    --ui-bg: #020617; /* On s'assure que le mode sombre reste profond */
  }
}

@theme static {
  --font-sans: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', sans-serif;

  --color-hazi-50: #EFF4FF;
  --color-hazi-100: #DBEAFE;
  --color-hazi-200: #BFDBFE;
  --color-hazi-300: #93C5FD;
  --color-hazi-400: #3B82F6;
  --color-hazi-500: #1E40AF;
  --color-hazi-600: #172E6B;
  --color-hazi-700: #122556;
  --color-hazi-800: #0D1B42;
  --color-hazi-900: #09122E;
  --color-hazi-950: #050B1D;
}

/* Respect des préférences de mouvement réduit */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Spinner de chargement (bouton de connexion) — couleur héritée du contexte */
.loader {
  width: 50px;
  --b: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  padding: 1px;
  background: conic-gradient(#0000 10%, currentColor) content-box;
  -webkit-mask:
    repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
    radial-gradient(farthest-side, #0000 calc(100% - var(--b) - 1px), #000 calc(100% - var(--b)));
  -webkit-mask-composite: destination-in;
  mask-composite: intersect;
  animation: l4 1s infinite steps(10);
}
@keyframes l4 { to { transform: rotate(1turn) } }

/* Variante compacte pour les boutons */
.loader--sm {
  width: 1.1rem;
  --b: 2px;
}
```

Différences avec l'existant : suppression de l'échelle `--color-green-*` custom, suppression de la règle `:root:not(.dark) [data-slot="header"]` (pattern.jpg), spinner `var(--color-spinner, #f03355)` → `currentColor`.

- [ ] **Step 4: Supprimer l'asset pattern.jpg**

Run: `rm app/assets/img/pattern.jpg`

- [ ] **Step 5: Purger `color="secondary"` (3 occurrences)**

Dans `app/components/users/Details.vue` (2×) et `app/components/tarifaires/Details.vue` (1×), remplacer littéralement :

`color="secondary" variant="solid"` → `color="neutral" variant="solid"`

(Edit `replace_all: true` par fichier ; ces actions « stop/retirer » deviennent neutres — l'erreur est réservée aux confirmations selon la spec.)

- [ ] **Step 6: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: mêmes erreurs que la baseline, pas de nouvelles. `bun run dev` → ouvrir `/` : les boutons primary sont bleu profond `#1E40AF`, aucune texture sur les headers de modales, le spinner du login est blanc.

- [ ] **Step 7: Commit**

```bash
git add app/app.config.ts app/assets/css/main.css app/assets/img/pattern.jpg app/components/users/Details.vue app/components/tarifaires/Details.vue
git commit -m "feat(design-system): thème hazi bleu profond, suppression secondary et pattern.jpg"
```

---

### Task 2: MASTER.md v2

**Files:**
- Modify: `design-system/hazipro/MASTER.md`

**Interfaces:**
- Consumes: palette hazi et tokens de la Task 1 (doit être aligné sur le code).

- [ ] **Step 1: Remplacer `design-system/hazipro/MASTER.md`**

Contenu complet du fichier :

```markdown
# Design System Master File — Hazipro v2

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Hazipro (back-office B2B : notes de frais, OP fournisseur, bénéficiaires, grilles tarifaires, matrices, workflow)
**Version:** v2
**Updated:** 2026-09-21
**Style:** Data-Dense Dashboard (light par défaut, dark disponible)
**Design Dials:** Variance 4/10 (Balanced / Modern) | Motion 2/10 (Subtle) | Density 9/10 (Dense)

---

## Implementation Mapping (Nuxt UI v4)

| Design System Role | Nuxt UI token | Value |
|--------------------|---------------|-------|
| Primary | `ui.colors.primary` | `hazi` (échelle bleu profond custom, `--color-hazi-*`) |
| Neutral | `ui.colors.neutral` | `slate` |
| Succès | `success` (intégré) | green |
| Alerte | `warning` (intégré) | amber |
| Erreur | `error` (intégré) | red |
| Background | `--ui-bg` | `#F8FAFC` (clair) / `#020617` (sombre) |
| Font | `--font-sans` | Plus Jakarta Sans Variable (self-hosted) |

- Config : `app/app.config.ts` + `app/assets/css/main.css`
- Aucun `secondary` : l'orange n'est plus une couleur d'action. Les alertes utilisent `warning` (amber).
- Tables : config canonique `haziTableUi` / `haziTableUiEmbedded` depuis `app/utils/table.ts`. Ne jamais réécrire d'overrides `:ui` inline sur `UTable`.

---

## Color Palette

### Primary — échelle `hazi` (bleu profond)

| Token | Hex |
|-------|-----|
| hazi-50 | `#EFF4FF` |
| hazi-100 | `#DBEAFE` |
| hazi-200 | `#BFDBFE` |
| hazi-300 | `#93C5FD` |
| hazi-400 | `#3B82F6` |
| hazi-500 | `#1E40AF` |
| hazi-600 | `#172E6B` |
| hazi-700 | `#122556` |
| hazi-800 | `#0D1B42` |
| hazi-900 | `#09122E` |
| hazi-950 | `#050B1D` |

- Primary clair : hazi-500 (contraste 8.7:1 sur blanc). Hover : hazi-600.
- Primary sombre : hazi-400.

### Rôles sémantiques

| Rôle | Clair | Sombre |
|------|-------|--------|
| Primary | `#1E40AF` (hazi-500) | `#3B82F6` (hazi-400) |
| Succès | green-600 ; texte/badges green-700 | green-500 |
| Alerte | amber-600 ; texte/badges amber-800 | amber-500 |
| Erreur | `#DC2626` | red-500 |
| Fond | `#F8FAFC` | `#020617` |
| Carte | `#FFFFFF` | slate-900 |
| Bordure | slate-200 | slate-800 |
| Texte secondaire | slate-500 | slate-400 |

Règles : texte ≥ 4.5:1 (clair et sombre) ; bordures/icônes ≥ 3:1 ; jamais de texte `#000000` pur sur fond clair.

## Typography

- **Font unique :** Plus Jakarta Sans Variable (self-hosted via `@fontsource-variable/plus-jakarta-sans`).
- **Chiffres tabulaires :** toute colonne numérique (montants, taux, codes, NIF) utilise `tabular-nums`.
- **Hiérarchie :** titre de page semibold ; libellé principal (nom/code) en `text-(--ui-text-highlighted)` ; reste du corps de table en `text-(--ui-text-muted)`.
- **Densité 9/10 :** corps de table 13px, cellules `px-2 py-1.5` ; formulaires 16px ; cibles interactives ≥ 40px (44 recommandé).
- Interdits : corps < 12px, uppercase hors badges.

## Icons

- **Lucide exclusivement** (préfixe `i-lucide-`). Tout autre set est interdit dans l'UI.
- Boutons icône-seuls : `aria-label` obligatoire.

## Components

- **Buttons :** une seule action primary par écran ; secondaires en `variant="outline"`/`soft` ; actions de ligne `color="neutral" variant="ghost"` ; destructive uniquement dans une confirmation.
- **Tables :** `:ui="haziTableUi"` (page) ou `haziTableUiEmbedded` (détails). Header fond subtil, actions en fin de ligne, pagination standard, `overflow-x-auto` sur mobile.
- **Modals/Drawers :** header propre (titre + description), footer Annuler (ghost) / Confirmer (primary).
- **Badges :** fond `*-50` + texte `*-700` (clair) / fond `*-400/10` + texte `*-300` (sombre).

## Motion & Accessibility

- Transitions 150–200ms uniquement ; `prefers-reduced-motion` respecté (règle globale dans `main.css`).
- Focus visible : ring hazi (500 clair / 400 sombre).
- Pas d'emoji comme icônes ; pas de texte en image ; labels de formulaire visibles.

## Anti-Patterns (Do NOT Use)

- ❌ Glassmorphism, textures décoratives (pattern.jpg supprimé)
- ❌ Couleurs codées en dur dans les composants (tokens uniquement)
- ❌ Overrides `:ui` inline sur `UTable` (config canonique uniquement)
- ❌ `color="secondary"` (supprimé)
- ❌ Icônes hors Lucide
- ❌ Dark mode par défaut (light par défaut, dark disponible)
- ❌ Animation excessive ; transitions > 300ms

## Pre-Delivery Checklist

- [ ] Icônes Lucide uniquement
- [ ] `aria-label` sur boutons icônes
- [ ] Contraste texte 4.5:1 (clair et sombre)
- [ ] Focus visibles
- [ ] `prefers-reduced-motion` respecté
- [ ] Responsive : 375px, 768px, 1024px, 1440px ; tables en scroll horizontal sur mobile
- [ ] Aucun `text-muted`, `material-symbols:*`, `solar:*`, `duo-icons:*`, `hugeicons:*`, `color="secondary"` dans `app/`
```

- [ ] **Step 2: Relecture de cohérence**

Vérifier : une seule définition par rôle ; les valeurs `hazi-*` correspondent exactement à `main.css` ; aucun snippet CSS brut, aucun GSAP, aucun pattern landing. Corriger inline si écart.

- [ ] **Step 3: Commit**

```bash
git add design-system/hazipro/MASTER.md
git commit -m "docs(design-system): MASTER.md v2 aligné sur le code (tokens-first Nuxt UI)"
```

---

### Task 3: Config de table canonique — app/utils/table.ts + 14 pages

**Files:**
- Create: `app/utils/table.ts`
- Modify (14 pages, remplacement du `:ui` du `UTable` + import) : `app/pages/workflow.vue`, `app/pages/nf.vue`, `app/pages/op.vue`, `app/pages/beneficiaires.vue`, `app/pages/settings/clients.vue`, `app/pages/settings/articles.vue`, `app/pages/settings/access.vue`, `app/pages/settings/lookups.vue`, `app/pages/settings/matrices.vue`, `app/pages/settings/organisations.vue`, `app/pages/settings/roles.vue`, `app/pages/settings/taux.vue`, `app/pages/settings/users.vue`, `app/pages/settings/tarifaire.vue`

**Interfaces:**
- Produces: `haziTableUi` (config `:ui` pour `UTable` standalone, importable depuis `~/utils/table`), consommée ici et par la Task 4 (`haziTableUiEmbedded` définie à la Task 4).

- [ ] **Step 1: Créer `app/utils/table.ts`**

```ts
import type { ComponentProps } from 'vue'
import type { UTable } from '#components'

export type TableUi = ComponentProps<typeof UTable>['ui']

// Table standalone d'une page CRUD : bordures arrondies, header subtil,
// paddings compacts, chiffres tabulaires (alignement des montants/codes).
export const haziTableUi: TableUi = {
    base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-lg',
    thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
    tbody: '[&>tr]:last:[&>td]:border-b-0',
    th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r pl-2',
    td: 'border-b border-(--ui-border) p-2 tabular-nums',
}
```

(Nota : `ComponentProps` est exporté par Vue 3.5 ; `#components` est fourni par Nuxt.)

- [ ] **Step 2: Appliquer aux 14 pages**

Pour **chacune** des 14 pages listées, avec l'outil Read puis Edit :

1. Dans `<script setup>`, ajouter l'import : `import { haziTableUi } from '~/utils/table'`
2. Remplacer l'attribut `:ui="..."` du `UTable` (l'objet dont la première clé est `base: 'table-fixed border-separate border-spacing-0 ...'`) par `:ui="haziTableUi"`.
3. Conserver tous les autres attributs du `UTable` (`class`, `v-model:*`, `:data`, `:columns`, `:loading`, etc.) et ne toucher à rien d'autre dans le fichier.

Emplacement de l'attribut à remplacer (ligne du `base:` dans chaque fichier) :
- `app/pages/workflow.vue:19` · `app/pages/nf.vue:19` · `app/pages/op.vue:19` · `app/pages/beneficiaires.vue:20`
- `app/pages/settings/clients.vue:24` · `app/pages/settings/articles.vue:24` · `app/pages/settings/access.vue:24` · `app/pages/settings/lookups.vue:18` · `app/pages/settings/matrices.vue:39` · `app/pages/settings/organisations.vue:39` · `app/pages/settings/roles.vue:65` · `app/pages/settings/taux.vue:39` · `app/pages/settings/users.vue:64` · `app/pages/settings/tarifaire.vue:38`

(Les variantes actuelles diffèrent légèrement : `rounded-xl` sur clients, absence de bordures sur tarifaire, etc. — la config canonique les normalise toutes.)

- [ ] **Step 3: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs vs baseline. `bun run dev` → `/nf`, `/op`, `/beneficiaires`, `/settings/clients`, `/settings/articles`, `/settings/taux`, `/settings/matrices`, `/settings/organisations`, `/settings/roles`, `/settings/users`, `/settings/tarifaire`, `/settings/lookups`, `/settings/access` : tables arrondies, header subtil, cellules compactes, chiffres tabulaires.

- [ ] **Step 4: Commit**

```bash
git add app/utils/table.ts app/pages/workflow.vue app/pages/nf.vue app/pages/op.vue app/pages/beneficiaires.vue app/pages/settings/clients.vue app/pages/settings/articles.vue app/pages/settings/access.vue app/pages/settings/lookups.vue app/pages/settings/matrices.vue app/pages/settings/organisations.vue app/pages/settings/roles.vue app/pages/settings/taux.vue app/pages/settings/users.vue app/pages/settings/tarifaire.vue
git commit -m "feat(design-system): config de table canonique partagée sur les pages CRUD"
```

---

### Task 4: Config de table embarquée — 8 composants Details + ListeLookups

**Files:**
- Modify: `app/utils/table.ts` (ajout de `haziTableUiEmbedded`)
- Modify: `app/components/clients/Details.vue`, `app/components/roles/Details.vue`, `app/components/articles/Details.vue`, `app/components/users/Details.vue`, `app/components/tarifaires/Details.vue`, `app/components/point-facturation/Details.vue`, `app/components/matrices/Details.vue`, `app/components/organisations/Details.vue`, `app/components/classes/ListeLookups.vue`

**Interfaces:**
- Consumes: `haziTableUi` (Task 3).
- Produces: `haziTableUiEmbedded` — variante pour tables dans les tiroirs de détails (coins supérieurs arrondis seulement).

- [ ] **Step 1: Ajouter `haziTableUiEmbedded` à `app/utils/table.ts`**

Après la définition de `haziTableUi`, ajouter :

```ts
// Table embarquée dans un tiroir de détails : mêmes réglages,
// coins supérieurs seuls arrondis.
export const haziTableUiEmbedded: TableUi = {
    ...haziTableUi,
    base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
    th: 'py-1 border-y border-(--ui-border) first:border-l last:border-r pl-2',
}
```

- [ ] **Step 2: Appliquer aux tables embarquées**

Pour chaque fichier, remplacer l'attribut `:ui="..."` de chaque `UTable` (objet commençant par `base: 'table-fixed ...'`) par `:ui="haziTableUiEmbedded"` et ajouter l'import `import { haziTableUiEmbedded } from '~/utils/table'` dans `<script setup>`. Rien d'autre ne change.

Emplacements (ligne du `base:` par fichier ; certains en ont 2) :
- `app/components/clients/Details.vue:169`
- `app/components/roles/Details.vue:156`
- `app/components/articles/Details.vue:193`
- `app/components/users/Details.vue:44` et `:62`
- `app/components/tarifaires/Details.vue:17`
- `app/components/point-facturation/Details.vue:157` et `:179`
- `app/components/matrices/Details.vue:123`
- `app/components/organisations/Details.vue:155` et `:177`

Et pour `app/components/classes/ListeLookups.vue:20` (table standalone dans un slideover, bordures complètes déjà présentes) : remplacer par `:ui="haziTableUi"` + import `import { haziTableUi } from '~/utils/table'`.

- [ ] **Step 3: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs. `bun run dev` → ouvrir un tiroir de détails (ex. `/settings/clients` → détails d'un client, `/settings/users` → détails) : table embarquée avec bordures et coins supérieurs arrondis.

- [ ] **Step 4: Commit**

```bash
git add app/utils/table.ts app/components/clients/Details.vue app/components/roles/Details.vue app/components/articles/Details.vue app/components/users/Details.vue app/components/tarifaires/Details.vue app/components/point-facturation/Details.vue app/components/matrices/Details.vue app/components/organisations/Details.vue app/components/classes/ListeLookups.vue
git commit -m "feat(design-system): config de table canonique sur les composants de détails"
```

---

### Task 5: Icônes — Lucide exclusif partout

**Files:**
- Modify (shell) : `app/layouts/default.vue`
- Modify (tables/détails, remplacements littéraux uniques) : `app/pages/workflow.vue`, `app/pages/nf.vue`, `app/pages/op.vue`, `app/pages/beneficiaires.vue`, `app/pages/settings/clients.vue`, `app/pages/settings/articles.vue`, `app/pages/settings/access.vue`, `app/pages/settings/lookups.vue`, `app/pages/settings/roles.vue`, `app/pages/settings/users.vue`, `app/pages/settings/tarifaire.vue`, `app/components/classes/ListeLookups.vue`, `app/components/users/AddRole.vue`

**Interfaces:**
- Consumes: rien de nouveau. Produit l'état « zéro icône hors Lucide » vérifié à la Task 10.

- [ ] **Step 1: Remplacer les icônes cassées (remplacements littéraux uniques par fichier)**

Pour chaque fichier ci-dessous, Edit littéral (chaque chaîne n'apparaît qu'une fois dans son fichier) :

| Fichier | `old_string` | `new_string` |
|---|---|---|
| `app/pages/workflow.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/nf.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/op.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/beneficiaires.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/lookups.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/roles.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/users.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/articles.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/access.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/clients.vue` | `material-symbols:open-in-full-rounded` | `i-lucide-maximize-2` |
| `app/pages/settings/clients.vue` | `material-symbols:edit-outline-sharp` | `i-lucide-pencil` |
| `app/pages/settings/clients.vue` | `material-symbols-light:add-link` | `i-lucide-link` |
| `app/pages/settings/articles.vue` | `material-symbols-light:add-link` | `i-lucide-link` |
| `app/pages/settings/access.vue` | `material-symbols-light:add-link` | `i-lucide-link` |
| `app/components/classes/ListeLookups.vue` | `material-symbols:edit-outline-rounded` | `i-lucide-pencil` |
| `app/components/users/AddRole.vue` | `material-symbols:add` | `i-lucide-plus` |
| `app/pages/settings/tarifaire.vue` | `solar:pen-new-square-line-duotone` | `i-lucide-square-pen` |

(Attention : plusieurs `Edit` sur un même fichier doivent être séquentiels, relire le fichier entre deux edits si nécessaire.)

- [ ] **Step 2: Remplacer les icônes de la sidebar (`app/layouts/default.vue`)**

Edits littéraux avec contexte (les `solar:card-transfer-bold-duotone` sont dupliqués — toujours inclure la ligne `label` dans `old_string`) :

| Contexte (`old_string` inclut label + icon) | `new_string` |
|---|---|
| `label: 'Note de frais',` puis `icon: 'duo-icons:id-card',` | `icon: 'i-lucide-id-card',` |
| `label: 'Bénéficiaires',` puis `icon: 'duo-icons:user',` | `icon: 'i-lucide-users',` |
| `icon: 'hugeicons:workflow-circle-05',` | `icon: 'i-lucide-workflow',` |
| `label: 'Workflow & Task',` puis `icon: 'solar:settings-bold-duotone',` puis `to: '/workflow',` | `icon: 'i-lucide-workflow',` |
| `label: 'Parametres',` puis `icon: 'solar:settings-bold-duotone',` puis `to: '/settings',` | `icon: 'i-lucide-settings',` |
| `label: 'Classes & Lookups',` … `icon: 'solar:card-transfer-bold-duotone',` | `icon: 'i-lucide-list-tree',` |
| `label: 'Organisations',` … `icon: 'solar:card-transfer-bold-duotone',` | `icon: 'i-lucide-building-2',` |
| `label: 'Matrices',` … `icon: 'solar:card-transfer-bold-duotone',` | `icon: 'i-lucide-grid-2x2',` |
| `label: 'Taux',` … `icon: 'solar:card-transfer-bold-duotone',` | `icon: 'i-lucide-percent',` |
| `label: 'Grille tarifaire',` puis `icon: 'solar:tag-price-bold-duotone',` | `icon: 'i-lucide-tags',` |
| `label: 'Utilisateurs',` puis `icon: 'solar:users-group-two-rounded-line-duotone',` | `icon: 'i-lucide-users',` |
| `label: 'Roles',` puis `icon: 'solar:user-id-bold-duotone',` | `icon: 'i-lucide-shield',` |
| `label: 'Articles',` puis `icon: 'solar:layers-minimalistic-bold-duotone',` | `icon: 'i-lucide-package',` |
| `label: 'Clients',` puis `icon: 'solar:users-group-two-rounded-bold-duotone',` | `icon: 'i-lucide-handshake',` |

(La structure exacte est dans `app/layouts/default.vue` : l'objet de chaque lien a les clés dans l'ordre `label`, `to`, `icon` ou `label`, `icon`, `to` — copier les lignes réelles du fichier pour construire `old_string`.)

- [ ] **Step 3: Supprimer les entrées mortes « Tiers » et « Fournisseurs » (toujours dans `app/layouts/default.vue`)**

Supprimer le bloc complet des deux objets du groupe « Workflow & Task » (y compris la ligne vide intermédiaire et la virgule pendante), en copiant le contenu réel actuel du fichier pour construire `old_string` :

```
            {
                label: 'Tiers',
                to: '/settings/tiers',
                icon: 'solar:card-transfer-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
           
            {
                label: 'Fournisseurs',
                to: '/settings/fournisseurs',
                icon: 'solar:users-group-two-rounded-line-duotone',
                onSelect: () => {
                    open.value = false
                }
            }
```

(Suppression nécessaire ici : ces entrées portent des icônes `solar:` et pointent vers des pages inexistantes — sans elle, le grep du Step 4 échouerait.)

Après suppression, le groupe « Workflow & Task » ne contient que l'enfant `Workflow & Task` (`to: '/workflow'`, `exact: true`).

- [ ] **Step 4: Vérifier**

Run: `bun run lint; bun run typecheck`
Run: `grep -rn "material-symbols\|solar:\|duo-icons\|hugeicons" app/ || echo "AUCUNE OCCURRENCE"`
Expected: « AUCUNE OCCURRENCE ». `bun run dev` → sidebar et tables : toutes les icônes s'affichent ; sidebar sans « Tiers »/« Fournisseurs ».

- [ ] **Step 5: Commit**

```bash
git add app/layouts/default.vue app/pages/workflow.vue app/pages/nf.vue app/pages/op.vue app/pages/beneficiaires.vue app/pages/settings/clients.vue app/pages/settings/articles.vue app/pages/settings/access.vue app/pages/settings/lookups.vue app/pages/settings/roles.vue app/pages/settings/users.vue app/pages/settings/tarifaire.vue app/components/classes/ListeLookups.vue app/components/users/AddRole.vue
git commit -m "fix(design-system): icônes Lucide exclusives (remplace les sets cassés)"
```

---

### Task 6: Purge de la classe invalide `text-muted`

**Files:** 19 fichiers (voir steps).

**Interfaces:**
- Produit l'état « zéro `text-muted` nu » vérifié à la Task 10.

- [ ] **Step 1: Remplacements globaux sûrs (15 fichiers sans variante correcte)**

Dans chacun de ces fichiers, Edit avec `old_string: "text-muted"`, `new_string: "text-(--ui-text-muted)"`, `replace_all: true` (vérifié : aucun ne contient déjà `text-(--ui-text-muted)`, donc aucun risque de double remplacement) :

`app/pages/workflow.vue`, `app/pages/nf.vue`, `app/pages/op.vue`, `app/pages/beneficiaires.vue`, `app/pages/auth.vue`, `app/pages/settings/clients.vue`, `app/pages/settings/lookups.vue`, `app/pages/settings/matrices.vue`, `app/pages/settings/organisations.vue`, `app/pages/settings/roles.vue`, `app/pages/settings/taux.vue`, `app/error.vue`, `app/components/clients/Details.vue`, `app/components/roles/Details.vue`, `app/components/nf/AddModal.vue`

- [ ] **Step 2: Remplacements contextuels (4 fichiers mixtes — contiennent déjà la variante correcte)**

Edit littéral ligne par ligne, avec contexte de ligne complet (copier la ligne réelle depuis le fichier) :

`app/components/point-facturation/Details.vue` — 4 lignes : `128` (`text-sm text-muted flex items-center gap-2 mt-1`), `141` (`text-sm font-medium text-muted mb-1`), `165`, `187` (`flex flex-col items-center justify-center py-6 text-muted text-sm`) → remplacer `text-muted` par `text-(--ui-text-muted)` sur ces lignes seulement. (Ligne 72 déjà correcte : ne pas toucher.)

`app/components/matrices/Details.vue` — lignes `94`, `107`, `130` → même remplacement. (Ligne 38 déjà correcte.)

`app/components/organisations/Details.vue` — lignes `126`, `139`, `163`, `185` → même remplacement. (Ligne 77 déjà correcte.)

`app/pages/profile.vue` — ligne `133` (`text-sm text-muted`) → remplacer. (Ligne 160 déjà correcte.)

- [ ] **Step 3: Vérifier**

Run: `grep -rn "text-muted" app/ | grep -v "text-(--ui-text-muted)" || echo "ZERO text-muted NU"`
Expected: « ZERO text-muted NU ».
Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs.

- [ ] **Step 4: Commit**

```bash
git add app/pages/workflow.vue app/pages/nf.vue app/pages/op.vue app/pages/beneficiaires.vue app/pages/auth.vue app/pages/settings/clients.vue app/pages/settings/lookups.vue app/pages/settings/matrices.vue app/pages/settings/organisations.vue app/pages/settings/roles.vue app/pages/settings/taux.vue app/error.vue app/components/clients/Details.vue app/components/roles/Details.vue app/components/nf/AddModal.vue app/components/point-facturation/Details.vue app/components/matrices/Details.vue app/components/organisations/Details.vue app/pages/profile.vue
git commit -m "fix(design-system): remplace text-muted (classe v3 invalide) par text-(--ui-text-muted)"
```

---

### Task 7: Structure de la sidebar — restes du template

**Files:**
- Modify: `app/layouts/default.vue`

**Interfaces:**
- Consumes: icônes corrigées et liens morts supprimés (Task 5). Produit une nav sans restes du template nuxt-ui-pro.

- [ ] **Step 1: Supprimer le groupe « Code » (lien template GitHub)**

Remplacer le bloc `const groups = computed(...)` par :

```ts
    const groups = computed(() => [{
        id: 'links',
        label: 'Go to',
        items: links.flat()
    }])
```

Puis supprimer les deux déclarations devenues inutilisées :

```ts
    const route = useRoute()
    const toast = useToast()
```

(Conserver `const open = useLocalStorage('dashboard-sidebar-open', true)`.)

- [ ] **Step 2: Nettoyage du template**

- Supprimer la ligne de commentaire `<!-- <div class="h-5 w-full bg-amber-200 block mb-5"></div> -->` en tête du `<template>`.
- Sur `<UDashboardSidebar ...>` : remplacer `class="bg-(--ui-bg-elevated)/25"` par `class="bg-(--ui-bg-elevated)"`.

- [ ] **Step 3: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs (en particulier plus d'`unused` sur `route`/`toast`). `bun run dev` → sidebar : plus de « View page source », fond de sidebar propre.

- [ ] **Step 4: Commit**

```bash
git add app/layouts/default.vue
git commit -m "fix(shell): supprime liens morts et restes du template nuxt-ui-pro dans la sidebar"
```

---

### Task 8: UserMenu — utilisateur réel, plus de sélecteur de couleur

**Files:**
- Modify: `app/components/UserMenu.vue`

**Interfaces:**
- Consumes: `useAuth().user` (composable existant, retourne un `Ref<User | null>` Supabase).

- [ ] **Step 1: Remplacer `app/components/UserMenu.vue`**

Contenu complet du fichier :

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
    collapsed?: boolean
}>()

const colorMode = useColorMode()
const auth = useAuth()

const displayName = computed(() => {
    const fullName = auth.user.value?.user_metadata?.full_name
    return (typeof fullName === 'string' && fullName) || auth.user.value?.email || 'Utilisateur'
})

const avatarSrc = computed(() => {
    const src = auth.user.value?.user_metadata?.avatar_url
    return typeof src === 'string' ? src : undefined
})

const items = computed<DropdownMenuItem[][]>(() => ([
    [{
        type: 'label',
        label: displayName.value,
        avatar: { src: avatarSrc.value, alt: displayName.value },
    }],
    [{
        label: 'Profil',
        icon: 'i-lucide-user',
        to: '/profile',
    }, {
        label: 'Paramètres',
        icon: 'i-lucide-settings',
        to: '/settings',
    }],
    [{
        label: 'Apparence',
        icon: 'i-lucide-sun-moon',
        children: [{
            label: 'Clair',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'light'
            },
        }, {
            label: 'Sombre',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'dark'
            },
        }],
    }],
    [{
        label: 'Se déconnecter',
        icon: 'i-lucide-log-out',
        onSelect(e: Event) {
            e.preventDefault()
            isLogoutModalOpen.value = true
        },
    }],
]))

const isLogoutModalOpen = ref(false)

function handleLogout() {
    isLogoutModalOpen.value = false
    auth.logout()
}
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
                   :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
            label: collapsed ? undefined : displayName,
            avatar: avatarSrc ? { src: avatarSrc, alt: displayName } : undefined,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
        }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-(--ui-bg-elevated)" :ui="{
            trailingIcon: 'text-(--ui-text-dimmed)'
        }" />

        <UModal v-model:open="isLogoutModalOpen" title="Confirmation"
                description="Êtes-vous sûr de vouloir vous déconnecter ?" :ui="{ content: 'max-w-sm' }">
            <template #footer>
                <UButton label="Annuler" color="neutral" variant="ghost" @click="isLogoutModalOpen = false" />
                <UButton label="Se déconnecter" color="error" @click="handleLogout" />
            </template>
        </UModal>
    </UDropdownMenu>
</template>
```

Différences clés avec l'existant : suppression du profil « Benjamin Canac », du sélecteur de couleur primary (arrays `colors`/`neutrals`, `useAppConfig`), du lien « Documentation » et du slot `#chip-leading` ; utilisateur depuis `useAuth()` ; item Sombre simplifié (même pattern que Clair).

- [ ] **Step 2: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs. `bun run dev` → menu utilisateur en bas de sidebar : nom/email réel, Apparence → Clair/Sombre fonctionnels, plus d'item « Theme », déconnexion OK.

- [ ] **Step 3: Commit**

```bash
git add app/components/UserMenu.vue
git commit -m "fix(shell): UserMenu sur l'utilisateur authentifié, suppression du sélecteur de couleur démo"
```

---

### Task 9: TeamsMenu — organisations réelles

**Files:**
- Modify: `app/components/TeamsMenu.vue`

**Interfaces:**
- Consumes: `useParametresStore().organisations` — `ComputedRef<Organisation[]>` (store existant `app/stores/parametres.ts` ; `Organisation` = `{ id: string, nom: string, ... }` depuis `app/types/organisation.ts`).

- [ ] **Step 1: Remplacer `app/components/TeamsMenu.vue`**

Contenu complet du fichier :

```vue
<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
    collapsed?: boolean
}>()

const parametresStore = useParametresStore()
const organisations = computed(() => parametresStore.organisations)
const selectedOrganisation = ref<string | null>(null)

const items = computed<DropdownMenuItem[][]>(() => {
    const orgs: DropdownMenuItem[] = organisations.value.map(org => ({
        label: org.nom,
        avatar: { src: undefined, alt: org.nom },
        onSelect() {
            selectedOrganisation.value = org.id
        },
    }))

    return [
        orgs.length ? orgs : [{ type: 'label', label: 'Aucune organisation' }],
        [{
            label: 'Gérer les organisations',
            icon: 'i-lucide-cog',
            to: '/settings/organisations',
        }],
    ]
})

const selected = computed(() => {
    const org = organisations.value.find(o => o.id === selectedOrganisation.value) ?? organisations.value[0]
    return org
        ? { label: org.nom, avatar: { src: undefined, alt: org.nom } }
        : { label: 'Hazipro', avatar: { src: undefined, alt: 'Hazipro' } }
})
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
                   :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
                     ...selected,
                     label: collapsed ? undefined : selected.label,
                     trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
                 }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-(--ui-bg-elevated)"
                 :class="[!collapsed && 'py-2']" :ui="{
                     trailingIcon: 'text-(--ui-text-dimmed)'
                 }" />
    </UDropdownMenu>
</template>
```

Différences clés : suppression des teams fictives Nuxt/NuxtHub/NuxtLabs et de « Create team » ; organisations depuis `useParametresStore().organisations` ; « Gérer les organisations » pointe vers `/settings/organisations`.

- [ ] **Step 2: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs. `bun run dev` → header de sidebar : nom de l'organisation réelle, dropdown listant les organisations, « Gérer les organisations » ouvre la page de paramétrage.

- [ ] **Step 3: Commit**

```bash
git add app/components/TeamsMenu.vue
git commit -m "feat(shell): TeamsMenu affiche les organisations réelles depuis le store"
```

---

### Task 10: Pages d'accueil — index.vue et settings/index.vue

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/pages/settings/index.vue`

**Interfaces:**
- Consumes: rien de nouveau. Les liens pointent vers des routes existantes.

- [ ] **Step 1: Remplacer `app/pages/index.vue`**

Contenu complet du fichier :

```vue
<script setup lang="ts">
useSeoMeta({
    title: 'Accueil',
    description: 'Tableau de bord Hazipro.',
})

const links = [{
    label: 'Note de frais',
    description: 'Créer et suivre les notes de frais',
    icon: 'i-lucide-id-card',
    to: '/nf',
}, {
    label: 'OP - Fournisseur',
    description: 'Gérer les opérations fournisseurs',
    icon: 'i-lucide-file-text',
    to: '/op',
}, {
    label: 'Bénéficiaires',
    description: 'Gérer les bénéficiaires',
    icon: 'i-lucide-users',
    to: '/beneficiaires',
}, {
    label: 'Paramètres',
    description: 'Configurer clients, organisations, taux, matrices…',
    icon: 'i-lucide-settings',
    to: '/settings',
}]
</script>

<template>
    <UDashboardPanel>
        <UDashboardSection title="Tableau de bord">
            <UDashboardCard>
                <template #header>
                    <h2 class="text-lg font-semibold">Bienvenue sur Hazipro</h2>
                </template>
                <p class="text-(--ui-text-muted) mb-4">
                    Accédez rapidement à vos modules de travail.
                </p>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <UButton v-for="link in links" :key="link.to" :to="link.to" color="neutral" variant="outline"
                        block class="h-auto justify-start p-4 text-left">
                        <span class="flex items-center gap-3">
                            <UIcon :name="link.icon" class="size-5 shrink-0 text-(--ui-text-highlighted)" />
                            <span>
                                <span class="block font-medium text-(--ui-text-highlighted)">{{ link.label }}</span>
                                <span class="block text-xs text-(--ui-text-muted)">{{ link.description }}</span>
                            </span>
                        </span>
                    </UButton>
                </div>
            </UDashboardCard>
        </UDashboardSection>
    </UDashboardPanel>
</template>
```

- [ ] **Step 2: Remplacer `app/pages/settings/index.vue`**

Contenu complet du fichier :

```vue
<script setup lang="ts">
useHead({
    title: 'Paramètres',
    meta: [
        { name: 'description', content: 'Configuration générale de Hazipro.' },
    ],
})

const sections = [
    { label: 'Classes & Lookups', description: 'Référentiels et classes', icon: 'i-lucide-list-tree', to: '/settings/lookups' },
    { label: 'Organisations', description: 'Organisations et services', icon: 'i-lucide-building-2', to: '/settings/organisations' },
    { label: 'Matrices', description: "Matrices d'approbation", icon: 'i-lucide-grid-2x2', to: '/settings/matrices' },
    { label: 'Taux', description: 'Taux appliqués', icon: 'i-lucide-percent', to: '/settings/taux' },
    { label: 'Grille tarifaire', description: 'Tarifs et articles', icon: 'i-lucide-tags', to: '/settings/tarifaire' },
    { label: 'Utilisateurs', description: 'Comptes et accès', icon: 'i-lucide-users', to: '/settings/users' },
    { label: 'Rôles', description: 'Rôles et permissions', icon: 'i-lucide-shield', to: '/settings/roles' },
    { label: 'Articles', description: 'Catalogue des articles', icon: 'i-lucide-package', to: '/settings/articles' },
    { label: 'Clients', description: 'Clients et NIF', icon: 'i-lucide-handshake', to: '/settings/clients' },
    { label: 'Sécurité', description: 'Sécurité du compte', icon: 'i-lucide-lock', to: '/settings/security' },
    { label: 'Notifications', description: 'Préférences de notification', icon: 'i-lucide-bell', to: '/settings/notifications' },
    { label: 'Accès', description: "Gestion des accès", icon: 'i-lucide-key-round', to: '/settings/access' },
]
</script>

<template>
    <UDashboardPanel>
        <UDashboardSection title="Paramètres" description="Configuration générale de votre espace Hazipro.">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <UCard v-for="section in sections" :key="section.to" :to="section.to">
                    <div class="flex items-start gap-3">
                        <UIcon :name="section.icon" class="size-5 shrink-0 text-(--ui-text-highlighted)" />
                        <div>
                            <p class="font-medium text-(--ui-text-highlighted)">{{ section.label }}</p>
                            <p class="text-xs text-(--ui-text-muted)">{{ section.description }}</p>
                        </div>
                    </div>
                </UCard>
            </div>
        </UDashboardSection>
    </UDashboardPanel>
</template>
```

(Remplace la démo nuxt-ui-pro : profil « Benjamin Canac », imports `zod` et `FormSubmitEvent` supprimés avec le reste.)

- [ ] **Step 3: Vérifier**

Run: `bun run lint; bun run typecheck`
Expected: pas de nouvelles erreurs. `bun run dev` → `/` : tableau de bord avec 4 accès rapides fonctionnels ; `/settings` : hub avec 12 cartes navigables.

- [ ] **Step 4: Commit**

```bash
git add app/pages/index.vue app/pages/settings/index.vue
git commit -m "feat(shell): tableau de bord minimal et hub de paramètres (remplace les restes du template)"
```

---

### Task 11: Vérification finale et sweep de conformité

**Files:** aucun nouveau — vérifications uniquement (commits de correction si des écarts sont trouvés).

**Interfaces:**
- Consumes: l'ensemble des tâches 1–10.

- [ ] **Step 1: Greps de conformité**

Run:
```bash
grep -rn "material-symbols\|solar:\|duo-icons\|hugeicons" app/ || echo "ICONES OK"
grep -rn "text-muted" app/ | grep -v "text-(--ui-text-muted)" || echo "TEXT-MUTED OK"
grep -rn 'color="secondary"' app/ || echo "SECONDARY OK"
grep -rn "bg-(--ui-bg-elevated)/25\|nuxt-ui-pro\|benjamincanac\|Benjamin Canac\|pattern.jpg" app/ || echo "TEMPLATE OK"
```
Expected: les 4 « OK ». Sinon, corriger les occurrences restantes avec les mêmes règles que les tâches précédentes, puis re-run.

- [ ] **Step 2: Lint + typecheck**

Run: `bun run lint; bun run typecheck`
Expected: identique à la baseline de la Task 1 (pas de nouvelles erreurs). Les erreurs préexistantes hors périmètre sont notées et laissées telles quelles.

- [ ] **Step 3: Passe visuelle clair + sombre**

Run: `bun run dev`, puis vérifier :
- `/` : tableau de bord, 4 accès rapides.
- `/nf`, `/op`, `/beneficiaires`, `/workflow` : tables canoniques, icônes visibles.
- `/settings` : hub 12 cartes ; puis chaque sous-page (`lookups`, `organisations`, `matrices`, `taux`, `tarifaire`, `users`, `roles`, `articles`, `clients`, `security`, `notifications`, `access`) : tables et icônes OK, aucun lien mort.
- Sidebar : groupes Workflow & Task (1 enfant) et Parametres (10 enfants), TeamsMenu = organisations réelles, UserMenu = utilisateur réel.
- Basculer en sombre via UserMenu → Apparence → Sombre : fonds `#020617`, primary `#3B82F6`, contrastes lisibles. Revenir en clair.
- Modales (ajout client, ajout article…) : header propre sans texture.
- Responsive : fenêtre ~375px — sidebar en mode modal, tables scrollables horizontalement sans casser le layout.

Toute régression visuelle → corriger dans le fichier fautif, puis re-run lint/typecheck.

- [ ] **Step 4: Commit final (corrections éventuelles)**

```bash
git add <fichiers corrigés uniquement>
git commit -m "fix(design-system): corrections suite à la passe de conformité finale"
```

Si aucune correction : passer le commit.

- [ ] **Step 5: État de la branche**

Run: `git status --short`
Expected: restent uniquement les modifications préexistantes non liées (`app/stores/*`, `app/components/matrices/*`, `app/pages/auth.vue`, `app/types/index.ts`…). Ne pas les committer dans le cadre de ce plan.

---

## Self-Review (coverage du spec)

| Section spec | Tâche(s) |
|---|---|
| §1 Architecture & tokens (app.config.ts, main.css, table.ts, MASTER.md) | Tasks 1, 2, 3, 4 |
| §2 Palette hazi + rôles sémantiques | Task 1 (tokens), Task 2 (doc) |
| §3 Typo (Plus Jakarta, tabular-nums, densité) | Task 1 (font), Task 3/4 (td tabular-nums, paddings) |
| §4 Icônes Lucide + conventions composants | Task 5, Task 1 (secondary → neutral) |
| §5 Shell (default.vue, TeamsMenu, UserMenu, index.vue, settings/index.vue, text-muted) | Tasks 6, 7, 8, 9, 10 |
| §6 Motion & accessibilité (reduced-motion, focus, contraste, tactiles) | Task 1 (reduced-motion conservé), Task 11 (passe visuelle) |
| §7 Vérification (lint, typecheck, passe visuelle, pas de tests unitaires) | Task 11 + steps de vérification de chaque tâche |
