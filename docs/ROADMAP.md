# Feuille de route SpamPatrol

## Identité du projet

SpamPatrol est un outil indépendant d’information sur la numérotation téléphonique française, fondé principalement sur les données officielles afin de mieux comprendre les informations associées aux numéros. Il privilégie les sources ARCEP/MAJNUM, la traçabilité, la protection des personnes physiques et une maintenance simple. Il n’est ni affilié ni cautionné par l’ARCEP.

Le cahier des charges de référence est `cahier_des_charges.docx`. Le PDF historique est conservé comme archive et n’est plus la référence fonctionnelle. Les fonctionnalités communautaires ont été retirées du code actif et leurs fichiers de données ont été supprimés de la branche actuelle. Les anciens commits Git peuvent encore contenir ces données ; l’historique n’est pas réécrit.

## Priorités de développement

1. **Fiabiliser la recherche officielle** : validation et normalisation du numéro, résultat MAJNUM avec provenance et date, messages clairs pour les absences et erreurs. Ne conserver ni la saisie, ni un journal permettant de retrouver le numéro.
2. **Définir les règles de confidentialité des statistiques de consultation** : critères d’éligibilité des numéros exacts, catégories/plages exclues, seuils de publication et agrégations de repli. Tant que ces règles ne sont pas décidées, ne pas publier de classement exact.
3. **Ajouter les compteurs de consultation** après une correspondance ARCEP/MAJNUM, sans historique événementiel ni données de visiteur. Stocker uniquement des agrégats dans un JSON dédié, distinct des référentiels officiels.
4. **Vérifier le tableau de bord** pour maintenir la distinction entre les indicateurs issus des référentiels officiels et les éventuelles consultations observées par SpamPatrol.
5. **Tester** les routes officielles, l’exclusion des recherches non reconnues, l’absence de conservation individuelle ou de journal de numéros et les règles de confidentialité décidées.

## Fonctionnalités présentes ou évolutions envisagées

- Recherche des ressources de numérotation officielles et affichage des informations disponibles.
- Tableau de bord actuel : observation des référentiels officiels, sans statistique inventée.
- Statistiques de consultation propres à SpamPatrol : fonctionnalité envisagée pour une étape ultérieure, non implémentée. Aucun endpoint de statistiques de consultation n’est actuellement disponible.
- Traçabilité des sources, des imports et des dates de mise à jour.
- Informations pédagogiques sur la numérotation française et les limites des données ARCEP.
- Stack React, Node.js/Express, API REST et fichiers JSON tant qu’ils restent adaptés.

## Fonctionnalité future envisagée

Un assistant IA pédagogique pourra être étudié plus tard pour expliquer les données officielles. Il n’est pas une dépendance du MVP, ne doit pas être développé maintenant et ne pourra ni inventer des attributions, ni identifier un titulaire, ni qualifier un numéro de frauduleux.

## Fonctionnalité ultérieure envisagée : statistiques de consultation

Cette fonctionnalité n’est pas implémentée et aucun endpoint de statistiques de consultation n’existe actuellement. Si elle est développée ultérieurement, seules les recherches reconnues dans MAJNUM pourront contribuer à des compteurs agrégés. Les compteurs envisagés seraient agrégés par ressource admissible, tranche ou nature de numérotation et période, sans historique individuel ni identité de visiteur ou adresse IP associée. Aucun journal contenant les numéros recherchés ne devrait être conservé ; un hachage n’est pas une anonymisation suffisante. Ces métriques sont celles des consultations du site, jamais des statistiques de l’ARCEP.

La présence dans une plage ARCEP ne prouve pas qu’un numéro exact est public ou ne concerne pas une personne physique. Les conditions de publication restent à définir avant toute implémentation ou publication : critères d’éligibilité des numéros exacts, catégories/plages exclues, protections contre les faibles volumes et seuils de confidentialité. À défaut, privilégier des agrégats par tranche/nature, éventuellement généralisés ou masqués selon des seuils à décider.

## Fonctionnalités abandonnées

Les signalements communautaires, formulaires et commentaires, recherches ou classements fondés sur des signalements, votes, listes noires, export CSV communautaire, statistiques de signalements, comptes liés à ces fonctions et modération communautaire sont abandonnés. Leur réintroduction n’est pas prévue dans cette roadmap.

## Périmètre de maintenance

Le projet reste géré par une seule personne. Ne pas introduire de base SQL ou de système complexe sans besoin démontré. Les données communautaires ont été retirées de la branche actuelle selon la décision du projet. Cette suppression ne retire pas leurs versions des commits historiques, sauvegardes ou autres clones ; leur traitement éventuel dans ces emplacements est distinct.
