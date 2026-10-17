# État du développement

## MVP implémenté

- API de santé, validation des signalements et normalisation des numéros français.
- Recherche des signalements et de leurs commentaires par numéro.
- Consultation des préfixes présents dans le fichier local.
- Écriture JSON atomique et sérialisée dans une instance backend, sans réécriture de l’historique lors d’une soumission.
- Tableau de bord alimenté par les statistiques réelles disponibles, signalements, formulaire de contribution et export CSV dans l’interface React.
- Répliques locales, états de chargement/erreur/vide et analyse explicitement signalée comme simulation.
- Tests API avec `node:test` et tests du client API avec Jest.

## Hors périmètre actuel

Comptes, historique personnel, liste noire, votes communautaires, filtrage avancé, géolocalisation et carte, base de données et API publique avec authentification. La source des préfixes reste partielle et doit être vérifiée/actualisée par une source officielle avant tout usage de production.

## Commandes

- `npm run install:all` : installer les dépendances racine, backend et frontend.
- `npm start` : lancer les deux applications après installation.
- `npm test` : lancer les tests backend et frontend.
- `npm run build:front` : construire le frontend de production.
