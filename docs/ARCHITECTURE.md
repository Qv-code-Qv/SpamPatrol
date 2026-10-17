# Architecture de SpamPatrol

## Vue d’ensemble

- **Frontend** : React 19, React Router 5 et React-Bootstrap, basé sur le template Light Bootstrap Dashboard déjà présent. Les pages produit réutilisent les `Container`, `Row`, `Col`, `Card`, formulaires, tables et couleurs du thème.
- **Backend** : Node.js 18+ et Express 5. `src/app.js` construit l’application pour le serveur et les tests ; `src/server.js` charge `.env` et démarre le listener HTTP.
- **Persistance** : fichiers JSON sous `backend/src/data`. L’ajout de signalements sérialise les écritures en mémoire dans le processus courant et remplace le fichier par renommage atomique.

## Flux de données

Le frontend utilise `frontend/src/services/api.js`. L’API est configurée par `REACT_APP_API_URL` (valeur locale par défaut `http://localhost:4000/api`). Express limite le JSON entrant à 16 Ko, applique Helmet et autorise par défaut les origines localhost du serveur React. En déploiement, `FRONTEND_ORIGIN` permet de définir la liste exacte d’origines autorisées.

Le format d’un nouveau signalement est `{ id, number, category, comment, date }`. Le numéro est validé avec les métadonnées locales de `libphonenumber-js` puis stocké en E.164 ; le commentaire doit contenir entre 3 et 500 caractères. Les catégories acceptées sont `Spam`, `Démarchage`, `Sondage`, `Arnaque` et `Fraude`. Cette validation vérifie le format, pas la véracité du signalement.

`reports.json` contient des exemples historiques non uniformes et non vérifiés. La couche `reportSchema.js` normalise les objets reconnus en lecture sans modifier le fichier source. Le GraphQL d’introspection et les autres éléments non interprétables restent conservés mais ne sont pas exposés comme signalements. Les nouvelles données sont ajoutées au tableau original. Les compteurs sont des agrégats du jeu local, pas des mesures réelles de fréquence ou de risque.

## Routes

| Route | Fonction |
|---|---|
| `GET /api/health` | Vérification du serveur |
| `GET /api/reports` | Liste des signalements interprétables |
| `GET /api/reports?number=...` | Recherche exacte normalisée et fréquence |
| `POST /api/reports` | Validation et ajout d’un signalement |
| `GET /api/prefixes/:numero` | Recherche dans le jeu local (alias `/api/prefix/:numero`) |
| `GET /api/stats` | Totaux, catégories et top 10 des numéros |
| `GET /api/repliques` | Répliques disponibles dans le fichier local |
| `GET /api/export-csv` | Export UTF-8 avec BOM, séparateur point-virgule |
| `POST /api/analyse` | Résumé indicatif simulé, sans classification ni score |

## Limites de conception du MVP

- Les fichiers JSON ne fournissent pas de transaction multi-processus, de sauvegarde ou de stockage distribué. Le verrouillage des écritures ne concerne que l’instance Node en cours.
- La limitation des soumissions est mémoire et par IP ; elle n’est pas un mécanisme d’authentification.
- Le jeu de préfixes fourni est partiel. Une absence de correspondance ne permet aucune conclusion sur la fiabilité d’un appel.
- Les données ne contiennent pas de localisation validée ; aucune carte de zones n’est affichée.
- L’analyse ne contacte aucun service d’IA et ne produit pas de score de risque.
