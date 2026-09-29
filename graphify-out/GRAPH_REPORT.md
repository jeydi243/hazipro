# Graph Report - hazipro  (2026-09-29)

## Corpus Check
- 205 files · ~232,285 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 45 file(s) not represented in the graph (top: .csv 37, (none) 5, .css 1)

## Summary
- 1551 nodes · 2235 edges · 123 communities (94 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.86)
- Token cost: 46,187 input · 1,659 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 109
- Community 110
- Community 111
- Community 118

## God Nodes (most connected - your core abstractions)
1. `@nuxt/ui` - 60 edges
2. `search()` - 43 edges
3. `zod` - 41 edges
4. `search_stack()` - 35 edges
5. `DesignSystemGenerator` - 35 edges
6. `@tanstack/table-core` - 19 edges
7. `BM25` - 18 edges
8. `detect_domain()` - 18 edges
9. `pinia` - 17 edges
10. `useAdminUsers()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Design System Master` --references--> `Abstract Background Pattern`  [INFERRED]
  design-system/hazipro/MASTER.md → app/assets/img/pattern.jpg
- `Hazipro Template` --references--> `Supabase Skill`  [INFERRED]
  README.md → .agents/skills/supabase/SKILL.md
- `Hazipro Template` --references--> `UI/UX Pro Max Skill`  [INFERRED]
  README.md → .agents/skills/ui-ux-pro-max/SKILL.md
- `TestEndToEndCoherence` --uses--> `DesignSystemGenerator`  [INFERRED]
  .agents/skills/ui-ux-pro-max/scripts/tests/test_design_system_mode.py → .agents/skills/ui-ux-pro-max/scripts/design_system.py
- `Design System Master` --implements--> `Hazipro Template`  [EXTRACTED]
  design-system/hazipro/MASTER.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Supabase & Postgres Security Best Practices** — agents_skills_supabase_skill, agents_skills_supabase_postgres_best_practices_skill, agents_skills_supabase_postgres_best_practices_references_security_rls_performance [EXTRACTED 0.95]
- **Hazipro Technology Stack** — readme_hazipro, agents_skills_supabase_skill, agents_skills_ui_ux_pro_max_skill [EXTRACTED 1.00]

## Communities (123 total, 29 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (42): Affectation, Owner, Profil, Role, UserRole, Client, Fournisseur, Facture (+34 more)

