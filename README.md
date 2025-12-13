# Solimots

Jeu de “solitaire d’associations” (SPA) inspiré de *Solitaire association journey* : ici, les cartes sont des mots, à ranger dans les bonnes catégories.

## Stack
- React + Vite + TypeScript
- TailwindCSS
- React Router
- Zustand (state)
- Framer Motion (animations)

## Lancer en local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Déploiement Vercel (SPA)
- La configuration `vercel.json` ajoute une **rewrite** vers `index.html` pour que le routing côté client fonctionne (ex: `/game`).\n- Déploiement: importer le repo dans Vercel, puis build command `npm run build` et output `dist/`.
