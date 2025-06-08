# KTV Card Editor

**Version:** 1.0

Éditeur de cartes pour KTV, simple et rapide. Cette application web est conçue pour générer des images promotionnelles dynamiques pour les médias (animes, films, séries, etc.) diffusés sur OtakuCast. Elle utilise Next.js, React, et TypeScript pour offrir une expérience utilisateur fluide et performante.

## Fonctionnalités

- **Génération de cartes promotionnelles :** Créez des cartes visuellement attrayantes pour promouvoir des animes, films ou séries.
- **Intégration TMDB :** Recherche et récupération automatique des informations (titre, synopsis, images, genres, etc.) à partir de l'API The Movie Database (TMDB).
- **Intégration Gemini AI :** Utilisation de l'API Google Gemini pour la génération de résumés de synopsis si le texte est trop long.
- **Personnalisation des cartes :** Modifiez manuellement divers champs tels que la saison, l'année de sortie, le studio, les plateformes de diffusion, la note, le synopsis et les genres.
- **Prévisualisation en temps réel :** Visualisez les changements apportés à la carte instantanément.
- **Design moderne :** Interface utilisateur épurée et réactive.

## Exemples de cartes

Voici quelques exemples de cartes générées avec l'application :

![Exemple de carte 1](/public/ex1.png)
![Exemple de carte 2](/public/ex2.png)
![Exemple de carte 3](/public/ex3.png)
![Exemple de carte 4](/public/ex4.png)
![Exemple de carte 5](/public/ex5.png)
![Exemple de carte 6](/public/ex6.png)

## Technologies Utilisées

- [**Next.js**](https://nextjs.org/) : Framework React pour la construction d'applications web.
- [**React**](https://react.dev/) : Bibliothèque JavaScript pour la construction d'interfaces utilisateur.
- [**TypeScript**](https://www.typescriptlang.org/) : Langage de programmation pour un code plus robuste et maintenable.
- [**Tailwind CSS**](https://tailwindcss.com/) : Framework CSS utilitaire pour un stylisme rapide et efficace.
- [**Headless UI**](https://headlessui.com/) : Composants UI accessibles et non stylisés pour une flexibilité maximale.
- [**Google Generative AI (Gemini API)**](https://ai.google.dev/models/gemini) : Pour la génération de texte (résumés de synopsis).
- [**The Movie Database (TMDB) API**](https://www.themoviedb.org/documentation/api) : Pour les données des médias.

## Configuration du Projet

### Prérequis

Assurez-vous d'avoir installé les éléments suivants :

- [Node.js](https://nodejs.org/en/) (version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Installation

1.  **Clonez le dépôt :**

    ```bash
    git clone https://github.com/Joyboy-dy/ktv-card-edit.git
    cd ktv-card-edit
    ```

2.  **Installez les dépendances :**

    ```bash
    npm install
    # ou
    yarn install
    ```

### Variables d'Environnement

Cette application utilise des variables d'environnement pour stocker les clés API sensibles. Vous devrez obtenir vos propres clés API et les configurer.

1.  **Créez un fichier `.env.local`** à la racine de votre projet.
2.  **Ajoutez les variables suivantes** à votre fichier `.env.local` :

    ```
    NEXT_PUBLIC_TMDB_API_KEY=votre_cle_api_tmdb
    NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
    NEXT_PUBLIC_GEMINI_API_KEY=votre_cle_api_gemini
    ```

    - Remplacez `votre_cle_api_tmdb` par votre clé API TMDB.
    - Remplacez `votre_cle_api_gemini` par votre clé API Google Gemini.

    **Important :** Le fichier `.env.local` est ignoré par Git pour des raisons de sécurité. Ne le commettez jamais sur votre dépôt public ! Pour le déploiement en production, vous devrez configurer ces variables directement sur votre plateforme d'hébergement (par exemple, Vercel, Netlify).

## Démarrage de l'Application

Pour démarrer l'application en mode développement :

```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible à l'adresse `http://localhost:3000`.

## Déploiement

Cette application est conçue pour être facilement déployée sur des plateformes comme [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/). Assurez-vous de configurer vos variables d'environnement sur la plateforme de déploiement.

## Structure du Projet

```
.
├── public/                 # Fichiers statiques (images, favicons)
├── components/             # Composants React réutilisables
├── lib/                    # Fonctions utilitaires et contextes
├── app/                    # Pages et routes Next.js
├── styles/                 # Styles globaux ou spécifiques
├── .env.local              # Variables d'environnement locales (non commises)
├── .gitignore              # Fichiers à ignorer par Git
├── package.json            # Dépendances et scripts du projet
├── next.config.ts          # Configuration de Next.js
├── tailwind.config.js      # Configuration de Tailwind CSS
├── tsconfig.json           # Configuration TypeScript
└── README.md               # Ce fichier
```

## Contribution

Les contributions sont les bienvenues ! Veuillez ouvrir une issue ou soumettre une pull request.

## Auteur

Félicio DSA dev (Joyboy-dy) <feliciodsa.dev@gmail.com>

## Licence

Ce projet est sous licence Apache-2.0. 