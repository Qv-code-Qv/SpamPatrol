# Données officielles de numérotation ARCEP

SpamPatrol utilise les jeux produits par l'ARCEP pour rechercher et observer les ressources de numérotation. Les fonctionnalités communautaires et leurs fichiers de données ont été retirés de la branche actuelle. Leurs anciennes versions peuvent subsister dans l'historique Git, les sauvegardes externes ou d'autres clones.

## Sources et réutilisation

- **MAJNUM** : [jeu Ressources en numérotation téléphonique](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/MAJNUM.csv`.
- **Identifiants CE** : [jeu Identifiants de communications électroniques](https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques), producteur ARCEP. Fichier directement publié par l’ARCEP : `https://extranet.arcep.fr/uploads/identifiants_CE.csv`.
- Formats annoncés : CSV complet, séparateur `;`, encodage ANSI. Les spécifications officielles sont [MAJNUM et fichiers de numérotation](https://extranet.arcep.fr/uploads/spec_export_num_arcep.pdf) et [Identifiants CE](https://extranet.arcep.fr/uploads/spec_fichier_identifiants_CE.pdf).
- Licence affichée sur les deux fiches : **Licence Ouverte / Open Licence** (les fiches ne précisent pas la version). Les règles officielles de réutilisation permettent la copie, l’adaptation et la redistribution sous réserve notamment d’attribuer la source ARCEP et de mentionner la date ou version des données utilisées. Toute transformation d’un fichier doit être signalée. La présentation ne doit pas induire en erreur sur la source, le contenu ou la date des données, ni laisser croire à une publication officielle ou à un cautionnement de l’ARCEP. Ces indications résument les conditions de réutilisation et ne constituent pas un avis juridique personnalisé. Voir [Licence Ouverte 2.0 (Etalab)](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0). La provenance, les URL, les dates de publication ARCEP, les empreintes SHA-256 et l’horodatage local d’import sont consignés dans `backend/src/data/arcep/metadata.json`.

Mention d’attribution recommandée : « Source : ARCEP, MAJNUM et Identifiants CE, via data.gouv.fr ; version/date des données : [à préciser] ; transformation : [à préciser le cas échéant]. » SpamPatrol est indépendant de l’ARCEP et ne bénéficie d’aucun cautionnement de sa part.

## Données présentes et leur signification

L’instantané actif du dépôt comprend deux sources brutes et un index JSON traité :

| Fichier local | Contenu constaté | Utilisation et limite |
|---|---|---|
| `raw/MAJNUM-6a785fffe98a612d7141eaa4f652f1befd4f7457a2fc69de510b12bb2325a166.csv` | 20 931 enregistrements; `EZABPQM`, `Tranche_Debut`, `Tranche_Fin`, `Mnémo`, `Territoire`, `Date_Attribution`; 1 161 791 octets. | La spécification définit `EZABPQM` comme la ressource, les deux bornes comme la tranche, `Mnémo` comme identifiant CE de l’attributaire, le territoire associé et la date d’effet de l’attribution. Ces lignes sont des ressources attribuées, pas des abonnés, appels ou usages observés. |
| `raw/identifiants_CE-e5644b3361d1142a4888121a879af309dd95ccf5cbec31aadbe92b90aa360988.csv` | 1 598 acteurs; 7 champs comprenant le code CE, le nom, SIRET, RCS, adresse complète et autres attributs; 174 140 octets. | Sert au rapprochement exact `Mnémo`/`CODE_OPERATEUR`; l’index n’utilise pour l’affichage que le nom associé au code. Le référentiel comprend des entités de plusieurs rôles : leur présence ne prouve pas le statut d’opérateur. |
| `processed/<génération>/index.json` | 20 931 objets; `start`, `end`, `allocationCode`, `entityName`, `territory`, `allocationDate`, `resource`; 3 641 925 octets. | Index de recherche généré à partir des deux fichiers. Aucun champ normalisé de catégorie, de disponibilité, d’usage observé, de numéro affecté à un client ou de volume d’appels n’y figure. |
| `metadata.json` | Génération, provenance, URL, licence, SHA-256, tailles, comptes de lignes, date de publication, date d’activation locale et limites. | `publishedDate` est la date de publication notée pour la source. `activatedAt` est l’activation locale de la génération; ce n’est pas la date de dernière vérification de l’URL ni une preuve de synchronisation avec la source courante. |

Le dépôt contient une seule génération traitée. Les empreintes permettent d’identifier l’instantané conservé; elles ne fournissent pas, sans comparaison à un autre export, un historique d’évolution.

Le jeu `backend/src/data/prefixes.json` est un fichier local distinct de MAJNUM. Il contient 17 entrées avec `prefixe`, `zone` et `nature`, mais n’enregistre pas sa source externe, sa date de référence ou la méthode derrière certains libellés « vérifié ». Ne pas le présenter comme une source ARCEP ni traiter ses libellés comme une classification réglementaire versionnée sans vérification documentaire.

## Fraîcheur de l’instantané local

Les métadonnées du dépôt indiquent une publication au 2026-10-19 et une activation locale le 2026-10-19 à 15:35 UTC. Le script d’import ne renseigne pas de date de dernière vérification lorsqu’il détecte une génération identique.

Au contrôle documentaire du 2026-11-24, la page Extranet de l’ARCEP indiquait MAJNUM modifié le 2026-11-23. Cette date est postérieure à celle de l’instantané local. Le fichier en ligne n’a pas été téléchargé ou comparé dans ce contrôle; les différences de contenu ne sont donc pas établies. Afficher la date de l’instantané local comme telle et ne pas la qualifier de « dernière synchronisation ». [Page de publication ARCEP](https://extranet.arcep.fr/communications-electroniques/numerotation)

## Sources officielles complémentaires à évaluer

L’Extranet ARCEP et data.gouv.fr publient plusieurs jeux séparés de MAJNUM. Ils ne sont pas intégrés à l’index actif du projet. Leur simple disponibilité ne vaut pas décision d’intégration.

| Jeu | Apport potentiel | Précaution |
|---|---|---|
| GELNUM | Ressources abrogées/gelées et date de libération prévue. | Ne suffit pas, à lui seul, à définir toutes les ressources disponibles ni leur statut à une date donnée. |
| MAJPORTA | Préfixes de routage utilisés pour la portabilité. | Ne révèle pas à lui seul l’opérateur actuel d’un numéro porté ou l’état individuel de portabilité. |
| MAJNFB | Numéros courts d’urgence ou à fonctionnalité banalisée. | Jeu spécifique; vérifier le périmètre avant de le rapprocher de la recherche actuelle. |
| MAJSDT, MAJRIO, MAJMNC, MAJR1R2, MAJCPSN et MAJCPSI | Autres préfixes et identifiants réglementaires ou techniques. | Ne sont pas nécessairement des numéros de téléphone recherchables par le flux actuel. Chaque source demande une justification et un traitement spécifique. |

Les exports MAJNUM sont complets et mis à jour par l’ARCEP après ses réunions de Collège; le référentiel Identifiants CE est annoncé comme mis à jour chaque semaine. Les sources doivent donc avoir leur fréquence suivie séparément. [Spécification ARCEP](https://extranet.arcep.fr/uploads/spec_export_num_arcep.pdf) [Identifiants CE](https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques)

Les catégories officielles, ressources attribuées, ressources gelées, numéros courts et tarifs SVA répondent à des questions distinctes. Une visualisation de catégorie nécessite une table de correspondance documentée avec les décisions et documents officiels applicables; une longueur ou un préfixe seul ne constitue pas toujours une catégorie réglementaire.

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
