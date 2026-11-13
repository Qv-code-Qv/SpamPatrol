# SpamPatrol

SpamPatrol est un outil indépendant d’information et d’observation de la numérotation téléphonique française, fondé principalement sur les données officielles ARCEP/MAJNUM. Il permet de consulter les informations disponibles sur les ressources de numérotation. Il n’identifie pas l’utilisateur final d’un numéro et n’est pas affilié ni cautionné par l’ARCEP.

Le frontend utilise React et le backend Node.js/Express. Les référentiels locaux sont conservés sous forme de fichiers JSON et de ressources ARCEP importées. SpamPatrol ne collecte pas de signalements, commentaires, votes ou données communautaires.

## Installation et démarrage

Prérequis : Node.js 18 ou plus récent et npm. Depuis la racine du dépôt :

```sh
npm run install:all
npm start
```

`npm start` lance l’API sur `http://localhost:4000` et le frontend sur `http://localhost:3000`. Pour démarrer séparément : `npm run start:back` ou `npm run start:front`.

Variables facultatives :

- `PORT` : port du backend (4000 par défaut).
- `FRONTEND_ORIGIN` : origines frontend autorisées, séparées par des virgules.
- `REACT_APP_API_URL` : URL de l’API, par défaut `http://localhost:4000/api`.

## Tests et build

```sh
npm test
npm run build:front
```

Les tests backend utilisent `node:test`. Les tests frontend utilisent Jest via Create React App.

## API

- `GET /api/health` : état de l’API.
- `GET /api/arcep/lookup/:numero` : recherche dans l’index officiel MAJNUM.
- `GET /api/prefixes/:numero` et `GET /api/prefix/:numero` : consultation du jeu local de préfixes, distinct des ressources officielles MAJNUM.

## Sources et limites

Les données ARCEP/MAJNUM et leurs dates de mise à jour sont décrites dans [docs/ARCEP.md](docs/ARCEP.md). Une attribution de tranche ne permet pas d’identifier le titulaire ni de garantir l’opérateur actuel après portabilité. Une absence de correspondance dans les données locales n’indique pas qu’un numéro est sûr ou invalide.

Les statistiques de consultation propres à SpamPatrol sont envisagées dans la roadmap, mais ne sont pas implémentées. Aucun classement ou chiffre de consultation ne doit être présenté comme une statistique fournie par l’ARCEP.
