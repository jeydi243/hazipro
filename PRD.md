# Hazipro — Product Requirements Document

> Back-office finance d'un groupe multi-entités : notes de frais (NF) et ordres de paiement
> fournisseur (OP), de la saisie au paiement, à travers une matrice d'approbation configurable.
>
> RDC · français · CDF + USD · multi-tenant (Supabase + RLS)

---

## Problem

Un groupe qui opère plusieurs entités doit faire circuler chaque document de dépense — note de
frais ou ordre de paiement fournisseur — à travers une chaîne d'approbation avant qu'il ne soit
payé. Aujourd'hui le socle existe (saisie, référentiels, paramétrage de la matrice) mais
**l'exécution du workflow ne vit pas dans le produit** : les statuts d'un document sont affichés
en lecture seule, aucun écran ne permet d'approuver ou de rejeter, et rien ne matérialise le
passage à la trésorerie.

Le coût de ne pas le résoudre : un document ne peut pas être **prouvé conforme**. On ne sait pas
qui a approuvé quoi, à quel niveau, dans quelle devise, pour quelle entité — et le produit
revendique précisément que la matrice d'approbation est le mécanisme sur lequel tout est bâti.

## Evidence

- **Aucune preuve formelle.** Le produit repose sur la compréhension du métier, pas sur des
  mesures. Toute affirmation de douleur utilisateur ci-dessous est une **hypothèse à valider**
  par observation terrain (voir Open Questions).
- Preuve de l'état de construction (le dépôt, pas la douleur) :
  - `app/components/nf/AddModal.vue` expose cinq statuts — `statut_document` (`Brouillon`),
    `statut_approbation` (`Non soumis`), `statut_paiement` (`Non payé`), `statut_planification`,
    `statut_programmation` — **tous en `disabled`**. Les axes d'état sont modélisés, la machine à
    états ne l'est pas.
  - `app/pages/op.vue` et `app/pages/workflow.vue` sont des **copies de `app/pages/nf.vue`** :
    titre « Note de frais », composant `NfAddModal`, données `nfs`. Aucune implémentation propre.
  - Aucun composant `tresorerie` / `paiements` n'existe.
  - `app/pages/index.vue` est encore le boilerplate Nuxt UI Pro.

## Users

- **Primary — Saisie / finance** : crée et soumet les NF et OP, maintient les référentiels
  (bénéficiaires, comptes bancaires, banques, grille tarifaire, articles). Déclencheur : une
  dépense engagée doit être régularisée.
- **Primary — Approbateurs / managers** : travaillent la matrice par niveau. Approuver ou rejeter
  est leur action quotidienne — **aujourd'hui impossible dans le produit**.
- **Primary — Trésorerie / paiement** : exécute et rapproche le paiement une fois le document
  approuvé. **Pas de surface dédiée aujourd'hui.**
- **Primary — Admin / paramétrage** : configure classes & lookups, organisations, matrices,
  taux, users et rôles. C'est la seule des quatre dont la surface est complète.
- **Not for** : les organisations de santé. `Patient`, `Mutuelle`, `Médecin`, `RendezVous` et
  `patients_organisations` existent en base et doivent être **conservés**, mais aucun parcours
  santé n'entre dans ce périmètre.

## Hypothesis

We believe **l'exécution du workflow d'approbation dans le produit — statuts NF/OP vivants plus
matrice de niveaux appliquée** will **permettre à un document saisi dans une entité d'atteindre le
paiement avec chaque approbation enregistrée** for **les quatre rôles finance du groupe**.

We'll know we're right when **un document réel traverse saisie → approbation(s) → paiement sans
jamais quitter Hazipro, et que son historique d'approbation est consultable après coup**.

## Success Metrics

*Aucune cible chiffrée n'est établie aujourd'hui. Ne pas en inventer.*

| Metric | Target | How measured |
|---|---|---|
| Part des documents atteignant le paiement entièrement dans le produit | TBD — needs validation | comptage manuel sur un mois d'activité réelle |
| Délai saisie → dernière approbation | TBD — needs validation | horodatage des transitions de statut |
| Documents payés sans trace d'approbation complète | **0** (cible de conception, pas une mesure) | requête d'intégrité sur les documents payés |

