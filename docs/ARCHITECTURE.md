# Documentation Architecture

## Vue d'Ensemble du Système

Ce document fournit une vue d'ensemble de l'architecture du système de tickets à gratter, incluant les relations entre les différents services et composants.

## Diagramme d'Architecture des Services

```mermaid
classDiagram
    class TicketService {
        +buyTicket(categoryId: number) Promise<{success: boolean, error: Error | null}>
        +scratchTicket(ticketId: string) Promise<{prize: Prize | null, error: Error | null}>
        +getTickets() Promise<{data: Ticket[], error: Error | null}>
    }

    class PointsService {
        +addPoints(points: number) Promise<{success: boolean, error: Error | null}>
        +getPoints() Promise<{points: number, error: Error | null}>
        +getHistory() Promise<{data: PointHistory[], error: Error | null}>
    }

    class LeaderboardService {
        +getLeaderboard() Promise<{data: LeaderboardEntry[], error: Error | null}>
        +getUserRank() Promise<{rank: number, error: Error | null}>
    }

    class AuthServices {
        +loginService(email: string, password: string) Promise<{data: any, error: Error | null}>
        +signupService(email: string, password: string, username: string) Promise<{data: any, error: Error | null}>
        +logoutService() Promise<{error: Error | null}>
    }

    class AdminService {
        +getAllUsers() Promise<{data: Profile[] | null, error: Error | null}>
        +deleteUser(id: string) Promise<{success: boolean, error: Error | null}>
        +managePrizes() Promise<{success: boolean, error: Error | null}>
    }

    class Profile {
        +id: string
        +email: string
        +username: string
        +points: number
        +created_at: string
        +updated_at: string
    }

    class Ticket {
        +id: string
        +category_id: number
        +user_id: string
        +scratched: boolean
        +prize_id: string
        +created_at: string
    }

    class Prize {
        +id: string
        +name: string
        +points: number
        +probability: number
        +category_id: number
    }

    class PointHistory {
        +id: string
        +user_id: string
        +points: number
        +source: string
        +created_at: string
    }

    class SupabaseClient {
        +auth: AuthClient
        +from(): DatabaseClient
        +rpc(): RPCClient
    }

    SupabaseClient --> TicketService : uses
    SupabaseClient --> PointsService : uses
    SupabaseClient --> LeaderboardService : uses
    SupabaseClient --> AuthServices : uses
    SupabaseClient --> AdminService : uses

    Profile --> AuthServices : uses
    Ticket --> TicketService : manages
    Prize --> TicketService : contains
    PointHistory --> PointsService : manages
    Profile --> LeaderboardService : uses
```

## Description des Composants

### Services Principaux

- **TicketService**: Gère les opérations liées aux tickets (achat, grattage, consultation)
- **PointsService**: Gère le système de points (ajout, consultation, historique)
- **LeaderboardService**: Gère le classement des joueurs
- **AuthServices**: Gère l'authentification (connexion, inscription, déconnexion)
- **AdminService**: Gère les opérations administratives

### Modèles de Données

- **Profile**: Informations utilisateur et points
- **Ticket**: Représente un ticket à gratter
- **Prize**: Configuration des récompenses
- **PointHistory**: Historique des points gagnés

### Infrastructure

- **SupabaseClient**: Client principal pour interagir avec Supabase
- **RPCClient**: Client pour les procédures stockées (logique de jeu)

## Relations Clés

1. Tous les services utilisent SupabaseClient pour les opérations de base de données
2. Le TicketService gère le cycle de vie des tickets (création, grattage)
3. Le PointsService maintient le solde et l'historique des points
4. Le LeaderboardService utilise les données de Profile pour le classement
5. L'AdminService supervise l'ensemble du système

## Flux de Données

1. **Achat de Ticket**:

   - Vérification de l'authentification
   - Création du ticket via TicketService
   - Attribution aléatoire d'un prix selon les probabilités

2. **Grattage de Ticket**:

   - Vérification du ticket non gratté
   - Révélation du prix
   - Mise à jour des points via PointsService
   - Enregistrement dans l'historique

3. **Mise à Jour du Classement**:
   - Calcul automatique après chaque gain de points
   - Mise à jour du rang du joueur

## Considérations de Sécurité

- Vérification des privilèges administrateur
- Vérification de l'authentification pour les routes protégées
- Application des rôles utilisateur au niveau des services
- Protection contre la triche (vérifications côté serveur)
- Limitation des tentatives de grattage

## Optimisations

- Mise en cache du classement
- Pagination des historiques
- Procédures stockées pour les opérations critiques
- Transactions pour la cohérence des données
