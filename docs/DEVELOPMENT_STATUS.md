# État du développement

## Orientation actuelle

SpamPatrol est un outil indépendant d’information et d’observation de la numérotation téléphonique française, fondé principalement sur les sources officielles ARCEP/MAJNUM. Le cahier des charges de référence est `cahier_des_charges.docx`. Le PDF historique est conservé comme archive et n’est plus la référence fonctionnelle.

Le code actif est recentré sur les recherches officielles et les préfixes locaux. Les fonctionnalités communautaires et leurs fichiers de données ont été retirés de la branche actuelle. Les anciens commits Git peuvent toujours contenir leurs versions ; l’historique n’a pas été réécrit. Aucune fonction communautaire ne doit être considérée comme une fonctionnalité future.

## Socle technique existant

- Frontend React avec React-Bootstrap et le template Light Bootstrap Dashboard React.
- Backend Node.js/Express et routes REST.
- Données locales au format JSON, dont les sources officielles importées et indexées sous `backend/src/data/arcep`.
- Recherche ARCEP/MAJNUM avec provenance, dates disponibles et avertissements sur les limites d’attribution.
- Tableau de bord recentré sur l’observation des référentiels officiels disponibles ; il ne présente pas de statistiques inventées.
- Script d’actualisation ARCEP et tests API associés déjà présents dans le dépôt.
- Statistiques de consultation prévues : elles ne sont pas encore implémentées et ne doivent compter que les recherches reconnues par MAJNUM.

## Données communautaires historiques

Les fichiers communautaires ont été supprimés de la branche actuelle selon la décision du projet. Cette action ne retire pas les versions conservées dans l’historique Git, les sauvegardes externes ou d’autres clones. Leur éventuel traitement dans ces emplacements est distinct.

## Prochaines étapes techniques

1. Définir les critères qui rendent une ressource admissible aux statistiques exactes, les catégories/plages exclues, les seuils de publication et les regroupements de repli. Aucun classement exact avant cette décision.
2. Concevoir un stockage JSON séparé ne contenant que des compteurs agrégés par ressource ou tranche et période. N’enregistrer ni événement individuel, identité, adresse IP, identifiant de session, ni journal contenant le numéro recherché. Un hachage ne suffit pas.
3. Implémenter et tester les compteurs uniquement après validation des règles de confidentialité et de publication.
4. Tester la recherche officielle, la provenance, les erreurs, les résultats absents et l’absence de persistance de la saisie.


## Statistiques de consultation envisagées

La fonctionnalité est spécifiée mais non implémentée. Elle pourra fournir un total de recherches reconnues, une répartition par nature de numérotation, une évolution temporelle à partir de compteurs agrégés et un classement exact uniquement pour les ressources satisfaisant une politique de confidentialité validée. Une présence dans une tranche ARCEP ne suffit pas à rendre un numéro exact publiable. À défaut de critères sûrs, se limiter aux agrégats par tranche/nature et masquer les groupes trop petits selon des seuils à décider.

Les valeurs devront être libellées comme des consultations enregistrées par SpamPatrol, jamais comme des statistiques de l’ARCEP. Aucune recherche sans correspondance MAJNUM ne doit être comptée. Les compteurs n’incluront ni identifiant de visiteur ni adresse IP et ne seront pas associés à un journal individuel.

## Fonctionnalité future envisagée

Un assistant IA pédagogique peut être étudié après stabilisation du cœur officiel. Il n’est pas à développer maintenant, ne doit pas être une dépendance du MVP et ne doit jamais inventer des attributions, identifier un titulaire ou déclarer un numéro frauduleux.

## Commandes existantes

- `npm run install:all` : installer les dépendances racine, backend et frontend.
- `npm start` : lancer les deux applications après installation.
- `npm test` : lancer les tests backend et frontend.
- `npm run build:front` : construire le frontend de production.
