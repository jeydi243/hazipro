# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A **multi-tenant SaaS**. Each tenant is a **group** running several entities; the tenant boundary is isolated per customer.

Four roles confirmed as day-to-day users, all working over the same records from different angles:

- **Saisie / finance staff** — create and submit notes de frais and ordres de paiement, and maintain the reference data underneath them (bénéficiaires, comptes bancaires, banques, grille tarifaire, articles).
- **Approbateurs / managers** — work the approval workflow across matrix levels. Validating or rejecting is their core daily action.
- **Trésorerie / paiement** — execute and reconcile payments once a document is approved.
- **Admin / paramétrage** — configure classes & lookups, organisations, matrices, taux, users and roles.

## Product Purpose

Hazipro is the finance back-office for groups that operate as several entities. It carries expense documents — **notes de frais (NF)** and **ordres de paiement fournisseur (OP)** — from entry through approval to payment, across every entity in the group, in a single workspace.

Success means a document entered by one entity's finance staff reaches payment with every required approval recorded, in the right currency, without leaving the product.

## Positioning

**Approval matrices drive every document.** Every entity and document type routes through a configurable matrix of approver levels, and the workflow is the product rather than a feature bolted onto it. A neighbouring finance tool could copy the tables, the forms and the pricing grid; it could not truthfully copy the claim that the approval matrix is the mechanism the whole product is built on.

## Operating Context

- **Geography and language:** Democratic Republic of the Congo. The product surface is **French**; English strings survive in places and are debt, not intent.
- **Naming and identity:** Congolese conventions — `nom`, `postnom`, `prénom`; tax identity as **NIF**.
- **Currency:** **CDF and USD are both real money.** Documents carry a `devise`, and the `taux` table resolves `from_currency` → `to_currency` over time.
- **Documents in play:** notes de frais (NF) and ordres de paiement fournisseur (OP); bénéficiaires receive payment through comptes bancaires at known banques.
- **Reference data the finance team maintains:** classes & lookups (a generic taxonomy the tenant shapes itself), organisations, matrices, taux, grille tarifaire, articles, clients, banques, users and rôles.
- **Backend:** Supabase (Postgres + auth). Row-level security is enabled across all tables.

## Capabilities and Constraints

**Confirmed stack:** Nuxt 4, Nuxt UI v4, Supabase (`@nuxtjs/supabase`), Pinia, Tailwind CSS v4, TypeScript, Zod, Vitest, ESLint. Package manager `bun`. Dev server on port 3006. Server API routes exist under `server/api` with auth/admin middleware.

**Confirmed capability areas** (present in the codebase): notes de frais; ordres de paiement fournisseur; bénéficiaires with addresses and bank accounts; banques; organisations (with parent/child nesting); classes & lookups; matrices and approbateurs with `niveau`; taux de change; grille tarifaire with dated price lines; clients and fournisseurs; articles and stock; factures; rôles, users and profils.

**Constraints:**

- Multi-tenant: records and profiles carry an `owner_id`; login asks for an **"Espace de travail"** (workspace) alongside email and password. Supabase auth has passkeys enabled.
- Every table is under RLS — capability work must assume per-tenant isolation is enforced in the database, not only in the UI.
- Two currencies (CDF, USD) mean amounts are never meaningful without their `devise`.
- French is the product language and Congolese finance terminology is the vocabulary.

**Explicitly undecided / open:**

- **Health organisations are future scope, not current scope.** `Patient`, `Mutuelle`, `Médecin`, `RendezVous` and related types exist and must be **kept**, but nothing should be designed around them yet. No healthcare workflow is in scope.
- **Product name is unresolved in the code.** `Hazipro` is the dominant name (README, auth screens, `parametres` store, design-system file). Three stale page titles still say **Wazi** (`confirm.vue`, `profile.vue`, `settings.vue`). Treat Hazipro as the name and the Wazi occurrences as leftovers to be reconciled by the user.
- Pricing, packaging and plan structure for the SaaS: nothing established. Do not invent.
- `app/pages/index.vue` is still Nuxt UI Pro template boilerplate ("Bienvenue sur votre template Nuxt") and does not yet describe this product. The landing/dashboard story is unbuilt.
- The `README.md` still presents the repo as a generic Nuxt template — stale, not product truth.

## Brand Commitments

- **Name:** Hazipro.
- **Language:** French, with Congolese finance vocabulary. Not translated, not bilingual by default.
- **Voice:** must be confirmed by the user — nothing was volunteered.

## Evidence on Hand

- `design-system/hazipro/MASTER.md` — an existing design-system record for this project, dated 2026-08-14, including an implementation mapping onto Nuxt UI v4 tokens. Visual authority is the shipped code; this file is supporting evidence.
- `supabase/migrations/` — the schema and the RLS policies are real, readable product truth.
- `app/types/` — the domain model in TypeScript.
- **Absences future work must not fabricate:** no testimonials, no customer names, no case studies, no benchmarks, no pricing, no press, no deployment claims. None exist.

## Product Principles

1. **The matrix is the mechanism.** Every document routes through a configurable approval matrix of approver levels. Do not build paths around it, and do not let a surface imply a document can skip a level.
2. **The entity is the boundary; the group is the view.** Every record, approval and total belongs to an organisation. Group-level surfaces aggregate across entities without dissolving the line between them.
3. **Two currencies, never one assumption.** CDF and USD are both real money. An amount without its `devise`, or a conversion that bypasses `taux`, is a defect.
4. **One back-office, four roles.** Saisie, approbation, trésorerie and admin each need their own surface over the same records. A screen that serves all four equally serves none of them well.
5. **French is the product language.** Congolese finance terminology is the vocabulary; English strings are debt to be paid down, not a second supported language.
