# Nuxt Template

Template Nuxt 4 avec Nuxt UI v4, Supabase, Pinia et Tailwind CSS v4.

## Stack

- **Nuxt 4** — Framework Vue full-stack
- **Nuxt UI v4** — Bibliothèque de composants UI
- **Supabase** — Authentification, base de données, temps réel
- **Pinia** — State management
- **Tailwind CSS v4** — Styling utilitaire
- **TypeScript** — Typage strict
- **Zod** — Validation de schémas
- **ESLint** — Linting
- **Vitest** — Tests unitaires

## Démarrage

```bash
# Installer les dépendances
bun install

# Configurer les variables d'environnement
cp .env.example .env
# Remplir SUPABASE_URL et SUPABASE_SERVICE_KEY

# Lancer le serveur de développement
bun run dev
```

## Scripts

| Commande | Description |
|----------|-------------|
| `bun run dev` | Serveur de développement |
| `bun run build` | Build production |
| `bun run preview` | Preview production |
| `bun run lint` | ESLint |
| `bun run typecheck` | Vérification des types |
| `bun run test` | Tests unitaires |

## Structure

```
app/
├── components/    # Composants Vue
├── composables/   # Composables (useAuth, etc.)
├── layouts/       # Layouts (default, auth)
├── middleware/     # Middleware (auth, admin)
├── pages/         # Pages (settings, auth, etc.)
├── stores/        # Stores Pinia
├── types/         # Types TypeScript
└── utils/         # Utilitaires

server/
├── api/           # Routes API (exemples GET, POST, PUT, PATCH, DELETE)
├── middleware/     # Middleware serveur (auth Supabase)
└── utils/         # Utilitaires serveur (requireAuth, requireAdmin)
```

## Utiliser comme template

1. Sur GitHub, coche "Template repository" dans Settings
2. Crée un nouveau repo : `gh repo create mon-projet --template USER/nuxt-template`
3. Clone, installe les dépendances et personnalise
