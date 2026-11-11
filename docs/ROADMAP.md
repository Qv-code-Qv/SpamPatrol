# Feuille de route SpamPatrol

## Identité du projet

SpamPatrol est un outil indépendant d’information sur la numérotation téléphonique française, fondé principalement sur les données officielles afin de mieux comprendre les informations associées aux numéros. Il privilégie les sources ARCEP/MAJNUM, la traçabilité, la protection des personnes physiques et une maintenance simple. Il n’est ni affilié ni cautionné par l’ARCEP.

Le cahier des charges de référence est `cahier_des_charges.docx`. Le PDF historique est conservé comme archive et n’est plus la référence fonctionnelle. Le code actuel contient encore des fonctionnalités communautaires héritées ; leur présence ne fait pas partie de la cible et elles doivent être retirées dans une étape technique dédiée. Les données historiques ne doivent pas être modifiées durant cette étape documentaire.

## Priorités de développement

1. **Retirer les fonctions communautaires héritées** des routes, écrans, menus et services frontend, sans modifier les fichiers de données historiques.
2. **Fiabiliser la recherche officielle** : validation et normalisation du numéro, résultat MAJNUM avec provenance et date, messages clairs pour les absences et erreurs. Ne conserver ni la saisie, ni un journal permettant de retrouver le numéro.
3. **Définir les règles de confidentialité des statistiques de consultation** : critères d’éligibilité des numéros exacts, catégories/plages exclues, seuils de publication et agrégations de repli. Tant que ces règles ne sont pas décidées, ne pas publier de classement exact.
4. **Ajouter les compteurs de consultation** après une correspondance ARCEP/MAJNUM, sans historique événementiel ni données de visiteur. Stocker uniquement des agrégats dans un JSON dédié, distinct des référentiels et données historiques.
5. **Recentrer le tableau de bord** sur les indicateurs officiels réellement calculables et les consultations observées par SpamPatrol, avec distinction explicite entre ces deux sources.
6. **Tester** les routes officielles, l’exclusion des recherches non reconnues, l’absence de conservation individuelle ou de journal de numéros, les seuils de publication et l’absence de routes communautaires.
7. **Inventorier séparément les données historiques et leurs copies**, puis décider et documenter leur traitement avant toute suppression. Ne pas modifier `reports.json` avant cette décision.

## Fonctionnalités conservées ou à fiabiliser

- Recherche des ressources de numérotation officielles et affichage des informations disponibles.
- Tableau de bord d’observation des référentiels officiels, sans statistique inventée.
- Statistiques de consultation propres à SpamPatrol, comptées uniquement après une correspondance officielle et publiées selon une règle de confidentialité validée.
- Traçabilité des sources, des imports et des dates de mise à jour.
- Informations pédagogiques sur la numérotation française et les limites des données ARCEP.
- Stack React, Node.js/Express, API REST et fichiers JSON tant qu’ils restent adaptés.

## Fonctionnalité future envisagée

Un assistant IA pédagogique pourra être étudié plus tard pour expliquer les données officielles. Il n’est pas une dépendance du MVP, ne doit pas être développé maintenant et ne pourra ni inventer des attributions, ni identifier un titulaire, ni qualifier un numéro de frauduleux.

## Statistiques de consultation

Les recherches non reconnues dans MAJNUM sont exclues. Les recherches reconnues peuvent incrémenter des compteurs agrégés par numéro admissible, tranche, nature de numérotation et période. Aucun historique individuel, identifiant, adresse IP ou journal contenant les numéros ne doit être conservé ; un hachage n’est pas une anonymisation suffisante. Ces métriques sont celles des consultations du site, jamais des statistiques de l’ARCEP.

La présence dans une plage ARCEP ne prouve pas qu’un numéro exact est public ou ne concerne pas une personne physique. Définir avant publication les critères d’éligibilité des numéros exacts, les catégories/plages exclues et les protections contre les faibles volumes. À défaut, ne publier que des agrégats par tranche/nature, éventuellement généralisés ou masqués selon des seuils à décider.

## Fonctionnalités abandonnées

Les signalements communautaires, formulaires et commentaires, recherches ou classements fondés sur des signalements, votes, listes noires, export CSV communautaire, statistiques de signalements, comptes liés à ces fonctions et modération communautaire sont abandonnés. Leur réintroduction n’est pas prévue dans cette roadmap.

## Périmètre de maintenance

Le projet reste géré par une seule personne. Ne pas introduire de base SQL ou de système complexe sans besoin démontré. Toute suppression des anciennes données doit faire l’objet d’une décision et d’une intervention séparées après inventaire des copies et sauvegardes.
