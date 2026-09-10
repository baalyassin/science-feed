# Science Feed

Fil d'actualité scientifique personnalisé, façon TikTok : un flux vertical d'articles scientifiques adapté aux centres d'intérêt de l'utilisateur, avec sauvegarde, recherche et suivi de l'engagement.

## Fonctionnalités

- Authentification (inscription / connexion)
- Onboarding par centres d'intérêt pour personnaliser le flux
- Flux vertical d'articles scientifiques recommandés
- Recherche d'articles
- Articles sauvegardés
- Suivi des interactions (lecture, like, sauvegarde) pour affiner les recommandations

## Stack technique

- **Next.js** (App Router) + **React**
- **NextAuth** pour l'authentification
- **Prisma** + **SQLite** pour la persistance
- **TanStack Query** pour la gestion des données côté client
- **fast-xml-parser** pour l'ingestion de flux d'articles
- **Tailwind CSS**

## Démarrer en local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).
