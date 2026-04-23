# 🎴 Solimots

Jeu de "solitaire d'associations" (SPA) inspiré de _Solitaire association journey_ : ici, les cartes sont des mots français à ranger dans les bonnes catégories.

## 🎯 Description

Solimots est un jeu de patience où vous devez associer des mots français à leurs catégories correspondantes. Le jeu combine la mécanique classique du solitaire avec un défi de vocabulaire et de catégorisation.

## ✨ Fonctionnalités

### 🎮 Mécanique de Jeu
- **Tableau de jeu** : 3-5 colonnes avec 4-6 cartes par colonne
- **Pioche et défausse** : Système de recyclage style Klondike
- **4 emplacements** : Placez d'abord une carte catégorie, puis 2-8 mots correspondants
- **Système d'annulation** : Historique des coups pour revenir en arrière
- **Validation intelligente** : Messages d'erreur explicites pour les coups invalides

### 🏆 Progression
- **Système de points** : 4 points de base par carte + bonus de rapidité borné
- **Niveaux** : Un nouveau niveau tous les 100 points
- **10 titres de progression** : De "Débutant" à "Divin"
- **Animation de complétion** : Célébrez vos victoires avec style
- **Génération déterministe** : Niveaux reproductibles grâce à Mulberry32 PRNG
- **Timer de partie** : chrono affiché en haut, sans limite de temps, avec affichage du temps final en victoire

### 🎨 Personnalisation
- **6 thèmes visuels** :
  - Classic (bleu)
  - Ocean (cyan)
  - Forest (vert)
  - Sunset (orange)
  - Night (violet)
  - Royal (pourpre)
- **Sons et musique** : Effets sonores désactivables
- **Support gaucher/droitier** : Contrôles adaptables pour mobile
- **Mode hors ligne** : PWA avec service worker

### 📚 Contenu
Plus de **30 catégories** de mots français avec ~8 mots chacune :

**Alimentation** : Fruits, Légumes, Produits laitiers, Épices, Viandes, Poissons, Desserts, Boissons

**Animaux** : Mammifères, Oiseaux, Poissons, Insectes, Animaux sauvages, Animaux de la ferme

**Sports** : Sports de balle, Sports de raquette, Arts martiaux, Sports d'extérieur, Sports nautiques

**Nature** : Arbres, Fleurs, Paysages, Météo

**Technologie** : Appareils, Internet, Sécurité

**Autres** : Transports, Lieux, Objets, Actions, Émotions, Métiers, etc.

### 🎵 Audio
- Effets sonores pour chaque action (placement, pioche, erreur, victoire, défaite)
- Musique de fond désactivable
- Gestion via `soundManager` et hooks personnalisés

### 📱 Interface
- **Pages** :
  - Accueil avec navigation principale
  - Écran de jeu plein écran
  - Comment jouer (règles détaillées)
  - Tutoriel interactif
  - Paramètres (thème, son, contrôles)
- **Navigation** : React Router avec transitions animées (Framer Motion)
- **Responsive** : Design mobile-first avec contrôles en dock
- **Drag & Drop** : Interface intuitive pour déplacer les cartes

## 🛠️ Stack Technique

- **Framework** : React 19.2 + TypeScript
- **Build** : Vite 7.2
- **État** : Zustand 5.0 (3 stores avec persistence localStorage)
- **Routing** : React Router 7.10
- **Animations** : Framer Motion 12.23
- **Icons** : Lucide React
- **Styling** : Tailwind CSS 3.4 + PostCSS
- **PWA** : vite-plugin-pwa 1.2
- **Qualité** : ESLint + Prettier

## 📁 Structure du Projet

```
src/
├── components/
│   ├── GameScreen.tsx          # Interface principale du jeu
│   ├── board/                  # Composants du plateau (tableau, emplacements)
│   ├── cards/                  # Composants de cartes
│   ├── dock/                   # Contrôles bas d'écran (pioche, défausse)
│   ├── modals/                 # Modales (aide, progression)
│   └── ui/                     # Composants UI réutilisables
├── game/
│   ├── types.ts                # Interfaces TypeScript (Card, LevelState, SlotState)
│   ├── wordBank.ts             # 30+ catégories de mots français
│   └── levelGen.ts             # Génération déterministe de niveaux
├── routes/                     # Pages (Home, Game, HowTo, Tutorial, Settings)
├── store/
│   ├── gameStore.ts            # État du jeu actif
│   ├── progressionStore.ts    # Statistiques et progression du joueur
│   └── settingsStore.ts        # Préférences utilisateur
├── utils/                      # Hooks et utilitaires (son, thème)
└── App.tsx                     # Layout et routing principal
```

## 🚀 Commandes

### Développement
```bash
npm install          # Installer les dépendances
npm run dev          # Lancer le serveur de développement
npm run typecheck    # Vérifier les types TypeScript
```

### Build et Preview
```bash
npm run build        # Compiler pour la production (TypeScript + Vite)
npm run preview      # Prévisualiser le build de production
```

### Qualité du Code
```bash
npm run lint         # Linter le code
npm run lint:fix     # Corriger automatiquement les erreurs de linting
npm run format       # Formater le code avec Prettier
npm run format:check # Vérifier le formatage
```

## 📦 PWA (Progressive Web App)

Le jeu est une PWA complète avec :
- **Offline support** : Fonctionnement hors ligne via service worker
- **Installation** : Installable sur mobile et desktop
- **Icons** : Icons optimisés (192x192, 512x512, maskable)
- **Manifest** : Configuration dans `public/manifest.webmanifest`
- **Auto-update** : Mise à jour automatique du service worker

Configuration dans `vite.config.ts` avec `vite-plugin-pwa` et enregistrement manuel du SW dans `src/main.tsx`.

## 🌐 Déploiement Vercel

Le projet est configuré pour Vercel (SPA) :

1. **Configuration** : Le fichier `vercel.json` ajoute une rewrite vers `index.html` pour le routing côté client
2. **Déploiement** :
   - Importer le repo dans Vercel
   - Build command : `npm run build`
   - Output directory : `dist/`

## 🎯 Gestion d'État

Trois stores Zustand avec persistence localStorage :

| Store | Rôle | Fonctions clés |
|-------|------|----------------|
| **gameStore** | État du jeu actif | `newGame()`, `draw()`, `moveCard()`, `undo()` |
| **progressionStore** | Statistiques joueur | Points, niveaux, titres, `awardPoints()` |
| **settingsStore** | Préférences | Thème, son/musique, contrôles gaucher/droitier |

## 🎓 Contributions

Le projet suit les standards :
- **TypeScript strict** pour la sécurité des types
- **ESLint** avec règles React + Prettier
- **Prettier** pour le formatage cohérent
- **Hooks personnalisés** pour la réutilisabilité
- **Immutabilité** des états (fonction `cloneLevel()`)

## 📝 Licence

Projet privé (voir `package.json`)

---

**Développé avec ❤️ en React + TypeScript**
