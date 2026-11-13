# Architecture actuelle et cible de SpamPatrol

## Orientation de référence

SpamPatrol est un outil indépendant d’information sur la numérotation téléphonique française, fondé principalement sur les données officielles ARCEP/MAJNUM. La recherche nécessite le traitement temporaire du numéro saisi ; celui-ci n’est pas conservé comme historique individuel. Il ne doit pas apparaître dans les journaux techniques, et aucune identité de visiteur ni adresse IP ne doit être associée à un historique ou à un compteur de recherche. Ces mesures ne signifient pas qu’aucun traitement de données personnelles n’a lieu au sens juridique. Le projet ne crée pas de base communautaire et ne publie aucune accusation sur un numéro ou son titulaire. Le cahier des charges de référence est `cahier_des_charges.docx` ; le PDF conservé est une archive historique.

Les fonctionnalités communautaires et leurs routes ont été retirées du code actif. Les fichiers de données communautaires ont également été supprimés de la branche actuelle ; leurs versions peuvent rester dans l’historique Git, qui n’a pas été réécrit.

## Stack et flux officiels

- **Frontend** : React, React Router et React-Bootstrap avec le template Light Bootstrap Dashboard React, à préserver.
- **Backend** : JavaScript, Node.js et Express avec API REST.
- **Données** : fichiers JSON locaux pour les index et métadonnées lorsque cela reste adapté.
- **Client API** : `frontend/src/services/api.js`, configuré par `REACT_APP_API_URL` (par défaut `http://localhost:4000/api`).
- **Sécurité serveur existante** : Helmet, limite JSON de 16 Ko et CORS configuré pour les origines locales ou `FRONTEND_ORIGIN`.

Les données officielles sont importées et indexées séparément sous `backend/src/data/arcep`. MAJNUM décrit des ressources et droits réglementaires d’utilisation de tranches ; il ne permet pas d’identifier l’utilisateur final. Les métadonnées et les références de sources doivent rester traçables.

## Recherche

La recherche valide et normalise le numéro français saisi, qui est nécessairement traité temporairement pour consulter les référentiels retenus. Il n’est pas conservé comme historique individuel dans un fichier ou une base et ne doit pas être inscrit dans les journaux techniques. Aucune identité de visiteur ni adresse IP ne doit être associée à l’historique ou aux compteurs de recherche. La réponse peut présenter la tranche, l’attributaire déclaré, le territoire et les dates disponibles, ainsi que la source.

Une attribution de tranche ne révèle pas l’utilisateur final et ne garantit pas l’opérateur actuel après portabilité. Une absence de correspondance dans l’index local ne prouve ni que le numéro n’existe pas, ni qu’il est fiable.

## Routes à conserver dans la cible

| Route | Fonction cible |
|---|---|
| `GET /api/health` | Vérification du serveur |
| `GET /api/arcep/lookup/:numero` | Recherche officielle MAJNUM avec provenance, date et limites |
| `GET /api/prefixes/:numero` et `GET /api/prefix/:numero` | Recherche dans le jeu local de préfixes ; sa provenance doit être clairement indiquée |
| `GET /api/search-stats` (évolution future ; aucun endpoint actuellement implémenté) | Agrégats de consultations SpamPatrol, après règles d’éligibilité et de confidentialité |

## Données communautaires historiques

Les fichiers de données communautaires ne sont plus présents dans la branche actuelle et ne font pas partie du modèle de données. Leurs versions peuvent subsister dans les commits historiques, les sauvegardes externes ou d’autres clones ; la suppression de la branche actuelle ne les efface pas de ces emplacements.

## Tableau de bord observatoire

Les indicateurs doivent provenir des référentiels officiels : volume de tranches, répartition par catégorie de ressource, territoire et attributaire selon les champs disponibles, date d’actualisation et évolution seulement si des instantanés historiques fiables existent. Chaque statistique précise sa source et son périmètre. Ne pas afficher de classement de numéros signalés et ne pas inventer de chiffres.

### Statistiques de consultation SpamPatrol

Ces métriques sont une mesure de l’usage du site, pas des statistiques ARCEP. Une consultation n’est admissible que si la recherche réussit et que le numéro correspond à une ressource reconnue dans l’index officiel MAJNUM. Les recherches invalides ou sans correspondance n’incrémentent aucun compteur. Les requêtes répétées peuvent incrémenter le compteur de la ressource à chaque consultation réussie.

Ne conserver que des compteurs agrégés, par période et par ressource admissible ou tranche/nature. Ne créer aucun événement individuel ni associer compteur, numéro ou période à une identité, une adresse IP, un identifiant de session ou autre donnée de visiteur. Ne pas produire de journal contenant le numéro recherché ; les routes de recherche et la journalisation HTTP devront être conçues ou configurées pour ne pas conserver les numéros dans les logs. Un hash du numéro n’est pas une anonymisation suffisante.

Un compteur associé à un numéro exact reste une donnée portant sur ce numéro. Une attribution MAJNUM ne prouve pas qu’il est public ou qu’il n’appartient pas à une personne physique. Le classement exact doit donc être bloqué jusqu’à la définition et la validation de critères d’éligibilité explicites, comprenant les catégories et plages exclues ainsi que des protections contre la divulgation par faibles volumes ou par recoupement. Si ces conditions ne sont pas remplies, n’afficher que des regroupements par tranche officielle ou nature de numérotation, avec généralisation ou suppression des petits groupes selon des seuils à décider.

Un fichier JSON dédié (par exemple `searchStats.json`) peut contenir les compteurs agrégés et les périodes, jamais les événements ou identifiants de visiteurs. Il doit rester séparé des index officiels et des données communautaires historiques. Les mises à jour doivent être sérialisées et sûres. Le volume attendu, le rythme d’écriture, la stratégie de sauvegarde et la tolérance à la perte de compteurs après arrêt restent à décider avant implémentation.

Visualisations envisagées après validation des règles : total de consultations reconnues, répartition par nature, évolution temporelle issue de compteurs agrégés et, uniquement pour les ressources admissibles, classement des numéros exacts. L’interface doit identifier ces valeurs comme des consultations observées par SpamPatrol.

## Limites de conception

- Les fichiers JSON restent simples à maintenir mais n’apportent pas de transactions multi-processus ni de stockage distribué.
- Le référentiel local peut être partiel ou daté ; une absence ne doit pas être interprétée comme une information de fiabilité.
- Les données ARCEP ne déterminent ni l’utilisateur final, ni l’usage du numéro, ni l’opérateur actuel après portabilité.
- L’IA est une idée future facultative, pas une dépendance du MVP. Elle ne devra pas inventer de faits ou de classifications.
- Ne pas ajouter de base SQL sans besoin démontré.
