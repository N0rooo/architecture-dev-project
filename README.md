# Scratch Ticket Game Platform

Une application web moderne construite avec Next.js 15, React 19, et Supabase, offrant une expérience de jeu de tickets à gratter gratuits avec un système de points.

## Fonctionnalités

- 🎮 **Système de Jeu**

  - Tickets à gratter virtuels gratuits
  - Différentes catégories de tickets
  - Animation de grattage interactive
  - Système de points et récompenses

- 🏆 **Système de Points**

  - Accumulation de points par ticket
  - Historique des points gagnés
  - Classement des joueurs (Leaderboard)
  - Statistiques personnelles

- 🔐 **Système d'Authentification**

  - Inscription et connexion utilisateur
  - Gestion sécurisée des sessions
  - Contrôle d'accès basé sur les rôles (Admin/Utilisateur)

- 👥 **Gestion des Utilisateurs**

  - Profils utilisateurs
  - Tableau de bord administrateur
  - Suivi des activités utilisateur

- 🎨 **Interface Moderne**

  - Composants UI Radix
  - Design responsive avec Tailwind CSS
  - Notifications avec Sonner
  - Animations personnalisées

- 🔧 **Expérience Développeur**
  - Support TypeScript
  - Tests avec Jest
  - Configuration ESLint et Prettier
  - Hooks Git avec Husky
  - Génération automatique des types Supabase

## Documentation du Projet

- [Documentation Architecture](docs/ARCHITECTURE.md) - Architecture système et relations entre composants
- [Documentation API](https://nextjs.org/docs/app/api-reference) - Référence API Next.js

## Prérequis

- Node.js 18+
- Gestionnaire de paquets PNPM
- Compte et projet Supabase

## Configuration de l'Environnement

1. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SERVICE_ROLE_KEY=your_service_role_key
```

## Démarrage

1. Installer les dépendances :

```bash
pnpm install
```

2. Générer les types Supabase :

```bash
pnpm db-types
```

3. Lancer le serveur de développement :

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Scripts Disponibles

- `pnpm dev` - Démarrer le serveur de développement avec Turbopack
- `pnpm build` - Build pour la production
- `pnpm start` - Démarrer le serveur de production
- `pnpm test` - Lancer les tests
- `pnpm lint` - Lancer ESLint
- `pnpm prettier` - Formater le code
- `pnpm db-types` - Générer les types Supabase

## Tests

Le projet utilise Jest et React Testing Library pour les tests. Lancez les tests avec :

```bash
pnpm test
```

## Qualité du Code

- ESLint pour le linting
- Prettier pour le formatage
- Husky pour les hooks Git
- Lint-staged pour les vérifications pre-commit

## Stack Technique

- **Framework:** Next.js 15
- **Langage:** TypeScript
- **Base de données:** Supabase
- **Authentification:** Supabase Auth
- **Composants UI:** Radix UI
- **Styling:** Tailwind CSS
- **Formulaires:** React Hook Form
- **Validation:** Zod
- **Tests:** Jest + React Testing Library
- **Gestion d'État:** React Hooks

## Structure de la Base de Données

- **users** - Informations utilisateur
- **points_history** - Historique des points
- **user_prize_attempts** - Tentatives et tickets joués
- **prizes** - Configuration des récompenses
- **user_role** - Rôles utilisateur (admin/user)

## Contribution

1. Forkez le dépôt
2. Créez votre branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est privé et n'est pas sous licence pour une utilisation publique.
