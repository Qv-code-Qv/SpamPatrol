# Données officielles de numérotation ARCEP

SpamPatrol utilise les jeux produits par l’ARCEP pour enrichir la recherche des numéros. Ces données officielles sont séparées des signalements communautaires, qui restent dans `backend/src/data/reports.json`.

## Sources et réutilisation

- **MAJNUM** : [jeu Ressources en numérotation téléphonique](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/MAJNUM.csv`.
- **Identifiants CE** : [jeu Identifiants de communications électroniques](https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/identifiants_CE.csv`.
- Formats annoncés : CSV complet, séparateur `;`, encodage ANSI. Les spécifications officielles sont [MAJNUM et fichiers de numérotation](https://extranet.arcep.fr/uploads/spec_export_num_arcep.pdf) et [Identifiants CE](https://extranet.arcep.fr/uploads/spec_fichier_identifiants_CE.pdf).
- Licence affichée sur les deux fiches : **Licence Ouverte / Open Licence** (les fiches ne précisent pas la version). Les règles officielles de réutilisation autorisent la copie, l’adaptation et la redistribution, sous réserve de citer le producteur/la source et la date de dernière mise à jour, et de ne pas faire croire à une publication officielle ou à un cautionnement ARCEP. Voir [Licence Ouverte 2.0 (Etalab)](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0). La provenance, les URL, les dates de publication ARCEP, les empreintes SHA-256 et l’horodatage local d’import sont consignés dans `backend/src/data/arcep/metadata.json`.

Mention d’attribution recommandée : « Source : ARCEP, MAJNUM et Identifiants CE, via data.gouv.fr, consultés le [date d’import]. » SpamPatrol est indépendant de l’ARCEP et ne bénéficie d’aucun cautionnement de sa part.

## Mise à jour manuelle

Depuis la racine du dépôt :

```sh
npm run arcep:update
```

Le script n’accepte que des URL HTTPS sur `extranet.arcep.fr`, applique un délai maximal de 30 secondes et une limite de taille par fichier, vérifie les colonnes, le format et les incohérences, calcule SHA-256, puis publie l’index et les métadonnées. Il utilise des instantanés nommés par empreinte sous `raw/` (jamais modifiés) et des index versionnés sous `processed/`. `metadata.json` est le pointeur actif, écrit en dernier : les requêtes voient donc l’ancienne version tant que la nouvelle paire de sources et son index n’ont pas tous été validés. Des fichiers orphelins en cas d’échec restent inactifs et peuvent être conservés pour diagnostic.

Les deux sources étant des exports complets, une exécution hebdomadaire est raisonnable ; l’ARCEP indique que MAJNUM est mis à jour après les réunions de son collège, et que le référentiel CE est hebdomadaire. Le script ne remplace rien si les SHA-256 n’ont pas changé.

## Limites

MAJNUM décrit des droits réglementaires d’utilisation de tranches, pas l’utilisateur final auquel un numéro a été affecté. Le référentiel CE n’est lié qu’en égalité exacte du code attributaire, sans rapprochement approximatif. Ces fichiers n’identifient pas l’opérateur actuel d’un numéro porté et ne fournissent aucun indicateur de spam ou de fraude. Une absence de correspondance signifie uniquement que les données importées ne permettent pas d’identifier une attribution.

La recherche affiche les données ARCEP séparément des signalements communautaires. Les fichiers locaux préexistants `prefixes.json`, `reports.json` et `repliques.json` ne sont ni remplacés ni nettoyés par la mise à jour.
