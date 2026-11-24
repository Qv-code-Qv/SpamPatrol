# Architecture actuelle et cible de SpamPatrol

## Orientation de référence

SpamPatrol est un outil indépendant d’information, d’observation et de compréhension de la numérotation téléphonique française. Il privilégie les données officielles de l’ARCEP, notamment MAJNUM, et vise une maintenance simple par une seule personne. Le cahier des charges de référence est `cahier_des_charges.docx`; le PDF conservé est une archive historique.

Le Dashboard actif est actuellement une page informative statique : il ne charge pas de données, ne calcule pas d’indicateurs et ne rend aucun graphique. La page de recherche consulte séparément MAJNUM et le jeu local de préfixes. Aucun endpoint de synthèse de l’observatoire, de statistique de consultation ou d’activité communautaire n’est actuellement implémenté.

Les fonctionnalités communautaires ont été retirées du code actif et ne font pas partie de la cible. Les statistiques de consultation restent facultatives et futures; elles sont distinctes des données officielles et ne peuvent être conçues qu’après validation des règles de confidentialité du cahier des charges.

## Stack et flux présents

- **Frontend** : React, React Router et React-Bootstrap avec le template Light Bootstrap Dashboard React.
- **Backend** : JavaScript, Node.js et Express avec une API REST.
- **Données** : fichiers JSON locaux; aucun stockage SQL n’est prévu pour le périmètre actuel.
- **Client API** : `frontend/src/services/api.js`, configuré par `REACT_APP_API_URL` (par défaut `http://localhost:4000/api`).
- **Sécurité serveur** : Helmet, limite JSON de 16 Ko, CORS configuré et journal Morgan qui exclut volontairement l’URL et l’adresse IP.
- **Graphiques** : Chartist et `react-chartist` figurent parmi les dépendances du template, mais aucun graphique n’est actuellement utilisé par le Dashboard routé.

Les routes actuelles comprennent `GET /api/arcep/lookup/:numero`, les recherches du jeu local `/api/prefix/:numero` et `/api/prefixes/:numero`, ainsi que `/api/health`. Les recherches valident et normalisent temporairement la saisie. La réponse ARCEP fournit la valeur normalisée au client, la tranche trouvée ou l’absence de correspondance, l’attributaire déclaré, le territoire, la date d’attribution, la source et les dates disponibles.

Le traitement de recherche ne crée aucun fichier ni historique. Les métadonnées officielles et l’index sont lus depuis `backend/src/data/arcep`. Le jeu local `backend/src/data/prefixes.json` est lu séparément et sa provenance externe n’est pas documentée dans ce fichier.

## Sources et structure locales

L’instantané actif contient MAJNUM et Identifiants CE. Le traitement transforme chaque ligne MAJNUM en un enregistrement comprenant `start`, `end`, `allocationCode`, `entityName`, `territory`, `allocationDate` et `resource`. Le rapprochement entre MAJNUM et Identifiants CE se fait par égalité exacte du code. Les champs bruts de MAJNUM ne comprennent pas de catégorie réglementaire normalisée, d’état de disponibilité, d’usage observé ou de mesure d’appels.

`metadata.json` décrit la génération, les sources, leurs empreintes, tailles, comptes de lignes, dates de publication, licence et limites. `activatedAt` indique l’activation locale de la génération; ce n’est ni la date de dernière vérification de la source ni une preuve de synchronisation en ligne. Une comparaison à la source actuelle nécessite un contrôle distinct.

Une seule génération traitée est présente actuellement dans le dépôt. Les empreintes permettent d’identifier les fichiers locaux, mais l’instantané unique ne permet pas une analyse d’évolution historique.

## Architecture cible du Dashboard

La première évolution doit calculer des indicateurs à partir des fichiers déjà présents : nombre d’enregistrements de ressources/tranches, codes attributaires distincts, agrégations par territoire et code, cohortes par date d’effet et affichage des métadonnées de l’instantané. Ces calculs ne sont pas encore exposés par une route et ne sont pas présents dans l’interface.

Avant de créer une API de synthèse, définir pour chaque indicateur l’unité, le périmètre, la méthode, la source et les limites. Le backend devrait agréger les données et retourner un objet compact, plutôt que transmettre tout l’index MAJNUM au navigateur. Les agrégations devront être déterministes et couvertes par des tests portant sur les unités et les cas limites.

Les répartitions par catégories officielles nécessitent une classification documentée et versionnée qui ne figure pas dans MAJNUM. Les analyses historiques nécessitent plusieurs instantanés datés et comparables. Les ressources gelées, les informations de portabilité et les numéros courts nécessitent l’étude et l’intégration contrôlée de sources officielles complémentaires.

## Exigences pédagogiques et de présentation

Chaque indicateur ou graphique devra présenter un titre, la question pédagogique, une explication accessible, une interprétation prudente, la méthode de calcul, l’unité, la source, la date de référence et les limites. Lorsque cela aide le visiteur, il devra renvoyer vers une définition plus complète ou la recherche.

Les nombres de lignes MAJNUM ne doivent jamais être présentés comme des nombres d’abonnés, de personnes, de lignes actives ou d’appels. Le territoire décrit la ressource et ne localise pas un appelant. Un attributaire déclaré ne prouve pas l’opérateur actuel après portabilité. Une date d’attribution ne remplace pas un historique de versions. Une absence dans MAJNUM ne prouve pas qu’une ressource est disponible.

Préserver le template, la navigation, les couleurs, la disposition et le responsive. Ne pas ajouter de dépendance graphique sans nécessité démontrée.

## Statistiques de consultation futures

Ces métriques seraient des mesures d’usage de SpamPatrol, jamais des statistiques de l’ARCEP. Aucun compteur, stockage ou endpoint n’existe. Toute proposition reste bloquée jusqu’à validation explicite des critères d’éligibilité, exclusions, périodes, seuils, agrégats de repli et protections contre les faibles volumes ou les recoupements.

Si elles sont autorisées, elles ne devront pas conserver le numéro recherché, sa forme normalisée, un hash, un événement individuel, une URL de recherche, une adresse IP, un identifiant de visiteur ou de session. Les recherches invalides, sans correspondance MAJNUM, locales uniquement ou en erreur seront exclues. La conception ne devra pas confondre une tranche attribuée avec un numéro utilisé ou un titulaire. Un fichier JSON distinct ne pourra stocker que des agrégats déjà validés; les écritures devront être sérialisées et sûres. Les limites de concurrence, sauvegarde et perte de compteurs devront être établies avant implémentation.

## Limites d’architecture

- Les fichiers JSON sont adaptés au périmètre simple actuel, mais n’apportent pas de transactions multi-processus ni de stockage distribué.
- L’index local peut être daté ou incomplet; son empreinte ne prouve pas qu’il correspond à la dernière version en ligne.
- Les fichiers réglementaires décrivent des droits d’utilisation, pas l’usage réel ni l’identité de l’utilisateur final.
- Les journaux du serveur applicatif ne couvrent pas nécessairement les journaux d’Apache, d’un proxy ou de l’hébergeur; la configuration de déploiement doit être vérifiée séparément.
- L’IA reste une idée facultative, hors du périmètre immédiat, et ne peut inventer des attributions ou qualifier un numéro de fraude.
- Aucune base SQL ne sera ajoutée sans besoin démontré et compatible avec la maintenance du projet.