## Scope

**MVP** — les quatre chantiers retenus pour la prochaine phase :

1. Workflow d'approbation exécuté de bout en bout sur NF (puis OP), adossé aux cinq axes de
   statut déjà modélisés.
2. Surface trésorerie : exécution et rapprochement du paiement après approbation.
3. Accueil / dashboard produit, aujourd'hui boilerplate.
4. Dette de cohérence : Wazi → Hazipro, README, chaînes anglaises.

**Out of scope**

- **Parcours santé** — `patients`, `mutuelles`, `patients_mutuelles` restent en base mais ne
  reçoivent aucun workflow. Reporté : aucun besoin métier confirmé.
- **Pricing / packaging / plan SaaS** — rien n'est établi. Reporté tant que la décision n'est pas
  prise ; l'inventer produirait un document faux.
- **Troisième devise** — CDF et USD seulement.
- **Anglais comme langue supportée** — le français est la langue produit ; l'anglais est de la
  dette, pas une cible.

## Delivery Milestones

| # | Milestone | Outcome | Status | Plan |
|---|---|---|---|---|
| 1 | Workflow d'approbation | Un approbateur approuve ou rejette un document depuis le produit ; l'état avance selon la matrice et l'historique est consultable | pending | — |
| 2 | Trésorerie & paiements | Un document approuvé est exécuté et rapproché sans quitter Hazipro | pending | — |
| 3 | Accueil / dashboard | `index.vue` décrit le produit et donne accès aux documents en attente selon le rôle | pending | — |
| 4 | Dette de cohérence | « Wazi » disparaît du produit, le README décrit Hazipro, les chaînes anglaises sont recensées | pending | — |

## Open Questions

- [ ] **Où vit le schéma réel ?** Les migrations du dépôt s'arrêtent au 12/08/2026 et ne
      contiennent ni `banques`, ni `comptes_bancaires`, ni `matrices`, ni `approbateurs`, ni
      `taux`, ni `adresses`, ni `avatars` — alors que le code les interroge. Le schéma a-t-il été
      créé hors migrations (dashboard Supabase) ? Sans réponse, toute table nouvelle échappe au
      versionnement.
- [ ] **`op.vue` et `workflow.vue` : à construire ou à retirer ?** Ce sont des copies de la page
      NF, avec un titre et un composant qui ne correspondent pas à leur nom. Le statut « ordre de
      paiement » est-il porté par `invoices`/`invoices_lines`, ou par une table absente ?
- [ ] **Les cinq axes de statut valent-ils aussi pour OP ?** Ils ne sont modélisés que côté NF.
- [ ] **Qui peut approuver quoi, et à quel niveau ?** La table `approbateurs` porte un `niveau`,
      mais la règle de routage (quelle matrice s'applique à quelle organisation × type de
      document) n'est écrite nulle part de façon lisible.
- [ ] **Nom du produit** : `Hazipro` domine, mais `confirm.vue`, `profile.vue` et `settings.vue`
      portent encore « Wazi ».
- [ ] **Preuve terrain** : existe-t-il aujourd'hui un utilisateur réel dont on peut observer le
      parcours ? Sans cela, les métriques restent TBD.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Dérive de schéma — la base réelle diverge des migrations du dépôt | Élevée (déjà observée) | Élevé | Régénérer les migrations depuis la base avant tout travail sur les statuts |
| Le mécanisme central revendiqué (la matrice) n'a pas de couche d'exécution | Élevée | Élevé | Traiter le milestone 1 comme fondateur, pas comme une fonctionnalité |
| RLS contournée — une table nouvelle sans politique casse l'isolation par tenant | Moyenne | Élevé | Toute nouvelle table reçoit sa politique dans la même migration |
| Pages dupliquées (`op.vue`, `workflow.vue`) — un correctif atterrit dans le mauvais fichier | Élevée | Moyen | Trancher la question ouverte avant de les modifier |
| Métriques TBD — impossible de démontrer le succès | Élevée | Moyen | Définir une observation terrain minimale au milestone 1 |

---
*Status: DRAFT — requirements only. Implementation planning pending via `/plan`.*
