# Étude des sources institutionnelles et de la détection des appels indésirables

**Périmètre :** sources publiques françaises et mécanismes officiels susceptibles d’éclairer SpamPatrol, sans recherche de numéros réels ni intégration technique.  
**Date de consultation :** 25 novembre 2026.  
**Classement :** A = compatible dans l’usage strictement décrit ; B = non validé pour réutilisation ; C = incompatible avec la charte ou sans données adaptées.

## Résumé exécutif

La recherche confirme qu’il existe des référentiels publics utiles pour expliquer la numérotation et certaines obligations, mais aucune base institutionnelle gratuite, ouverte et vérifiée de réputation des numéros appelants, ni aucun accès public au résultat d’authentification d’un appel particulier.

Le mécanisme d’authentification des numéros (MAN) est une chaîne de confiance opérateur pendant l’acheminement de l’appel. Il ne constitue pas une API publique de consultation. Les données ARCEP sur les plages et les numéros polyvalents vérifiés (NPV) décrivent des ressources et leurs usages réglementaires ; elles ne prouvent ni qu’un appel est authentique, ni qu’il est sollicité, licite ou frauduleux. Le NPV est précisément prévu pour certains systèmes automatisés : le qualifier de spam serait erroné.

Le régime de prospection a changé le 11 août 2026 : le consentement préalable est désormais requis dans le champ défini par la loi, avec des exceptions, notamment certains appels liés à un contrat en cours. Cette règle concerne le comportement et le consentement, pas l’identité d’un numéro affiché. Elle ne permet donc pas de produire un verdict par numéro.

Classement des six familles évaluées dans le tableau de synthèse : **5 A, 1 B, 6 C** (12 lignes d’évaluation, certaines regroupant des sources étroitement liées). Les sources A peuvent enrichir une explication réglementaire, afficher des coordonnées publiques officielles dans un périmètre limité, ou proposer des liens de prévention. **Aucune source A ne fournit de réputation individuelle de numéro.** SignalConso, 33700 et les signalements J’alerte l’Arcep sont des dispositifs de traitement/signalement, non des fichiers publics de numéros à intégrer.

## 1. Contraintes du cahier des charges

L’analyse suit le cahier des charges et l’architecture du projet : SpamPatrol reste un observatoire indépendant, informatif et pédagogique, fondé prioritairement sur des sources officielles. Les recherches des utilisateurs ne doivent pas être transmises à un service tiers ni conservées. Sont exclus les signalements communautaires, votes, commentaires, notes, scores, listes noires, statistiques issues de signalements, historique et profilage. Une donnée d’allocation ou une règle d’usage ne doit jamais être présentée comme une preuve d’identité, d’authenticité ou de fraude.

L’étude reste documentaire. Elle ne modifie ni la portée du projet ni ses fichiers fonctionnels. Les liens vers les publications institutionnelles sont des références documentaires ; ils ne valent pas autorisation de recopier intégralement leur contenu.

## 2. Résultats par source

