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
- **Densité 9/10 :** corps de table 13px, cellules `p-2` (header `py-1`) ; formulaires 16px ; cibles interactives ≥ 40px (44 recommandé).
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
