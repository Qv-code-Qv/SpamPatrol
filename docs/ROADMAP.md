# Feuille de route SpamPatrol

## Cap du projet

SpamPatrol évolue vers un observatoire pédagogique indépendant de la numérotation téléphonique française, fondé prioritairement sur les sources officielles de l’ARCEP, en particulier MAJNUM. Le projet doit expliquer les données, leurs unités, leurs limites et leur date de référence; il ne doit pas se réduire à des compteurs sans contexte.

Le cahier des charges de référence est `cahier_des_charges.docx`. Le PDF conservé est une archive historique. Les fonctionnalités communautaires ont été retirées du code actif et ne sont pas prévues dans cette roadmap. Le projet reste maintenu par une seule personne, avec React, Node.js/Express, API REST et fichiers JSON. Aucune base SQL n’est prévue.

## État de départ

La recherche ARCEP/MAJNUM et la recherche du jeu local de préfixes existent. Le Dashboard actif reste statique : il n’appelle pas l’API et ne présente pas de données, graphiques ou indicateurs calculés. Les données locales comprennent un instantané MAJNUM publié le 2026-10-19, une liste Identifiants CE et un jeu local de 17 préfixes. Une seule génération MAJNUM traitée est présente; l’historique des ressources n’est donc pas calculable à ce stade.

## Ordre de développement

Chaque phase doit être achevée, documentée et vérifiée avant de commencer la suivante. Une fonctionnalité mentionnée ci-dessous comme cible ou possibilité n’est pas une fonctionnalité déjà développée.

### Phase 1 — Exploiter les données déjà présentes

Priorité immédiate. Ne pas chercher de nouvelles sources avant d’avoir livré et vérifié les premiers indicateurs disponibles dans l’instantané local.

1. Vérifier les métadonnées, empreintes, comptes, champs, unités et limites de l’index MAJNUM existant.
2. Définir et tester les calculs : total de lignes de ressources/tranches, codes attributataires distincts, agrégations par territoire et code, distribution des dates d’effet parmi les ressources de l’instantané.
3. Distinguer `publishedDate`, `activatedAt` et toute future vérification en ligne; ne jamais appeler `activatedAt` une dernière synchronisation.
4. Concevoir une API de synthèse compacte si elle est nécessaire. Ne pas envoyer l’index entier au navigateur.
5. Vérifier les unités, résultats, cas limites et tests; faire examiner le résultat avant la phase 2.

**Critère de fin :** chaque indicateur possède une source, une méthode reproductible, une unité exacte et une description de ce qu’il ne mesure pas. Aucun indicateur n’est publié si ces éléments manquent.

### Phase 2 — Premier Dashboard enrichi

1. Afficher la provenance et les dates locales de l’instantané avec leur signification exacte.
2. Intégrer uniquement les agrégats vérifiés de la phase 1.
3. Ajouter des visualisations accessibles et complémentaires, avec explications pédagogiques, méthode, unité, périmètre et limites.
4. Préserver le template Light Bootstrap Dashboard, les couleurs, la navigation, la disposition et le responsive.
5. Tester les valeurs affichées, les états d’erreur et l’absence de données inventées.

**Critère de fin :** le Dashboard montre le contenu réel de l’instantané sans le présenter comme un nombre d’abonnés, d’appels, de lignes actives ou d’utilisateurs.

### Phase 3 — Classification réglementaire officielle

1. Identifier les documents officiels applicables aux catégories de numérotation.
2. Définir une table de correspondance versionnée entre les ressources MAJNUM et les catégories, avec les exceptions et cas particuliers.
3. Tester cette classification sur les ressources présentes et documenter sa date de référence.
4. Calculer et intégrer une répartition par catégorie seulement après validation de la correspondance.

**Critère de fin :** les catégories affichées sont traçables vers une règle ou source officielle et aucune classification n’est déduite seulement de la longueur ou d’un préfixe ambigu.

### Phase 4 — Étudier les sources officielles complémentaires

Évaluer chaque source avant intégration : pertinence pédagogique, producteur, licence, fréquence et date de mise à jour, structure, méthode de rapprochement, limites et coût de maintenance.

Pistes à étudier séparément : GELNUM pour les ressources gelées ou abrogées; MAJPORTA pour expliquer des éléments de portabilité sans en déduire l’opérateur actuel; MAJNFB pour certains numéros courts; références officielles adaptées aux catégories et tarifs des SVA. L’intégration d’une source n’est pas une décision de développement automatique.

**Critère de fin :** une fiche de source et une méthode testable sont validées avant toute ingestion.

### Phase 5 — Historique et analyses ultérieures

1. Définir une politique de conservation des instantanés complets et de leurs métadonnées.
2. Après constitution de plusieurs versions comparables, définir les clés et règles de comparaison pour les ajouts, retraits, modifications, scissions et fusions de tranches.
3. Construire des indicateurs d’évolution seulement à partir de versions datées et comparables.

Les dates d’effet présentes dans un instantané unique ne remplacent pas cet historique et ne doivent pas être présentées comme une évolution temporelle du référentiel.

## Statistiques de consultation indépendantes

Les éventuelles statistiques de consultation de SpamPatrol ne sont pas une extension automatique des indicateurs ARCEP et ne font pas partie des phases immédiates. Aucun compteur ni endpoint n’est actuellement disponible. Cette fonctionnalité facultative nécessite une décision séparée sur l’éligibilité, les exclusions, les répétitions, les périodes, les seuils et les protections contre le recoupement.

Aucun numéro exact ou normalisé, hash, événement individuel, historique de recherche, IP ou identifiant de visiteur ne doit être enregistré. Les recherches invalides, en erreur, sans correspondance MAJNUM ou uniquement locales doivent être exclues. L’implémentation et la publication restent bloquées jusqu’à validation explicite des règles et de leur conformité.

## Principes de fiabilité pour toute phase

- Les nombres affichés sont des enregistrements de ressources/tranches si c’est l’unité du calcul; ne pas les appeler nombres d’abonnés ou appels.
- Le territoire décrit une ressource et ne localise pas un appelant.
- Un code attributaire ne mesure pas une part de marché et ne garantit pas l’opérateur actuel après portabilité.
- Une date d’attribution ne constitue pas une série historique.
- L’absence d’une ligne ne prouve pas la disponibilité d’une ressource.
- MAJNUM ne fournit ni indicateur de spam, ni mesure de démarchage ou de fraude.
- Chaque graphique explique sa source, date, calcul, unité, périmètre et limites.
- Ne réintroduire aucune fonction communautaire, liste noire ou classement issu de signalements.
- L’IA reste une possibilité facultative hors du périmètre immédiat.
