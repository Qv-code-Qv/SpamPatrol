# État du développement

## Orientation actuelle

SpamPatrol devient un outil indépendant d’information et d’observation de la numérotation téléphonique française, fondé principalement sur les sources officielles ARCEP/MAJNUM. Le cahier des charges de référence est `cahier_des_charges.docx`. Le PDF historique est conservé comme archive et n’est plus la référence fonctionnelle.

Le code n’est pas encore aligné sur cette orientation : il contient toujours des fonctionnalités communautaires héritées. Elles sont abandonnées dans la vision du projet et doivent être retirées dans une étape technique. Aucune fonction communautaire ne doit être considérée comme une fonctionnalité future.

## Socle technique existant

- Frontend React avec React-Bootstrap et le template Light Bootstrap Dashboard React.
- Backend Node.js/Express et routes REST.
- Données locales au format JSON, dont les sources officielles importées et indexées sous `backend/src/data/arcep`.
- Recherche ARCEP/MAJNUM avec provenance, dates disponibles et avertissements sur les limites d’attribution.
- Script d’actualisation ARCEP et tests API associés déjà présents dans le dépôt.
- Statistiques de consultation prévues : elles ne sont pas encore implémentées et ne doivent compter que les recherches reconnues par MAJNUM.

## Fonctionnalités héritées encore présentes dans le code

Le MVP précédent comprend des routes d’ajout et de consultation des signalements, commentaires, statistiques communautaires, export CSV et écrans associés. Ces fonctions ne font plus partie du produit cible. Leur présence est un écart à corriger, pas une proposition de roadmap. Le comportement exact doit être vérifié pendant le travail de retrait.

## Données historiques à préserver pour le moment

`backend/src/data/reports.json` et les données qui s’y trouvent ne doivent pas être modifiés ni supprimés dans le cadre de cette mise à jour documentaire. Une étape technique distincte doit inventorier les copies, sauvegardes et historiques Git, décider de leur traitement, puis documenter toute suppression. Le retrait des fonctionnalités et celui des données doivent être séparés.

## Prochaines étapes techniques

1. Retirer côté backend les routes de soumission, recherche, statistiques et export communautaires.
2. Retirer les appels, formulaires, tableaux, boutons, éléments de navigation et tests propres à ces fonctionnalités du frontend, en préservant le thème et la navigation utiles.
3. Recentrer le tableau de bord sur les données officielles disponibles ; afficher l’indisponibilité plutôt que d’inventer des indicateurs.
4. Définir les critères qui rendent une ressource admissible aux statistiques exactes, les catégories/plages exclues, les seuils de publication et les regroupements de repli. Aucun classement exact avant cette décision.
5. Concevoir un stockage JSON séparé ne contenant que des compteurs agrégés par ressource ou tranche et période. N’enregistrer ni événement individuel, identité, adresse IP, identifiant de session, ni journal contenant le numéro recherché. Un hachage ne suffit pas.
6. Tester que seules les recherches résolues dans MAJNUM sont comptées, que les absences ne le sont pas, que les compteurs n’incluent aucune donnée de visiteur, et que les statistiques sont identifiées comme propres à SpamPatrol.
7. Tester la recherche officielle, la provenance, les erreurs, les résultats absents, l’absence de persistance de la saisie et l’absence de routes communautaires.
8. Faire l’inventaire séparé des données historiques et prendre une décision explicite avant toute suppression.

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
