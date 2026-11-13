# Données officielles de numérotation ARCEP

SpamPatrol utilise les jeux produits par l'ARCEP pour rechercher et observer les ressources de numérotation. Les fonctionnalités communautaires et leurs fichiers de données ont été retirés de la branche actuelle. Leurs anciennes versions peuvent subsister dans l'historique Git, les sauvegardes externes ou d'autres clones.

## Sources et réutilisation

- **MAJNUM** : [jeu Ressources en numérotation téléphonique](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/MAJNUM.csv`.
- **Identifiants CE** : [jeu Identifiants de communications électroniques](https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/identifiants_CE.csv`.
- Formats annoncés : CSV complet, séparateur `;`, encodage ANSI. Les spécifications officielles sont [MAJNUM et fichiers de numérotation](https://extranet.arcep.fr/uploads/spec_export_num_arcep.pdf) et [Identifiants CE](https://extranet.arcep.fr/uploads/spec_fichier_identifiants_CE.pdf).
- Licence affichée sur les deux fiches : **Licence Ouverte / Open Licence** (les fiches ne précisent pas la version). Les règles officielles de réutilisation permettent la copie, l’adaptation et la redistribution sous réserve notamment d’attribuer la source ARCEP et de mentionner la date ou version des données utilisées. Toute transformation d’un fichier doit être signalée. La présentation ne doit pas induire en erreur sur la source, le contenu ou la date des données, ni laisser croire à une publication officielle ou à un cautionnement de l’ARCEP. Ces indications résument les conditions de réutilisation et ne constituent pas un avis juridique personnalisé. Voir [Licence Ouverte 2.0 (Etalab)](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0). La provenance, les URL, les dates de publication ARCEP, les empreintes SHA-256 et l’horodatage local d’import sont consignés dans `backend/src/data/arcep/metadata.json`.

Mention d’attribution recommandée : « Source : ARCEP, MAJNUM et Identifiants CE, via data.gouv.fr ; version/date des données : [à préciser] ; transformation : [à préciser le cas échéant]. » SpamPatrol est indépendant de l’ARCEP et ne bénéficie d’aucun cautionnement de sa part.

## Mise à jour manuelle

Depuis la racine du dépôt :

```sh
npm run arcep:update
```

Le script n’accepte que des URL HTTPS sur `extranet.arcep.fr`, applique un délai maximal de 30 secondes et une limite de taille par fichier, vérifie les colonnes, le format et les incohérences, calcule SHA-256, puis publie l’index et les métadonnées. Il utilise des instantanés nommés par empreinte sous `raw/` (jamais modifiés) et des index versionnés sous `processed/`. `metadata.json` est le pointeur actif, écrit en dernier : les requêtes voient donc l’ancienne version tant que la nouvelle paire de sources et son index n’ont pas tous été validés. Des fichiers orphelins en cas d’échec restent inactifs et peuvent être conservés pour diagnostic.

Les deux sources étant des exports complets, une exécution hebdomadaire est raisonnable ; l’ARCEP indique que MAJNUM est mis à jour après les réunions de son collège, et que le référentiel CE est hebdomadaire. Le script ne remplace rien si les SHA-256 n’ont pas changé.

## Limites

MAJNUM décrit des droits réglementaires d’utilisation de tranches, pas l’utilisateur final auquel un numéro a été affecté. Le référentiel CE n’est lié qu’en égalité exacte du code attributaire, sans rapprochement approximatif. Ces fichiers n’identifient pas l’opérateur actuel d’un numéro porté et ne fournissent aucun indicateur de spam ou de fraude. Les fichiers réglementaires de l’ARCEP sont des synthèses de décisions ; ils ne doivent pas être utilisés directement pour des opérations de routage ou des décisions de portabilité sans vérification auprès des acteurs compétents. Une absence de correspondance signifie uniquement que les données importées ne permettent pas d’identifier une attribution.

La recherche publique doit afficher uniquement les informations de numérotation des référentiels retenus et ne doit pas conserver la saisie dans un historique ou une base. Le jeu local `prefixes.json` reste distinct des ressources officielles et n’est pas remplacé par la mise à jour ARCEP.