| Source | Données ou mécanisme réellement vérifiés | Licence / accès et usage envisageable | Classement |
|---|---|---|---|
| ARCEP — ressources attribuées, MAJNUM et référentiels de numérotation | Attributions de ressources/plages, titulaires attributaires et informations de numérotation selon le jeu. Le plan évolue et ne révèle ni l’abonné effectif, ni le numéro porté actuellement, ni l’appelant réel. Le projet documente déjà MAJNUM et les Identifiants CE dans `docs/ARCEP.md`. | Le [jeu des ressources téléphoniques sur data.gouv.fr](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique) est indiqué sous Licence Ouverte / Open Licence, en CSV complet et mis à jour après les collèges de l’ARCEP (jeu consulté : mise à jour du 6 novembre 2026). Stockage local, affichage et réutilisation sont permis aux conditions de cette licence, notamment l’attribution. Le contenu des fichiers doit rester distinct d’une réputation. | **A**, limité aux données officielles et à leur sens propre. |
| ARCEP — plan national, NPV et règles d’usage | Plages et catégories réglementaires, dont NPV, et règles d’usage des numéros pour les systèmes automatisés. La [page de numérotation](https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/la-numerotation.html) est indiquée mise à jour le 14 septembre 2026. Les NPV sont compatibles avec certains systèmes automatisés ; leur présence n’établit pas que l’appel est abusif. | Pages et décisions officielles accessibles gratuitement. Une citation/lien à une règle est adaptée. Aucune licence de jeu autonome pour une extraction locale complète de la liste NPV n’a été vérifiée dans cette étude : ne pas redistribuer une extraction comme un référentiel ouvert sans confirmer les droits et le format auprès de l’ARCEP. | **A** pour l’information citée et datée ; **B** pour une extraction/redistribution autonome de liste sans licence de données confirmée. |
| ARCEP — MAN et STIR/SHAKEN | Le MAN est défini et déployé par les opérateurs : vérification des droits d’usage du CLI à l’origine, signature et propagation des informations d’authentification, puis décision d’acheminement/interruption selon les obligations. L’ARCEP décrit une chaîne de confiance opérateur. Les bases de portage/routage APNF et GIE EGP servent aux opérateurs, pas à une consultation publique de SpamPatrol. | Documentation réglementaire accessible gratuitement, utilisable comme explication avec lien et attribution. Le statut d’authentification d’un appel n’est pas publié comme fichier ouvert ou API de consultation publique. Le contrôle fonctionne dans la signalisation réseau au moment de l’appel et ne se reproduit pas par une liste statique. | **A** pour documentation éducative, **C** pour tenter d’obtenir un statut individuel via des bases opérateur. |
| DGCCRF / Légifrance — démarchage téléphonique | Règles applicables depuis le 11 août 2026 : consentement préalable dans le champ de la prospection commerciale, exceptions et encadrement des appels. La DGCCRF demande de signaler certains écarts par SignalConso. | Textes législatifs/réglementaires et fiches officielles en accès gratuit. Les citer ou les lier pour expliquer le droit est pertinent. Il n’existe pas de fichier identifiant par numéro les appels ayant ou non recueilli le consentement. | **A** pour information juridique sourcée et datée, jamais pour qualifier un numéro. |
| DILA — Annuaire de l’administration et des services publics | Coordonnées publiées d’administrations et services publics. L’API annoncée est libre d’accès et gratuite ; elle propose notamment consultation des annuaires et référentiels de l’État. | La fiche de service [data.gouv.fr](https://www.data.gouv.fr/dataservices/api-annuaire-de-ladministration-et-des-services-publics) renvoie aux fiches des jeux et à leurs conditions de réutilisation. La base de données locales est annoncée sous Licence Ouverte / Open Licence (vérifier la licence attachée à la ressource utilisée). Téléchargement local, affichage et redistribution sont envisageables selon les termes de cette fiche, avec attribution, date et respect des avertissements sur données personnelles. Usage concret : fournir un lien ou une coordonnée institutionnelle officielle pour vérification indépendante, sans dire que l’appel entrant venait de ce service. | **A**, pour annuaire de contacts publics seulement. |
| Cybermalveillance.gouv.fr — fiches de prévention | Conseils contre le spam téléphonique et l’usurpation, notamment utiliser 33700 pour signaler certains messages/appels, bloquer sur l’appareil et vérifier un interlocuteur par un canal officiel. C’est une ressource de sensibilisation, pas une source de réputation. Cybermalveillance.gouv.fr est le dispositif national d’assistance aux victimes ; il ne faut pas l’attribuer à l’ANSSI. | Pages publiques consultables et référençables par lien. Aucune base ouverte de numéros ni licence de données applicable à une base de réputation n’a été identifiée. Réutilisation recommandée : lien et résumé original, sans copier un corpus de contenus. | **A** pour lien/documentation pédagogique, **C** comme référentiel de numéros. |
| ANSSI — indicateurs et listes téléphoniques | Les recherches sur les publications accessibles de l’ANSSI n’ont pas mis en évidence de référentiel public de numéros d’appel ni de service de réputation téléphonique. Les conseils généraux de cybersécurité ne permettent pas de statuer sur un CLI. | Pas de jeu de numéros, licence de données ou flux public adapté identifiés. | **C** comme source de réputation ; références de cybersécurité générales seulement si une publication ANSSI précise est directement pertinente. |
| AF2M / 33700 | Dispositif de signalement de spams SMS et appels. Le formulaire indique que les signalements sont transmis à l’opérateur de l’utilisateur et à celui du numéro signalé pour traitement. Cela implique la transmission des données du signalement et ne constitue pas une publication de numéros confirmés. Aucun fichier complet ouvert ou API publique de réputation n’a été vérifié. | Le canal peut être gratuit pour le déclarant, mais il collecte/transmet un signalement à des tiers. Les informations de traitement et de conservation sont décrites sur [33700](https://s.33700.fr/) ; elles ne confèrent pas de droits d’accès ou de redistribution à une base opérateur. Inadapté aux recherches confidentielles des utilisateurs. | **C** pour l’interrogation ou l’intégration ; la page d’aide peut être citée comme dispositif de signalement institutionnel. |
| SignalConso / DGCCRF — jeu de données anonymisées | Le jeu [SignalConso sur data.gouv.fr](https://www.data.gouv.fr/datasets/signalconso) publie des données anonymisées issues de signalements, sous Licence Ouverte / Open Licence, avec exports CSV/JSON/GeoJSON. La structure porte sur des signalements/catégories et des informations agrégées ; aucun champ de numéro appelant n’a été repéré dans le schéma consulté. Une déclaration n’est pas une décision établissant une infraction. | Licence ouverte et fichiers gratuits, mais la compatibilité fonctionnelle prime : le cahier des charges interdit les statistiques établies à partir des signalements. Pas d’usage dans SpamPatrol, même agrégé. Le jeu peut être cité dans cette étude pour expliquer le dispositif, pas transformé en indicateur de réputation. | **C** pour le produit en raison de la charte, malgré la licence ouverte. |
| ARCEP — J’alerte l’Arcep et enquêtes | Les chiffres publiés, par exemple le communiqué du 29 janvier 2026 mentionnant l’enquête et les signalements d’usurpation, renseignent sur l’ampleur du phénomène et la réponse du régulateur. Ils ne donnent pas un référentiel ouvert de numéros sanctionnés/confirmés. | Informations et décisions publiques consultables ; les signalements individuels ne sont pas un flux d’intégration. Aucun statut de numéro ne peut être inféré des statistiques de plaintes. | **C** pour produire une liste/statistique de réputation ; **A** pour citer un bilan institutionnel comme contexte, hors calcul produit. |
| INSEE — Sirene | Sirene identifie les unités légales et établissements (SIREN/SIRET, dénomination, adresse, activité, etc.). Les fichiers stock/API sont gratuits, mais l’INSEE précise que les numéros de téléphone des personnes physiques ne sont pas diffusés par Sirene. Les variables téléphoniques ne constituent pas un répertoire de numéros appelants fiables. | Fichiers et API accessibles gratuitement via les canaux décrits par l’[INSEE](https://www.insee.fr/fr/information/3591226). Licence et conditions sont celles indiquées sur les fiches des ressources. Même avec une réutilisation autorisée, un rapprochement entreprise-numéro sans source prouvant le lien serait injustifié ; Sirene ne peut authentifier un appel. | **C** pour l’usage téléphonique envisagé ; répertoire d’identification d’organisations hors besoin actuel. |

## 3. Mécanismes techniques et réglementaires

### 3.1. MAN : authentification réseau, pas consultation de numéro

La [fiche opérateur de l’ARCEP](https://www.arcep.fr/mes-demarches-et-services/acteurs-regules/operateurs-telecoms/fiches-pratiques/authentification-numeros-telephone-fixe-ou-mobile-que-faire-en-tant-que-operateur-telephonique.html), mise à jour le 27 mars 2026, décrit les obligations de l’opérateur de départ : vérifier que son client est affectataire du numéro présenté ou explicitement autorisé à l’utiliser, authentifier techniquement le numéro par MAN et transmettre des informations permettant d’identifier l’opérateur à l’origine de l’appel. Si l’authenticité n’est pas confirmée, les opérateurs doivent interrompre l’acheminement selon les règles applicables. Les opérateurs destinataires vérifient la chaîne et appliquent les obligations pertinentes.

Les spécifications sont opérateur-opérateur, et les informations cheminent avec l’appel. Les bases de portage/routage mentionnées par l’ARCEP sont destinées aux opérateurs. Cela n’expose pas à SpamPatrol le résultat de contrôle d’un appel reçu par un utilisateur. Les attestations n’établissent pas l’intention commerciale, la conformité au consentement ni l’absence de fraude dans le contenu de la conversation. Une chaîne d’authentification de CLI ne doit donc pas être interprétée comme un score de sûreté de l’appel.

L’ARCEP indique que les dispositions de sa décision 2025-2215 s’appliquent pour l’essentiel depuis le 1er janvier 2026, avec un report spécifique à Saint-Martin. Pour certains appels internationaux entrants présentant un mobile français non authentifié, le numéro doit être masqué ; un numéro masqué n’est pas une preuve que l’appel est frauduleux. L’ARCEP a ouvert en janvier 2026 une enquête sur l’origine et les routes d’appels impliqués dans des fraudes, ce qui confirme que des contournements et difficultés d’acheminement restent possibles.

### 3.2. Numérotation, automatisation et NPV

Le plan de numérotation et les fiches professionnelles de l’ARCEP décrivent les plages, les ressources attribuées et les usages autorisés. Depuis 2023, les systèmes automatisés ne doivent pas utiliser les plages personnelles ordinaires 01–05, 06–07 et 09 comme identifiant d’appelant, sous réserve des exceptions prévues. Les NPV constituent des plages spécifiquement prévues pour certains systèmes d’appels/messages automatisés. Un appel individuel déclenché manuellement n’est pas assimilé à un système automatisé dans les conditions précisées par le plan.

Les plages NPV exactes et le plan pouvant évoluer, toute présentation devrait porter la source, la date d’effet et la date de vérification. L’usage NPV n’est ni une preuve de démarchage illicite ni un signal de fraude. Inversement, l’absence d’un numéro dans une plage NPV n’authentifie pas l’appel et ne dit rien sur la réputation de son émetteur.

### 3.3. Règles de démarchage depuis le 11 août 2026

La DGCCRF indique que, depuis le 11 août 2026, la prospection téléphonique des consommateurs est soumise au consentement préalable, avec des exceptions et des secteurs où le démarchage est interdit. Le consentement porte sur la personne appelée et la relation commerciale ; il n’est pas lisible dans un préfixe, un numéro NPV, une attribution ARCEP ou un statut Sirene. SpamPatrol ne dispose donc pas des éléments nécessaires pour conclure qu’un appel précis respecte ou viole la règle.

Les règles de jours, horaires et fréquence sont elles aussi applicables à l’activité du professionnel et à la personne contactée. Elles ne produisent pas un référentiel de numéros. Toute interface doit éviter une formule telle que « plage légale = appel légitime » ou « numéro non NPV = fraude ».

### 3.4. Signalements et données institutionnelles

33700 et SignalConso recueillent des déclarations afin que les opérateurs ou administrations puissent les traiter. J’alerte l’Arcep sert à transmettre des alertes au régulateur. Ces fonctions ne sont pas des consultations passives : elles transmettent des informations, et les déclarations ne valent pas vérification contradictoire ou décision définitive sur un numéro. Les bilans agrégés peuvent documenter un phénomène dans un rapport, mais la charte interdit d’en dériver des statistiques produit issues de signalements.

## 4. Comparaison aux études antérieures

Les études existantes dans `docs/etudes/` couvrent déjà les sources de réputation, les référentiels d’opérateurs et les sources professionnelles. La présente étude complète ces travaux sur le mécanisme MAN, les mesures ARCEP applicables en 2026, l’entrée en vigueur du régime de consentement et la différence entre un dispositif de signalement et un flux public. Elle confirme les limites déjà établies pour l’ARCEP : l’affectation d’une ressource ne fournit pas l’identité de l’abonné ou l’authenticité d’un appel.

Les bases de routage et de portage opérateur, les données de traitement de 33700, et les dossiers de signalement ne sont pas des sources à importer. Les recherches en temps réel sur un numéro via un tiers restent incompatibles avec l’exigence de confidentialité, même si l’API était gratuite.

## 5. Classement consolidé

Le comptage ci-dessous porte sur les lignes-familles du tableau, en séparant les usages de présentation pédagogique des usages de référentiel individuel.

| Classe | Nombre | Sources / usages concernés |
|---|---:|---|
| **A — compatible dans le périmètre défini** | **5** | Fichiers ARCEP ouverts déjà documentés ; citation des règles de numérotation/MAN ; information juridique DGCCRF/Légifrance ; annuaire DILA sous licence de la ressource ; liens de prévention Cybermalveillance. |
| **B — non validé** | **1** | Extraction et redistribution autonome de la liste NPV si la licence de données applicable à l’extraction n’est pas explicitement établie. La citation de la page réglementaire elle-même reste classée A. |
| **C — incompatible ou sans donnée pertinente** | **6** | Référentiels opérateurs privés APNF/GIE EGP ; ANSSI comme base de réputation (aucun jeu identifié) ; 33700 comme source d’interrogation ; SignalConso pour le produit (interdit par la charte malgré sa licence ouverte) ; listes tirées de J’alerte l’Arcep ; Sirene pour authentifier/associer un numéro. |

## 6. Usage concret envisageable

Sans élargir la charte, les apports compatibles sont limités à :

1. Maintenir l’affichage d’informations ARCEP locales déjà prévues et ajouter, si utile, des précisions réglementaires sourcées sur la catégorie de plage et sa date de validité.
2. Expliquer en texte que le MAN est un mécanisme entre opérateurs auquel SpamPatrol n’accède pas, et rappeler ses limites pour l’identité et l’intention de l’appelant.
3. Présenter les règles de démarchage en vigueur à la date de consultation, en renvoyant vers DGCCRF/Légifrance et en évitant toute qualification par numéro.
4. Éventuellement afficher un lien ou des coordonnées tirés de l’annuaire DILA pour aider l’utilisateur à contacter lui-même un service public par un canal publié indépendamment.
5. Proposer un lien de prévention vers les pages Cybermalveillance ou 33700, sans envoyer à ces services le numéro recherché par l’utilisateur.

Ces possibilités sont documentaires et n’impliquent aucun appel externe pendant une recherche de numéro. Aucun rapprochement automatique Sirene-numéro ou ARCEP-numéro-utilisateur n’est justifié par les données examinées.

## 7. Sources écartées et limites

- **SignalConso et J’alerte l’Arcep :** les données ou statistiques sont issues de signalements ; pas de liste publique vérifiée de numéros et interdiction de produire des indicateurs à partir de signalements dans SpamPatrol.
- **33700 :** outil de transmission à des opérateurs, avec traitement et conservation selon sa finalité ; aucune base complète ouverte vérifiée.
- **MAN / APNF / GIE EGP :** authentification et routage opérateur au moment de l’appel ; aucun accès public individuel identifié. Ne pas simuler ce contrôle par un fichier de plages.
- **Sirene :** identifiants et informations administratives d’entités, non preuve que l’entité contrôle le numéro présenté. L’INSEE indique que les numéros de téléphone des personnes physiques ne sont pas diffusés par Sirene.
- **ANSSI :** aucun flux institutionnel de réputation téléphonique identifié. Les conseils de prévention sont des ressources éditoriales.
- **Bases commerciales, communautaires et API de recherche :** écartées si payantes, fondées sur des signalements incompatibles ou si la recherche utilisateur doit être transmise à un tiers, conformément au cahier des charges.

Limites de l’étude : les conditions d’utilisation et les métadonnées des jeux peuvent évoluer ; chaque ressource précise doit être revalidée avant tout téléchargement ou redistribution. La licence d’une page, d’un logiciel ou d’une API ne se substitue pas à la licence du jeu sous-jacent. Les décisions juridiques d’un cas particulier dépendent de faits (consentement, contrat, contenu, fréquence, origine de l’appel) qui ne sont pas présents dans un numéro.

## 8. Conclusion et recommandation

**Aucune nouvelle base institutionnelle gratuite et compatible de réputation individuelle des numéros n’a été trouvée.** Des sources publiques compatibles existent pour expliquer la réglementation, documenter des plages ARCEP, fournir certaines coordonnées de services publics et orienter vers des ressources de prévention. Elles ne doivent pas être converties en verdict individuel sur l’appelant.

La suite cohérente avec le cahier des charges consiste à maintenir les données ARCEP déjà prévues, à conserver les dates, la provenance et les limites d’interprétation, et à n’ajouter que des explications ou liens institutionnels statiques après vérification des conditions de la ressource. Aucun service ne devrait recevoir le numéro saisi pendant une recherche. Toute intégration de données ou évolution fonctionnelle doit faire l’objet d’une décision distincte.

## Références principales

Consultées le 25 novembre 2026 ; les dates de publication/mise à jour indiquées sont celles affichées par les organismes.

### ARCEP

- [La numérotation](https://www.arcep.fr/la-regulation/grands-dossiers-thematiques-transverses/la-numerotation.html), mise à jour 14 septembre 2026.
- [Plan de numérotation pour les professionnels](https://www.arcep.fr/mes-demarches-et-services/entreprises/fiches-pratiques/plan-numerotation-professionnels.html).
- [Authentification des numéros : informations pour les opérateurs](https://www.arcep.fr/mes-demarches-et-services/acteurs-regules/operateurs-telecoms/fiches-pratiques/authentification-numeros-telephone-fixe-ou-mobile-que-faire-en-tant-que-operateur-telephonique.html), mise à jour 27 mars 2026.
- [Décision n° 2025-2215 et communiqué du 2 décembre 2025](https://www.arcep.fr/actualites/actualites-et-communiques/detail/n/plan-de-numerotation-021225.html).
- [Enquête administrative sur l’origine et les routes d’appels impliqués dans des fraudes](https://www.arcep.fr/actualites/actualites-et-communiques/detail/n/protection-des-consommateurs-290126.html), 29 janvier 2026.
- [Jeu ARCEP « Ressources en numérotation téléphonique » — data.gouv.fr](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique), Licence Ouverte / Open Licence, fichiers CSV complets, mise à jour du jeu indiquée au 6 novembre 2026.
- [Documentation de réutilisation des ressources de numérotation — data.gouv.fr](https://www.data.gouv.fr/reuses/visualisation-recherche-exportation-des-ressources-en-numerotation-telephoniques-attribues-par-larcep).

### DGCCRF, droit et signalements

- [Le démarchage téléphonique désormais interdit sans consentement préalable](https://www.economie.gouv.fr/dgccrf/actualites-dgccrf/le-demarchage-telephonique-desormais-interdit-si-vous-ny-avez-pas-consenti), 5 août 2026.
- [Règles du démarchage téléphonique pour les entreprises](https://www.economie.gouv.fr/dgccrf/les-fiches-pratiques/les-regles-du-demarchage-telephonique-simposant-aux-entreprises), 27 juillet 2026.
- [Décret n° 2026-662 du 23 juillet 2026](https://www.legifrance.gouv.fr/eli/decret/2026/7/23/2026-662/jo) et [Code de la consommation, dispositions relatives au démarchage téléphonique](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441/2026-08-11).
- [Jeu anonymisé SignalConso — data.gouv.fr](https://www.data.gouv.fr/datasets/signalconso), Licence Ouverte / Open Licence telle qu’affichée par la fiche consultée.
- [Formulaire de signalement 33700](https://s.33700.fr/), informations sur le transfert aux opérateurs et le traitement des données.

### Services publics et prévention

- [API Annuaire de l’administration et des services publics — data.gouv.fr](https://www.data.gouv.fr/dataservices/api-annuaire-de-ladministration-et-des-services-publics), service DILA annoncé gratuit ; consulter la licence de chaque jeu lié.
- [Consulter et télécharger la base Sirene — INSEE](https://www.insee.fr/fr/information/3591226), mise à jour 17 octobre 2024.
- [Informations Sirene non diffusées par l’INSEE](https://www.insee.fr/fr/information/6790269?question=quelles-sont-les-informations-du-repertoire-sirene-diffusees-par-l-insee), notamment le numéro de téléphone des personnes physiques.
- [Spam téléphonique : que faire ? — Cybermalveillance.gouv.fr](https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/spam-telephonique).
