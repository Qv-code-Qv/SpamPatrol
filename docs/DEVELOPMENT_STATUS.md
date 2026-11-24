# État du développement

## Orientation

SpamPatrol est un outil indépendant d’information, d’observation et de compréhension de la numérotation téléphonique française. Il privilégie les données officielles ARCEP/MAJNUM et doit rester simple à maintenir. Le cahier des charges de référence est `cahier_des_charges.docx`; le PDF est une archive historique.

Le Dashboard évolue progressivement en observatoire pédagogique. Le résumé de l’instantané et les répartitions par territoire déclaré et code d’attribution sont livrés et testés; les cohortes par date d’effet restent à développer. Les fonctionnalités communautaires et leurs fichiers ont été retirés du code actif; aucune fonction communautaire ne fait partie de la roadmap actuelle.

## Fonctionnalités présentes dans le code

- Frontend React avec React-Bootstrap et le template Light Bootstrap Dashboard.
- Backend JavaScript, Node.js et Express avec les routes de recherche et de santé de l’API.
- Recherche ARCEP/MAJNUM avec provenance, dates disponibles et avertissements sur les limites d’attribution.
- Consultation séparée d’un jeu local de 17 préfixes, dont la provenance externe et la date ne sont pas documentées dans le fichier local.
- Import manuel des sources ARCEP, création d’un index JSON versionné par empreintes et métadonnées de provenance.
- Dashboard présentant le total des ressources recensées et des répartitions en barres par territoire déclaré et code d’attribution, alimentés par `GET /api/arcep/summary`. Les deux graphiques sont côte à côte sur grand écran et s’empilent sur écran plus étroit; les cartes descriptives suivent une grille de trois colonnes sur grand écran et deux sur tablette. Le résumé est calculé côté serveur et comparé aux comptes de référence, sans transfert de l’index. Les agrégats préservent les valeurs exactes, distinguent les codes absents, vides et invalides, calculent les parts sur le total et vérifient la cohérence des effectifs. L’index local contient 424 codes d’attribution distincts; les dix groupes les plus nombreux sont affichés et les autres restent disponibles dans une liste repliable, sans regroupement. L’interface affiche la source officielle, la date de publication, le total, les effectifs et les parts, avec de brèves limites d’interprétation. Les détails de calcul et de version restent internes; aucun indicateur par date, classification, historique ou statistique de consultation n’est affiché.

## Données locales constatées

L’instantané présent dans `backend/src/data/arcep` est publié au 2026-10-19 selon ses métadonnées, et activé localement le 2026-10-19 à 15:35 UTC. Il contient 20 931 enregistrements MAJNUM et 1 598 entrées Identifiants CE. Les champs de l’index comprennent les bornes, le code attributaire, le nom rapproché, le territoire, la date d’attribution et la ressource. Le jeu de préfixes local comprend 17 entrées.

Une seule génération traitée est actuellement présente. Les métadonnées `activatedAt` ne constituent pas une date de dernière synchronisation. Au contrôle documentaire du 2026-11-24, la page Extranet ARCEP indiquait MAJNUM modifié le 2026-11-23. Le contenu de cette publication n’a pas été téléchargé ni comparé à l’instantané local; la synchronisation actuelle n’est donc pas confirmée.

## Vérifications présentes dans le dépôt

- Les tests ARCEP vérifient le parseur CSV, le rapprochement exact des codes, les bornes de plages, les empreintes des sources locales, la cohérence des comptes de l’index actif et la route de synthèse (compte, métadonnées, absence de transfert de l’index, distributions territoriale et par code, valeurs distinctes/inconnues/absentes/vides/invalides, parts et cohérence des totaux).
- Les tests API couvrent les recherches, les absences, les erreurs, la distinction entre MAJNUM et préfixes locaux, et l’absence de persistance ou de journalisation applicative du numéro dans les cas testés.
- Les tests Dashboard et client API vérifient le résumé et les graphiques reçus de l’API, les codes bruts et libellés territoriaux distincts, effectifs et parts, la liste repliable des codes minoritaires, la source et la date de publication, l’absence de détails techniques, les limites d’interprétation, les états d’indisponibilité/erreur et l’absence de contenu communautaire ou de statistiques inventées.

Au contrôle du 2026-11-24, les tests backend passent (13/13) et les tests frontend passent (20/20). Le build frontend réussit avec des avertissements de données Browserslist anciennes et de propriété CSS dépréciée. Ces tests ne valident pas les futurs agrégats par date d’effet, une classification réglementaire, la synchronisation avec les fichiers en ligne ni les journaux d’un serveur proxy ou de l’hébergeur.

## En cours de spécification, non implémenté

1. Phase 1 reste en cours : le total, son résumé de provenance et les répartitions par territoire et code d’attribution sont implémentés et testés. Restent à définir, calculer et tester les cohortes de dates d’effet.
2. Les cohortes par date d’effet et les visualisations suivantes attendent la définition et la validation de leurs agrégats.
3. Classification officielle et versionnée des catégories, absente comme champ de l’index actuel.
4. Sources supplémentaires possibles : ressources gelées, portabilité, numéros courts ou informations SVA. Leur pertinence et leur maintenance restent à étudier.
5. Comparaisons historiques, impossibles à calculer avec l’unique génération actuellement présente.

## Fonctionnalités reportées

Les statistiques de consultation SpamPatrol ne sont pas implémentées ni autorisées par la présente mise à jour documentaire. Elles restent facultatives et séparées des données officielles. Toute décision sur l’éligibilité, les exclusions, les répétitions, les périodes, les seuils et les agrégats de repli doit précéder l’implémentation. Aucun historique individuel, numéro exact, forme normalisée, hash, IP ou identifiant de visiteur ne peut être stocké pour cette fonction.

L’assistant IA reste une idée future facultative, hors du périmètre immédiat.

## Prochaines étapes

1. Terminer la phase 1 sur les données déjà présentes : définir, calculer et tester les cohortes par date d’effet.
2. Faire vérifier ces cohortes avant leur éventuel affichage au Dashboard.
3. Poursuivre l’enrichissement du Dashboard uniquement avec des résultats vérifiés et leurs explications pédagogiques concises.
4. Étudier ensuite la classification officielle, puis les sources complémentaires.
5. Étudier l’historique après constitution d’instantanés comparables.

Chaque étape doit être terminée et son résultat vérifié avant de commencer la suivante. Les statistiques de consultation restent soumises à une décision de confidentialité indépendante.

## Commandes présentes

- `npm run install:all` : installer les dépendances racine, backend et frontend.
- `npm start` : lancer les deux applications après installation.
- `npm test` : lancer les tests backend et frontend.
- `npm run build:front` : construire le frontend de production.
