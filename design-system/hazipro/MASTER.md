# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Hazipro
**Generated:** 2026-08-14 08:31:59
**Category:** SaaS (General)
**Design Dials:** Variance 5/10 (Balanced / Modern) | Motion 4/10 (Standard) | Density 7/10 (Standard)

---

## Implementation Mapping (Nuxt UI v4)

Applied 2026-08-14. Semantic tokens mapped to the project stack:

| Design System Role | Nuxt UI token | Value |
|--------------------|---------------|-------|
| Primary | `ui.colors.primary` | `green` (Nuxt green) |
| Secondary | `ui.colors.secondary` | `blue` (informational accents only) |
| Neutral | `ui.colors.neutral` | `neutral` |
| Background | `--ui-bg` | Nuxt UI default / dark `neutral-950` (`#0A0A0A`) |
| Font | `--font-sans` / `--font-heading` | Inter / Outfit (self-hosted by Nuxt Fonts) |

- Config: `app/app.config.ts` + `app/assets/css/main.css`
- Primary actions and active navigation use `color="primary"`; secondary actions use neutral styling
- Green is reserved for interaction and selected state, not large surfaces
- Dark mode is the default; the appearance menu keeps light mode available

---

## Global Rules

### Color Palette

| Role | Value | Usage |
|------|-------|-------|
| Primary | Nuxt green (`green-400`, `#00DC82`) | Primary actions, links, active navigation |
| Secondary | Blue | Informational emphasis; not a secondary button fill |
| Neutral | Nuxt UI `neutral` scale | Text, borders, surfaces, disabled states |
| Light canvas | Nuxt UI default | Light mode page background |
| Dark canvas | `neutral-950` (`#0A0A0A`) | Default dark mode page background |
| Dark elevated | `neutral-900` / `neutral-800` | Cards, popovers, hover and active surfaces |
| Destructive | Nuxt UI `error` | Destructive actions and errors |

### Typography

- **Heading Font:** Outfit (`font-heading`)
- **Body Font:** Inter (`font-sans`)
- **Mood:** developer-focused, calm, confident, clear
- Nuxt Fonts self-hosts the families declared in `@theme`.

Use Outfit for page and section headings; keep controls, labels, and data in Inter.

### Spacing Variables

*Density: 7/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

Use Nuxt UI semantic colors: `color="primary"` for the main action and `color="neutral"` for secondary actions. Reserve blue for informational accents.

### Cards

```css
.card {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  padding: 1rem;
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--ui-border);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: var(--ui-primary);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Neutral, data-first application shell

**Keywords:** True neutral surfaces, Nuxt green accent, clear data hierarchy, restrained depth

**Best For:** Financial operations, admin dashboards, forms, and dense tables

**Key Effects:** Distinguish surfaces with neutral background levels and borders; avoid decorative gradients and frosted-glass effects.

### Page Pattern

**Pattern Name:** Navigation shell + task-focused content

- Keep the dashboard sidebar and page content as the primary structure.
- Start pages with a clear title and task context; prioritize filters, forms, and data tables over marketing hero sections.
- Use green for one primary action or selected state at a time.

---

## Motion

**Stagger List** (Standard) — Trigger: load or scroll | Duration: 300-450ms | Easing: `back.out(1.4)`

```js
gsap.from('.grid-item', { opacity: 0, scale: 0.92, y: 16, duration: 0.4, stagger: { each: 0.06, from: 'start', grid: 'auto' }, ease: 'back.out(1.4)' });
```

**Framework notes:** grid: 'auto' lets GSAP infer rows/columns from a CSS grid layout for a natural wave stagger; Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Combine with from: 'center' for a bento-grid layout to draw the eye inward first
- ❌ Don't use back.out on dense data tables; the overshoot reads as sloppy on informational UI
- ⚡ Group DOM writes; avoid interleaving layout reads (getBoundingClientRect) between staggered tweens

---

## Anti-Patterns (Do NOT Use)

- ❌ Excessive animation
- ❌ Large green surfaces or multiple competing accent colors
- ❌ Decorative gradients, frosted glass, or marketing-style hero sections in operational pages

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
