# SpamPatrol

MVP local pour consulter et ajouter des signalements téléphoniques, puis exporter les données. Le frontend utilise React et le backend Express ; les données sont conservées dans des fichiers JSON. Les enregistrements ne sont pas vérifiés et les exemples historiques ne représentent pas des statistiques réelles.

## Installation et démarrage

Prérequis : Node.js 18 ou plus récent et npm. Depuis la racine du dépôt :

```sh
npm run install:all
npm start
```

`npm start` lance l’API sur `http://localhost:4000` et le frontend Create React App sur `http://localhost:3000`. Pour démarrer séparément : `npm run start:back` ou `npm run start:front`. Le script de démarrage ne lance pas d’installation automatique.

Variables facultatives :

- `PORT` : port du backend (4000 par défaut).
- `FRONTEND_ORIGIN` : origines frontend autorisées, séparées par des virgules. Les origines localhost usuelles (ports 3000/3001 et port par défaut) sont autorisées par défaut.
- `REACT_APP_API_URL` : URL de l’API, par défaut `http://localhost:4000/api`.

## Tests et build

```sh
npm test
npm run build:front
```

Les tests backend utilisent `node:test`. Les tests frontend utilisent Jest via Create React App.

## API principale

- `GET /api/health` : état de l’API.
- `GET /api/reports` : signalements locaux interprétables.
- `GET /api/reports?number=06...` : recherche normalisée et fréquence des signalements.
- `POST /api/reports` : ajout d’un numéro français valide, d’une catégorie et d’un commentaire de 3 à 500 caractères.
- `GET /api/prefixes/:numero` (alias conservé : `/api/prefix/:numero`) : correspondance dans le jeu de préfixes local.
- `GET /api/stats`, `GET /api/repliques`, `GET /api/export-csv`.
- `POST /api/analyse` : résumé local indicatif ; aucune IA, catégorie automatique ou évaluation de risque n’est utilisée.

## Données et limites connues

`backend/src/data/reports.json` contient des éléments historiques hétérogènes. Les routes lisent les signalements structurés et ceux encodés en JSON dans l’ancien champ `query` ; les éléments non interprétables sont conservés dans le fichier et ignorés des recherches, statistiques et exports. Les nouvelles soumissions sont ajoutées avec un identifiant, un numéro E.164, une catégorie, un commentaire et une date. Aucun nettoyage automatique ne réécrit l’historique.

Le fichier de préfixes est un jeu local partiel fourni avec le projet ; l’absence de correspondance ne signifie pas qu’un numéro est sûr ou invalide. Le MVP n’a pas de compte utilisateur, de vote, de géolocalisation ni de stockage transactionnel partagé entre plusieurs processus. La limitation de soumissions est en mémoire et par adresse IP.