### Community 1 - "Community 1"
Cohesion: 0.10
Nodes (16): format_markdown(), format_master_md(), generate_design_system(), persist_design_system(), Format design system as MASTER.md with hierarchical override logic., Format design system as markdown., Main entry point for design system generation. Args: query: Search query (e.g.,…, Slugify a name into a single safe path segment. Only [a-z0-9_-] survives; every… (+8 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (36): _catalog_date(), _check_app_interface_contract(), _check_catalog_contract(), _check_catalog_summary(), _check_chart_contract(), _check_color_contract(), _check_core_data_contract(), _check_file() (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (33): beneficiairesStore, { data: beneficiaires, execute }, isLoading, itemsBeneficiaires, itemsMatriceNF, itemsOrganisations, open, parametresStore (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (33): classes, emit, lookupsStore, onSubmit(), open, paramStore, props, schema (+25 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (32): _contains_phrase(), _domain_keywords(), _exact_stack_identifier(), _file_signature(), _get_bm25(), _load_csv(), _load_csv_snapshot(), _load_product_keywords() (+24 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (24): columnsAffectations, columnsRoles, columnVisibility, { data: affectations, refresh: refreshAffectations, status: affectationsStatus }, { data: roles, refresh: refreshRoles, status: rolesStatus }, emit, EMPTY_ROWS, isOpenSlideOver (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (6): Search stack-specific guidelines, search_stack(), _rows(), TestNativeDesktopStackFreshness, _rows(), TestWebStackFreshness

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (6): Main search function with auto-domain detection, search(), TestDiagnosticsContracts, TestSearchDomains, read_rows(), TestStyleTaxonomy

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (14): Semantic quality contracts for the core UI/UX datasets., read_rows(), TestAccessibilityGuidance, TestChartsTypographyAndIcons, TestCurrentReactGuidance, TestSemanticColors, _check_typography_contract(), _configured_font_names() (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.11
Nodes (22): ansi_ljust(), _detect_page_type(), format_ascii_box(), format_page_override_md(), _generate_intelligent_overrides(), hex_to_ansi(), Format a page-specific override file with intelligent AI-generated content., Generate intelligent overrides based on page type using layered search. Uses… (+14 more)

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (17): Offline contract tests for deterministic upstream catalog refreshes., Stdlib-only regression tests for core.py / design_system.py (unittest, not…, Freshness and migration contracts for native, desktop, and 3D stacks., Unit tests for metric math and relevance fixture validation., Regression tests for the public style taxonomy and search contract., Canonical regression contracts for resilient UI text layouts., Freshness and generation-isolation contracts for web stack guidance., csv (+9 more)

### Community 12 - "Community 12"
Cohesion: 0.12
Nodes (13): items, useArticlesStore, useBeneficiairesStore, useClientsStore, useFacturesStore, useLookupsStore, useNFStore, usePatientsStore (+5 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (23): name, packageManager, private, type, date-fns, eslint, @fontsource-variable/plus-jakarta-sans, happy-dom (+15 more)

### Community 14 - "Community 14"
Cohesion: 0.10
Nodes (19): columnsLookups, { copy }, debouncedSearchLookups, emit, isOpen, loadingLookups, lookups, lookupsError (+11 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (8): BM25, BM25 ranking algorithm for text search, Lowercase, normalize synonyms, split, remove punctuation, filter stopwords, Build BM25 index from documents, Score all documents against query, All indexed terms, for suggestion/typo-recovery purposes., TestBm25CoreBehavior, TestTokenizer

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (18): { data: beneficiaires, execute }, dateDocument, inputDate, isLoading, itemsBeneficiaires, itemsBudget, itemsDevises, itemsMatriceNF (+10 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (18): columnFilters, columnsTarifaireLine, columnVisibility, { data: tarifairesLines, refresh: refreshTarifairesLines, status: tarifairesLinesStatus }, emit, EMPTY_ROWS, isOpenSlideOver, isStopModalOpen (+10 more)

### Community 18 - "Community 18"
Cohesion: 0.10
Nodes (18): columnFilters, columns, columnVisibility, { copy }, { data: Roles, pending }, debouncedSearch, EMPTY_ROWS, openDetailsRole (+10 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (18): columnFilters, columns, columnVisibility, { copy }, { data: Users, pending }, debouncedSearch, EMPTY_ROWS, openDetailsUser (+10 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (5): DesignSystemGenerator, Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., TestReasoningMatch, TestReasoningContract

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (17): { data: profils }, { data: roles }, dateDebutModel, emit, inputDateDebutRef, maxDate, onSubmit(), open (+9 more)

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (16): articlesStore, columns, { copy }, { data: Roles, pending, refresh: refreshRoles }, debouncedSearch, EMPTY_ROWS, { getLookupsById }, openDetailsAffectation (+8 more)

### Community 23 - "Community 23"
Cohesion: 0.11
Nodes (16): articlesStore, columns, { copy }, { data: Articles, pending, refresh: refreshArticles }, debouncedSearch, EMPTY_ROWS, { getLookupsById }, lookupFilterItems (+8 more)

### Community 24 - "Community 24"
Cohesion: 0.11
Nodes (18): dependencies, date-fns, @fontsource-variable/plus-jakarta-sans, @iconify-json/lucide, @iconify-json/simple-icons, @internationalized/date, nuxt, @nuxt/ui (+10 more)

### Community 25 - "Community 25"
Cohesion: 0.12
Nodes (14): articlesStore, columns, { data: affectations, refresh: refreshAffectations, pending: loadingAffectations }, { data: organisations, refresh: refreshOrganisations }, emit, EMPTY_ROWS, isAddingRecord, open (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.12
Nodes (16): ArticleSchema, columns, emit, EMPTY_ROWS, onSubmit(), open, parametresStore, { profils } (+8 more)

### Community 27 - "Community 27"
Cohesion: 0.17
Nodes (9): useAdminUsers(), confirmDelete(), generateMagicLink(), generateRecoveryLink(), getRowItems(), openDetailModal(), openEditModal(), openInviteModal() (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (15): columnDisplayItems, columns, { copy }, debouncedSearch, emptyRows, { lookups, itemsMatrices: matrices }, openEditModal, openSlideOver (+7 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (15): columnDisplayItems, columns, { copy }, debouncedSearch, emptyRows, { lookups }, openEditModal, openSlideOver (+7 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (15): columnDisplayItems, columns, { copy }, debouncedSearch, emptyRows, { lookups, getTaux : taux}, openEditModal, openSlideOver (+7 more)

### Community 31 - "Community 31"
Cohesion: 0.17
Nodes (3): read_rows(), TestGeneratedCatalogContract, TestLandingAndStackContract

### Community 32 - "Community 32"
Cohesion: 0.13
Nodes (15): ArticleSchema, articlesStore, { data: lookups }, emit, getTypeArticle, items, itemsTypeArticle, itemsUOM (+7 more)

### Community 33 - "Community 33"
Cohesion: 0.15
Nodes (15): { data: profils }, dateDebutModel, dateFinModel, emit, maxDate, onSubmit(), open, profilItems (+7 more)

### Community 34 - "Community 34"
Cohesion: 0.15
Nodes (15): { data: profils }, dateDebutModel, dateFinModel, emit, maxDate, onSubmit(), open, profilItems (+7 more)

### Community 35 - "Community 35"
Cohesion: 0.14
Nodes (15): emit, getTypeOrganisations, isOpen, itemsOrganisation, loading, lookupsStore, onSubmit(), open (+7 more)

### Community 36 - "Community 36"
Cohesion: 0.13
Nodes (15): { data: articles }, { data: organisations }, { data: tarifaires }, emit, itemsArticles, itemsOrganisations, itemsTarifaires, onSubmit() (+7 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (13): columns, { copy }, { data: nfs, refresh: refreshNfData }, debouncedSearch, EMPTY_ROWS, openClasseUpdateModal, openDetailsClasse, openSlideOver (+5 more)

### Community 38 - "Community 38"
Cohesion: 0.12
Nodes (13): columns, { copy }, { data: nfs, refresh: refreshNfData }, debouncedSearch, EMPTY_ROWS, openClasseUpdateModal, openDetailsClasse, openSlideOver (+5 more)

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (13): columns, { copy }, { data: nfs, refresh: refreshNfData }, debouncedSearch, EMPTY_ROWS, openClasseUpdateModal, openDetailsClasse, openSlideOver (+5 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (13): authUser, avatarUrl, { data: profil, pending, refresh }, fileInput, fullName, profilsStore, saving, schema (+5 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (13): columns, { copy }, { data: classes, refresh: refreshClassesData }, debouncedSearch, EMPTY_ROWS, openClasseUpdateModal, openDetailsClasse, openSlideOver (+5 more)

### Community 42 - "Community 42"
Cohesion: 0.12
Nodes (13): columns, { copy }, { data: nfs, refresh: refreshNfData }, debouncedSearch, EMPTY_ROWS, openClasseUpdateModal, openDetailsClasse, openSlideOver (+5 more)

### Community 43 - "Community 43"
Cohesion: 0.23
Nodes (3): detect_domain(), Auto-detect the most relevant domain from query. Matches are weighted by…, TestDomainDetection

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (8): Execute searches across multiple domains., Find matching reasoning rule for a category., Apply reasoning rules to search results., Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation. variance/motion/density are…, Bucket a 1-10 dial value into its tier config. Returns None if value is None., _resolve_dial()

### Community 45 - "Community 45"
Cohesion: 0.18
Nodes (7): _palette_is_dark(), WCAG relative luminance of a #RRGGBB string, or None if unparseable., True when a colors.csv row's Background is a dark surface., _relative_luminance(), The exact reproduction from issue #428., TestEndToEndCoherence, TestLuminance

### Community 46 - "Community 46"
Cohesion: 0.20
Nodes (11): apply_decision_rules(), _object_without_duplicates(), parse_decision_rules(), Return deterministic mutations and an audit trail; never execute data., Closed, non-executable grammar for design-system decision rules., Parse the canonical condition -> action-array representation., _validate_action(), Cross-file semantic contracts for curated design data. (+3 more)

### Community 47 - "Community 47"
Cohesion: 0.14
Nodes (14): ArticleSchema, articlesStore, { data: lookups }, { data: lookupsUOM }, emit, items, itemsUOM, onSubmit() (+6 more)

### Community 48 - "Community 48"
Cohesion: 0.13
Nodes (12): clientsStore, columns, { data: affectations, refresh: refreshAffectations, pending: loadingAffectations }, { data: organisations, refresh: refreshOrganisations }, EMPTY_ROWS, isAddingRecord, open, orgItems (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.14
Nodes (14): columns, { data: emplacements, pending: pendingEmplacements, refresh: refreshEmplacements }, { data: services, pending, refresh }, emit, EMPTY_ROWS, isOpen, items, open (+6 more)

### Community 50 - "Community 50"
Cohesion: 0.13
Nodes (13): clientsStore, columns, { copy }, { data: clients, pending, refresh: refreshClients }, debouncedSearch, EMPTY_ROWS, { getLookupsById }, openDetailsClient (+5 more)

### Community 51 - "Community 51"
Cohesion: 0.21
Nodes (8): _query_wants_dark(), True when a styles.csv row describes itself as dark-first., True when the query explicitly asks for a dark theme., Resolve the mode the rest of the output has to agree with., _resolve_color_mode(), _style_is_dark_primary(), Regression tests for color-mode coherence in design_system.py (issue #428).…, TestModeResolution

### Community 52 - "Community 52"
Cohesion: 0.16
Nodes (13): clientsStore, emit, getTypeClient, isOpen, itemsTypeClients, onSubmit(), parametresStore, props (+5 more)

### Community 53 - "Community 53"
Cohesion: 0.16
Nodes (13): emit, getTypeMatrices, isOpen, itemsMatrice, loading, lookupsStore, onSubmit(), open (+5 more)

### Community 54 - "Community 54"
Cohesion: 0.15
Nodes (13): { data: lookups }, emit, { getAffectationsMagasin }, itemsEmplacement, itemsMagasin, onSubmit(), open, organisationsStore (+5 more)

### Community 55 - "Community 55"
Cohesion: 0.15
Nodes (13): columns, { data: emplacements, pending: pendingEmplacements, refresh: refreshEmplacements }, { data: services, pending, refresh }, emit, EMPTY_ROWS, isOpen, items, open (+5 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (13): dateDocument, emit, inputDate, items, loading, maxDate, onSubmit(), open (+5 more)

### Community 57 - "Community 57"
Cohesion: 0.15
Nodes (13): { data: lookups }, { data: services }, emit, lookupItems, onSubmit(), open, props, rolesStore (+5 more)

### Community 58 - "Community 58"
Cohesion: 0.14
Nodes (12): columnDisplayItems, columns, debouncedSearch, EMPTY_ROWS, openDetailsTarifaire, searchInput, selectedTarifaire, supabase (+4 more)

### Community 59 - "Community 59"
Cohesion: 0.22
Nodes (7): _contrast_ratio(), _derive_dark_palette(), WCAG contrast ratio for two hex colors, or None if either is invalid., Keep product brand tokens while deriving accessible dark surfaces., Pick the highest-ranked palette matching the resolved mode. Only the dark case…, _select_palette_for_mode(), TestPaletteSelection

### Community 60 - "Community 60"
Cohesion: 0.17
Nodes (12): { data: lookups }, emit, { getAffectationsMagasin }, itemsEmplacement, itemsMagasin, onSubmit(), open, props (+4 more)

### Community 61 - "Community 61"
Cohesion: 0.17
Nodes (12): emit, getTypeOrganisations, itemsOrganisation, lookupsStore, onSubmit(), open, organisationsStore, parametresStore (+4 more)

### Community 62 - "Community 62"
Cohesion: 0.18
Nodes (11): { data: lookups }, emit, isLoading, itemsTypeDocument, onSubmit(), open, parametresStore, schema (+3 more)

### Community 63 - "Community 63"
Cohesion: 0.18
Nodes (11): columns, emit, EMPTY_ROWS, isOpen, items, open, props, toast (+3 more)

### Community 64 - "Community 64"
Cohesion: 0.18
Nodes (11): { data: lookups }, emit, items, onSubmit(), open, RoleSchema, rolesStore, Schema (+3 more)

### Community 65 - "Community 65"
Cohesion: 0.18
Nodes (10): { data: organisations }, emit, items, onSubmit(), open, schema, state, supabase (+2 more)

### Community 66 - "Community 66"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, happy-dom, @iconify-json/solar, @nuxt/eslint, @nuxt/test-utils, playwright, supabase (+4 more)

### Community 67 - "Community 67"
Cohesion: 0.18
Nodes (7): deleteAccountLoading, password, passwordSchema, registerPasskeyLoading, showDeleteAccountModal, supabase, toast

### Community 68 - "Community 68"
Cohesion: 0.22
Nodes (9): emit, onSubmit(), open, organisationsStore, props, schema, state, supabase (+1 more)

### Community 69 - "Community 69"
Cohesion: 0.20
Nodes (8): appConfig, auth, colorMode, colors, isLogoutModalOpen, items, neutrals, user

### Community 70 - "Community 70"
Cohesion: 0.25
Nodes (9): _exact_match_diagnostic(), _legacy_successor_guidance(), _normalize(), Apply longest-first synonym substitution at token boundaries., Whether a stack query explicitly targets an older framework generation., Choose one coherent applicability generation for stack retrieval., Prefer the explicit successor row for a brand-new app on legacy-only stacks., _stack_query_requests_legacy() (+1 more)

### Community 71 - "Community 71"
Cohesion: 0.22
Nodes (7): color, colorMode, { idle }, { isOnline }, parametresStore, toast, user

### Community 72 - "Community 72"
Cohesion: 0.22
Nodes (7): emit, open, props, emit, open, props, @nuxt/ui

### Community 73 - "Community 73"
Cohesion: 0.22
Nodes (5): editSchema, zod, bodySchema, bodySchema, bodySchema

### Community 74 - "Community 74"
Cohesion: 0.28
Nodes (8): emit, isOpen, lookupsStore, onSubmit(), props, schema, state, toast

### Community 75 - "Community 75"
Cohesion: 0.22
Nodes (5): tableUI, useDataTable(), scule, @tanstack/table-core, vue

### Community 76 - "Community 76"
Cohesion: 0.22
Nodes (9): scripts, build, dev, lint, postinstall, preview, test, test:watch (+1 more)

### Community 77 - "Community 77"
Cohesion: 0.25
Nodes (8): RLS Performance Optimization, Postgres Best Practices Skill, Supabase Skill, Professional UI Rules, UI/UX Pro Max Skill, Abstract Background Pattern, Design System Master, Hazipro Template

### Community 78 - "Community 78"
Cohesion: 0.25
Nodes (8): _exact_row_identity(), Suggest complete public identities so a retry can bypass score thresholds., Return non-empty public identities from ordinary and alias fields., Resolve an explicit style identity without opening generic variant ranking., Return one row whose stable public identity exactly matches the query., _row_identities(), _style_identity(), _suggest_identities()

### Community 79 - "Community 79"
Cohesion: 0.32
Nodes (7): emit, isOpen, onSubmit(), props, schema, state, toast

### Community 80 - "Community 80"
Cohesion: 0.25
Nodes (6): auth, fields, loading, providers, schema, toast

### Community 81 - "Community 81"
Cohesion: 0.25
Nodes (4): fileRef, profile, profileSchema, toast

### Community 82 - "Community 82"
Cohesion: 0.43
Nodes (3): _filter_anti_patterns_for_mode(), Drop "avoid dark mode" advice once dark mode is the resolved answer., TestAntiPatternGating

### Community 83 - "Community 83"
Cohesion: 0.33
Nodes (6): emit, onSubmit(), open, schema, state, toast

### Community 84 - "Community 84"
Cohesion: 0.47
Nodes (3): split_values(), style_identities(), TestStyleIdentityContract

### Community 86 - "Community 86"
Cohesion: 0.33
Nodes (3): open, props, UIcon

### Community 88 - "Community 88"
Cohesion: 0.33
Nodes (4): auth, isOwnerError, props, ref_app

### Community 89 - "Community 89"
Cohesion: 0.33
Nodes (5): groups, links, open, route, toast

### Community 92 - "Community 92"
Cohesion: 0.50
Nodes (3): emit, open, props

### Community 93 - "Community 93"
Cohesion: 0.50
Nodes (3): { data: notifications }, { isNotificationsSlideoverOpen }, @vueuse/core

### Community 94 - "Community 94"
Cohesion: 0.50
Nodes (3): props, selectedUser, usersRefs

### Community 95 - "Community 95"
Cohesion: 0.50
Nodes (3): items, selectedTeam, teams

### Community 96 - "Community 96"
Cohesion: 0.50
Nodes (3): currentStep, steps, user

### Community 99 - "Community 99"
Cohesion: 0.67
Nodes (3): ref_h3, requireAdmin(), requireAuth()

## Knowledge Gaps
- **782 isolated node(s):** `colorMode`, `{ idle }`, `{ isOnline }`, `color`, `user` (+777 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 979 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nuxt/ui` connect `Community 72` to `Community 0`, `Community 3`, `Community 4`, `Community 6`, `Community 13`, `Community 14`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 21`, `Community 22`, `Community 23`, `Community 25`, `Community 26`, `Community 28`, `Community 29`, `Community 30`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 47`, `Community 48`, `Community 49`, `Community 50`, `Community 52`, `Community 53`, `Community 54`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 60`, `Community 61`, `Community 62`, `Community 63`, `Community 64`, `Community 65`, `Community 67`, `Community 68`, `Community 69`, `Community 74`, `Community 79`, `Community 80`, `Community 81`, `Community 83`?**
  _High betweenness centrality (0.242) - this node is a cross-community bridge._
- **Why does `zod` connect `Community 73` to `Community 3`, `Community 4`, `Community 13`, `Community 16`, `Community 18`, `Community 19`, `Community 21`, `Community 26`, `Community 27`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 40`, `Community 47`, `Community 52`, `Community 53`, `Community 54`, `Community 56`, `Community 57`, `Community 60`, `Community 61`, `Community 62`, `Community 64`, `Community 65`, `Community 67`, `Community 68`, `Community 74`, `Community 79`, `Community 80`, `Community 81`, `Community 83`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 24` to `Community 13`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `colorMode`, `{ idle }`, `{ isOnline }` to the rest of the system?**
  _782 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.0977891156462585 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10121457489878542 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10661268556005399 - nodes in this community are weakly interconnected._