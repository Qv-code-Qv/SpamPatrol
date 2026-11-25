# Étude des sources gratuites de données téléphoniques et de réputation

**Recherche arrêtée au 25 novembre 2026.** Étude documentaire : aucun code, jeu de données, configuration ou dépendance n’a été modifié.

## Synthèse

Les opérateurs combinent règles réseau, plages réglementaires, signalements et modèles internes. Les pages publiques consultées ne donnent accès à aucun fichier de réputation opérateur réutilisable par SpamPatrol. Orange décrit une base locale mêlant données ARCEP et signalements communautaires; SFR décrit un filtrage réseau sans publier ses critères; Free documente son filtre sans export public. Bouygues Telecom a annoncé un service Anti-Spam fondé sur Hiya, à 2 €/mois, sans accès public à la base.

Les sources gratuites les plus solides concernent la numérotation et l’identité d’organismes publics, non la réputation : exports ARCEP MAJNUM et Identifiants CE, annuaire administratif DILA. Elles n’indiquent ni l’utilisateur final d’un numéro ni les appels qu’il passe.

Une piste plus concrète est apparue : NoCall publie une page annonçant un CSV de signalements sous CC BY 4.0. Mais sa page France indiquait zéro numéro dans la liste au contrôle du 24 novembre 2026, le fichier lui-même n’a pas pu être récupéré/validé depuis la documentation consultable, et les conditions générales interdisent la copie massive de la base tandis que l’accès API aux données payantes consomme des crédits et ne peut servir à reproduire NoCall. Il faut une clarification écrite avant toute réutilisation périodique ou republication. Saracroche et Who Called restent également sans droits d’accès tiers suffisamment établis.

**Conclusion :** une base communautaire française est annoncée comme CSV libre par NoCall, mais elle était vide au dernier état daté consulté et son articulation avec les conditions générales reste à clarifier. SignalConso fournit des données anonymisées sur les catégories de plaintes, sans numéro appelant. Aucune base de réputation individuelle n’est donc actuellement qualifiée de source A exploitable dans SpamPatrol. La charte de SpamPatrol exclut en outre les listes, scores et statistiques issus de signalements communautaires.

## Méthode

Les sources primaires, documentations de jeux/API et licences ont été privilégiées. Une application gratuite ou une page consultable ne confère pas en soi le droit de télécharger, stocker, afficher ou redistribuer les données. L’absence de documentation publique ne prouve pas l’absence d’accord privé. Tout accès dont la gratuité durable ou les droits sont incertains est écarté au regard de la contrainte financière absolue.

## Opérateurs et fournisseurs

| Acteur | Fonctionnement documenté | Accès tiers | Conclusion |
|---|---|---|---|
| Orange Téléphone | Base locale décrite comme alimentée par ARCEP et des retours communautaires. Aide iOS : actualisation à l’ouverture régulière; une aide professionnelle mentionne une mise à jour quotidienne, possiblement variante de service. | Aucun export, licence de base ou API de réputation publique trouvé. | Ne pas extraire la base. [Aide iOS](https://assistance.orange.fr/livebox-modem/toutes-les-livebox-et-modems/installer-et-utiliser/piloter-et-parametrer-votre-materiel/l-application-mobile-orange-et-moi/orange-et-moi-tout-savoir-sur-l-anti-spam-appels-ios-_442605-972089) · [Aide Pro](https://assistancepro.orange.fr/telephone_mobile/utiliser_une_application_orange/orange_telephone_pro/orange_telephone_pro_depannage-x925558) |
| SFR | Filtrage réseau d’appels suspects/indésirables; critères non publiés. | Aucun fichier/API ouverte repérés. | Fonction propriétaire. [Assistance](https://assistance.sfr.fr/sfrmail-appli/phishing-spam/email-phishing-sms-frauduleux.html) |
| Bouygues / Hiya | Analyse comportementale intégrée au réseau annoncée en septembre 2026; traitement en France déclaré. | Offre à 2 €/mois; base non publiée. | **Inexploitable** : payant et propriétaire. [Annonce](https://www.corporate.bouyguestelecom.fr/archives-communique-presse/bouygues-telecom-lance-anti-spam-alerter-sur-les-appels-potentiellement-frauduleux-grace-a-lia-integree-au-reseau/) · [Offre](https://www.bouyguestelecom.fr/option-mobile/anti-spam/) |
| Free Mobile / Freebox | Filtrage et liste propres à Free/abonné. | Aucun téléchargement public ni droit de réutilisation trouvé. | Pas une source ouverte établie. [Mobile](https://assistance.free.fr/articles/883) · [Freebox](https://assistance.free.fr/articles/549) |
| Hiya | API de réputation et cache TSV compressé documentés. La documentation technique seule ne garantit pas coût nul et droits d’usage. | Accès tiers gratuit durable, sans carte bancaire, et droits de stockage/redistribution non vérifiés. | **Inexploitable selon la contrainte actuelle** sans confirmation écrite que tout est gratuit et autorisé. [Cache API](https://developer.hiya.com/docs/protect/cache/endpoints/v-1-get-spammer-cache) · [Accès API](https://connect-support.hiya.com/hc/en-us/articles/55700147155987-Hiya-APIs-what-is-available-plan-eligibility-and-how-to-request-access) |
| Samsung Smart Call | Fonction propulsée par Hiya dans certaines régions. | Pas de base autonome ouverte identifiée. | Produit utilisateur, pas flux réutilisable. [Samsung](https://www.samsung.com/uk/apps/smart-call/) |

Le filtrage réseau peut s’appuyer sur des signaux internes (volume, durée, comportement, retours); il ne se réduit pas à une liste. Aucun flux public trouvé ne permet à SpamPatrol de certifier l’authenticité d’un appel reçu. Le 33700 transmet des signalements aux opérateurs pour qualification, mais ne publie pas de base ouverte de numéros confirmés; un signalement n’est pas une décision de fraude. [AF2M – 33700](https://af2m.org/33700-2/)

## Comparaison des sources

| Source | Données, format, accès | Coût, licence et droits | Fraîcheur et limites | Classement |
|---|---|---|---|---|
| **ARCEP – MAJNUM** | CSV séparé par point-virgule; ressources/tranches attribuées, code, territoire, date. Gratuit sur [Extranet](https://extranet.arcep.fr/communications-electroniques/numerotation) et [data.gouv.fr](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique). | Licence Ouverte indiquée, version non précisée sur la fiche. La [Licence Ouverte 2.0](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0) autorise réutilisation et redistribution avec attribution, date/version, mention des transformations et présentation non trompeuse. Revalider la licence exacte de chaque export. | Source officielle d’attribution à la date du jeu; pas d’usage, d’abonné, de trafic, de réputation ou d’opérateur actuel après portabilité. | **Exploitable** pour la numérotation, sous attribution et fraîcheur explicites. |
| **ARCEP – Identifiants CE** | CSV de codes et dénominations d’acteurs; [fiche](https://www.data.gouv.fr/datasets/identifiants-de-communications-electroniques). | Licence Ouverte indiquée, version non précisée. Attribution et non-tromperie; ne conserver que les champs nécessaires. | Référentiel officiel, annoncé hebdomadaire dans la documentation projet. Le code ne prouve pas l’opérateur actuel ni la réputation. | **Exploitable** pour expliquer les codes ARCEP. |
| **DILA – Annuaire administratif** | Base locale structurée et API documentée; fiches de services publics pouvant contenir des téléphones. [Jeu](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales/) · [API](https://dila.gouv.fr/services/api/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr/article/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr). | Accès gratuit; Licence Ouverte v2 indiquée sur le jeu : attribution, date, transformations, pas de présentation trompeuse. Répercuter les mises à jour et retraits. | Source d’identité/coordonnées de services publics uniquement; ne valide pas un appelant. | **Exploitable sous conditions** : limiter aux organismes publics et gérer les retraits. |
| **Saracroche** | Listes locales périodiques mêlant plages ARCEP et signalements avec seuils. L’aide indique qu’une API documentée est prévue, mais aucune procédure publique tierce n’est fournie. [Description](https://saracroche.org/fr/help/blocked-numbers/) · [Téléchargement](https://saracroche.org/fr/help/database-downloadable/). | App gratuite; code Android/iOS GPLv3 et site AGPLv3, mais la licence des listes n’est pas clairement établie par les mentions consultées. Le CC BY-NC-SA des contenus éditoriaux ne doit pas être étendu aux données. [Mentions légales](https://saracroche.org/fr/legal-notice/). | Mise à jour quotidienne annoncée; signalements déclaratifs et risques de faux positifs. La politique indique que signaler transmet numéro et identifiant aléatoire; les listes téléchargées sont locales. [Confidentialité](https://saracroche.org/fr/privacy/). | **À approfondir**; aucune extraction/intégration sans accès et licence écrits. |
| **Who Called** | Dépôt GPL-3.0, application et API communautaire; préfixes ARCEP, scores et signalements. [README](https://github.com/who-called/android-ios-web). | Le code public ne prouve pas API tierce gratuite durable ni droits de stockage, affichage et redistribution des données opérées. | Scores/signalements déclaratifs, potentiellement erronés ou périmés. Code et base ont des droits distincts. | **À approfondir**; conditions des données non établies. |
| **PhoneBlock** | API allemande de consultation, recherche par hash/préfixe et liste incrémentale. [Documentation](https://phoneblock.net/phoneblock/api). | Authentification par compte/token; gratuité durable, quotas et droits de réutilisation de la base non établis. | Communautaire et centré Allemagne; faible pertinence française, signalements non certifiés. | **À approfondir**, non prioritaire. |
| **FTC – Do Not Call (États-Unis)** | CSV quotidiens et API de plaintes : numéro déclarant, date/heure, sujet, robocall et localisation plaignant. [Données/API](https://www.ftc.gov/policy-notices/open-government/data-sets/do-not-call-data). | Publication gratuite; la FTC indique l’accès API, mais les droits détaillés de redistribution commerciale et les exigences de données personnelles ne sont pas tous établis par la page. | Quotidien en semaine. FTC : appels rapportés non vérifiés. Données américaines, non probantes pour les numéros français. | **Inexploitable** pour qualifier les numéros français; comparaison méthodologique seulement. |
| **INSEE – Sirene** | Répertoire d’entreprises, pas annuaire général de téléphones. [Champs diffusés](https://www.insee.fr/fr/information/6790269). | Public mais ne fournit pas le flux téléphonique recherché. | Peut aider à identifier une entité, pas à valider un appelant. | **Inexploitable** comme base téléphonique. |
| **Truecaller, Google Phone, First Orion, TNS** | Services/bases propriétaires; aucun dump ouvert à licence vérifiée trouvé. | Conditions d’accès tiers ou droits non compatibles/établis. Truecaller encadre scraping et redistribution; First Orion demande une clé sous conditions d’entreprise. [Truecaller API](https://www.truecaller.com/api-license-addendum) · [Conditions](https://www.truecaller.com/terms-of-service) · [First Orion](https://support.firstorionenterprise.com/hc/en-us/articles/27590654141453-How-do-I-generate-an-API-Key) · [TNS](https://tnsi.com/wp-content/uploads/2024/08/CM_ProductSheet_CallGuardian_JUL2024.pdf). | Méthodes et données propriétaires. | **Inexploitable** selon coût, accès et droits. |

## Deuxième investigation : listes communautaires, CSV et API

**Vérifications complémentaires : 25 novembre 2026.** Les mentions de disponibilité et de gratuité ci-dessous décrivent les pages alors consultées; elles ne valent pas garantie de disponibilité à long terme. Aucun numéro fourni par un visiteur n’a été recherché sur les sites tiers.

### NoCall — CSV CC BY annoncé, mais non retenu en l’état

La page française [Numéros de spam](https://nocall.io/fr/numeros-indesirables) annonce un CSV téléchargeable gratuitement sous **CC BY 4.0**, explicitement réutilisable et adaptable, y compris à des fins commerciales, avec attribution NoCall. Elle décrit les colonnes suivantes : numéro E.164, nombre de signalements approuvés, nombre de personnes distinctes, catégorie majoritaire, dates du premier et du dernier signalement. Le fichier annoncé ne comprend ni IP, ni identifiant d’appareil, ni compte, ni texte de commentaire. Aucun score n’est fourni dans ce CSV. La page de méthodologie publie un score calculé pour le site, mais ce score ne doit pas être confondu avec le contenu de l’export.

La méthode annoncée pour cette liste : examen et approbation humaine, seuil minimum de deux personnes distinctes (IP et appareils distincts), suppression de la liste et du CSV dans les secondes qui suivent un retrait/modération, recalcul horaire. La page dit que le CSV français ne contient que des signalements soumis directement à NoCall et exclut les données importées, commentaires et signalements générés. Il n’y a donc aucune contribution ARCEP dans ce fichier; si la liste comporte des lignes, elles relèvent de signalements communautaires modérés, pas d’une validation officielle de fraude.

Au contrôle daté du **24 novembre 2026, 23:07 UTC**, la page France indiquait **0 numéro et 0 signalement approuvé** dans la liste. Les résultats indexés donnaient ce même état récent; une ouverture de page en cache a aussi montré un ancien instantané daté du 4 novembre, également à zéro. La page Espagne affichait neuf numéros, ce qui confirme que l’export varie par pays et ne permet pas de transposer un volume étranger à la France. La page affirme qu’un bouton « Télécharger la liste en CSV » existe, mais l’URL effective et le contenu binaire du CSV français n’ont pas pu être confirmés indépendamment dans cette revue. Le fichier est donc **annoncé**, son accessibilité effective non vérifiée, et son nombre actuel de lignes non vérifié au-delà du compteur de page.

Les conditions générales de NoCall (page mise à jour le 24 novembre 2026) ajoutent une restriction générale : elles interdisent de copier la base, de faire de l’extraction massive ou de revendre les informations; elles indiquent aussi que la base appartient à l’exploitant. Cela peut être lu avec la permission spécifique CC BY du seul CSV publié : la licence propre à ce fichier constitue une autorisation expresse de le copier et l’adapter, tandis que la restriction vise le scraping, la copie générale de la base, la revente ou la reproduction du service. Mais l’articulation d’un import récurrent et d’une republication publique dans SpamPatrol n’est pas explicitement réglée. Le cadre API indique qu’il faut un compte développeur approuvé; les accès aux données/outils payants consomment des crédits à 0,01 € pièce. Aucune allocation gratuite et durable permettant d’utiliser l’API de réputation ou de répliquer le dump n’a été établie, et les conditions interdisent d’utiliser l’API pour copier la base ou créer un service qui reproduit NoCall. L’API de réputation est donc **C — exclue**.

La page mentionne une mise à jour horaire, mais cela ne garantit pas le maintien du CSV, du service, ni un minimum de données. Le champ « personnes distinctes » est un indicateur agrégé fourni par l’éditeur; l’absence d’IP dans le CSV ne supprime pas les risques associés à la publication de numéros de téléphone. NoCall indique que la formule gratuite du site comporte des publicités; ce modèle d’accès au site ne rend pas le CSV payant, mais l’API et certaines fonctions sont payantes.

**Décision : B — à approfondir juridiquement et techniquement, non exploitable dans SpamPatrol en l’état.** La CC BY 4.0 spécifique du CSV est un signal positif et semble autoriser les usages commerciaux avec attribution. Néanmoins : (1) l’export effectivement téléchargeable et son contenu n’ont pas été vérifiés; (2) la liste France était vide; (3) les conditions générales générales et la portée de la permission CSV méritent clarification écrite pour une synchronisation et republication répétées; (4) le cahier des charges de SpamPatrol interdit les listes noires, scores et classements issus des signalements communautaires. Même avec confirmation de licence, cette incompatibilité de périmètre devrait être levée avant toute décision de produit. Ne pas utiliser l’API à crédits.

**Clarifications à demander à NoCall, sans les solliciter dans le cadre de cette mission :** URL stable et accès direct au CSV; confirmation que la CC BY 4.0 autorise le téléchargement périodique côté serveur, le stockage local, l’affichage des champs et la redistribution intégrale ou partielle dans une application publique; portée de l’interdiction de copie massive dans les conditions générales; mécanisme, délai et historique de retrait/correction; méthode de modération et traitement des numéros réattribués/usurpés. Contact publié : [support@nocall.io](https://nocall.io/fr/conditions).

### SignalWeb ANRDI — API déclarée ouverte, mais licence et mode local non établis

La fiche [data.gouv.fr – Signalements sur SignalWeb](https://www.data.gouv.fr/dataservices/signalements-sur-la-plateforme-signalweb) décrit une API permettant de consulter des signalements relatifs à des sites, domaines, téléphones, SMS, courriels et comptes suspects. Elle mentionne un accès « Ouvert », une limite annoncée de 120 appels par minute et une disponibilité annoncée de 99,9 %. La même fiche précise **« Licence non renseignée »**, n’associe aucun jeu de données téléchargeable et pointe vers le catalogue API et une documentation Swagger.

Au contrôle, le lien Swagger/API technique a répondu par une erreur d’accès 502 via l’outil de consultation; les routes, schémas, authentification, champs, volumes téléphoniques, limites de pagination et modalités de mise à jour n’ont donc pas pu être vérifiés. La page d’accueil SignalWeb consultée montrait trois signalements récents, tous concernant des sites/domaines; elle ne démontrait pas la présence de signalements téléphoniques. Les mentions légales disent que les informations sont indicatives, qu’un signalement n’est pas une décision de justice ni une qualification juridique, et que l’ANRDI peut corriger/retirer une fiche. Certaines informations des mentions légales de production sont signalées par l’éditeur comme à compléter. Politique de confidentialité : [SignalWeb](https://signalweb.anrdi.fr/confidentialite.do); responsable indiqué : ANRDI.

Une recherche unitaire par API transmettrait le numéro à SignalWeb, ce que le cahier des charges interdit. Aucun export ou téléchargement intégral local autorisé n’a été établi pour contourner ce problème; le caractère « ouvert » de l’API ne donne pas à lui seul les droits de stockage ou redistribution.

**Décision : B — à approfondir uniquement pour un export local autorisé; pas d’appel de consultation depuis SpamPatrol.** Avant toute suite, demander à l’ANRDI : licence des données et permissions de stockage/affichage/redistribution commerciale; présence et couverture France des signalements téléphoniques; schéma et volumes; éventuel export complet ou feed local; version et cadence; champs de preuve/modération; traitement des retraits, réattributions et contestations; conditions d’accès, clé, compte ou coût. Contact publié : [contact@anrdi.fr](mailto:contact@anrdi.fr). Aucun message n’a été envoyé.

### Who Called — code GPL, base et API distinctes

Le dépôt [Who Called](https://github.com/who-called/android-ios-web) présente une application française gratuite qui combine plages ARCEP et contributions anonymes, une recherche avec score 0–100 et une API communautaire Node/Express. Son README indique que le code est sous GPL-3.0; il ne donne pas de licence distincte des enregistrements de la base ni d’autorisation de téléchargement massif/redistribution. Une requête unitaire d’API transmettrait potentiellement le numéro et ne respecte donc pas le modèle local exigé; aucun snapshot téléchargeable avec droits explicites n’a été repéré.

**Décision : B — demander au mainteneur licence des données, accès snapshot/API, fréquences, quotas et règles de correction avant toute autre étude; aucune donnée intégrée.** Contact de confidentialité publié : privacy@who-called.com. L’application elle-même repose sur des signalements et un score, en conflit avec le périmètre produit actuel.

### PhoneBlock — service actuellement gratuit, mais liste authentifiée et non redistribuable

La FAQ officielle indique que PhoneBlock ne facture actuellement pas l’utilisation et sollicite des dons facultatifs pour payer son hébergement; elle ne garantit pas un financement durable. La documentation API décrit un endpoint de liste complète/incrémentale et des consultations, avec authentification Bearer/token créé via compte. La FAQ indique que la liste commune évolue selon les évaluations de plusieurs utilisateurs. Les données sont communautaires, principalement allemandes. Dans son analyse de sources, le projet CallShield indique que l’accès bulk PhoneBlock exige un compte et que ces données sont non redistribuables; cette affirmation secondaire concorde avec l’absence de licence ouverte de base dans la documentation PhoneBlock consultée, sans remplacer une confirmation du fournisseur.

**Décision : B — techniquement intéressant mais gratuité durable, droits de réutilisation et redistribution à confirmer; couverture française non quantifiée.** Une consultation directe/hashée reste exclue pour SpamPatrol car elle transmet une requête à un tiers. Un éventuel export local demanderait compte/token et autorisation écrite. [FAQ PhoneBlock](https://phoneblock.net/phoneblock/faq?lang=en) · [API](https://phoneblock.net/phoneblock/api).

### CallShield — export ouvert techniquement, centré sur les États-Unis

Le dépôt [CallShield](https://github.com/SysAdminDoc/CallShield) publie un fichier texte brut signé, mis à jour par le mainteneur, et une base JSON versionnée. Son README annonce 51 519 numéros et 674 plages; le fichier texte observé porte la version 68, datée du 16 novembre 2026, et comprend 51 519 lignes de numéros. Il est publiquement récupérable depuis [spam_numbers.txt](https://raw.githubusercontent.com/SysAdminDoc/CallShield/master/data/spam_numbers.txt); le fichier est signé et sa documentation donne une méthode de vérification. Le dépôt est MIT, mais le README des données précise que les obligations des sources amont persistent. Le manifeste identifie principalement les plaintes FCC/FTC américaines (non vérifiées) et les contributions CallShield; la liste annoncée contient aussi quelques préfixes Saracroche français dans un flux séparé, sous CC BY-NC-SA 4.0, mais ce flux n’est pas redistribuable sans les restrictions NC-SA. Le dump texte consulté ne contient aucune entrée +33 selon la recherche effectuée dans le fichier.

La licence propre aux enregistrements et les données sous-jacentes doivent être lues par source : le manifeste marque PhoneBlock et Nomorobo non redistribuables et le fichier texte exclut les sources non redistribuables. La forte majorité du dump est nord-américaine; les données FTC/FCC sont des plaintes non vérifiées et ne sont pas une réputation française. La cadence indiquée est à chaque fusion du mainteneur pour la base et toutes les six heures côté client; ce rythme de client n’est pas une garantie de livraison continue.

**Décision : C — exclu comme source de réputation française** (aucun +33 trouvé, plaintes majoritairement américaines, obligations amont, base communautaire hors cahier des charges). Intérêt méthodologique seulement : signature détachée, manifeste de provenance/licence, fraîcheur par source et maintien des erreurs hors de la base validée.

### Projets orientés uniquement attribution/préfixes

Les projets [phone-blocks](https://github.com/Protofox-Digital/phone-blocks) et [BLOCkTEL](https://github.com/leglands/blocktel) sont des exemples techniques d’exploitation de fichiers ARCEP et de filtrage local de préfixes. Le dépôt phone-blocks a été archivé le 9 juillet 2026; son code est MIT. BLOCkTEL applique des préfixes réglementaires côté appareil. Aucun de ces deux projets n’est une base de signalements individuels ou de réputation téléphonique; leur intérêt pour cette recherche est seulement de confirmer que les données ARCEP peuvent être consommées localement. Reprendre directement les données ARCEP évite d’ajouter un intermédiaire.

### SignalConso / DGCCRF — données ouvertes de plaintes agrégées, sans numéro appelant

Le portail de données du ministère publie un jeu [SignalConso](https://data.economie.gouv.fr/explore/assets/signalconso/) décrit comme une publication de données anonymisées issues du service. Au dernier état du portail consulté (modifié le **22 novembre 2026**), il comptait environ **2,18 millions d’enregistrements**. L’export propose CSV et API; le portail affiche la Licence Ouverte (Etalab) comme condition de réutilisation et permet l’export intégral après acceptation des conditions et de la licence. La fréquence de mise à jour indiquée dans les métadonnées est « non renseignée » / indéterminée.

Les champs publiquement visibles comprennent identifiant de fiche, catégorie et sous-catégorie, date de création, état de traitement, indicateurs de transmission/lecture/réponse, tags et département/région. Les catégories comprennent des sujets liés aux appels commerciaux et au démarchage abusif; des sous-catégories mentionnent les appels indésirables ou appels de rénovation. **Aucun numéro appelant n’apparaît dans le schéma/les colonnes consultés.** Il n’est donc pas possible de produire avec ce jeu une réputation par numéro, un historique de signalements d’un appelant ou un score de confiance individuel.

La donnée résume des remontées consommateurs traitées par l’administration; elle ne constitue pas une constatation de fraude pour un numéro. La publication est dite anonymisée par le producteur; SpamPatrol devrait néanmoins limiter l’usage à des agrégats réellement anonymes et vérifier les champs avant export, car une ligne datée, catégorisée et localisée peut présenter des risques de recoupement à faible volume.

**Décision : C pour la recherche de réputation téléphonique individuelle** (aucun numéro d’appelant), mais ressource officielle techniquement pertinente pour des indicateurs de plaintes agrégées si le périmètre du projet était ultérieurement révisé. La charte actuelle exclut expressément les statistiques issues des signalements; elle n’est donc pas retenue pour une intégration actuelle. Pas de recherche unitaire de numéro dans ce jeu.

## Tableau de décision A / B / C

Ce classement porte sur l’usage de SpamPatrol selon sa charte actuelle, pas sur la qualité générale des projets.

| Catégorie | Sources et décision | Motif |
|---|---|---|
| **A — exploitable** | Aucune source de réputation individuelle retenue. | Les seules sources ouvertes compatibles déjà vérifiées (ARCEP; DILA pour les contacts publics) sont des référentiels, pas de la réputation. |
| **B — à approfondir** | NoCall CSV; SignalWeb; Who Called; PhoneBlock; Saracroche. | Licence, téléchargement, droits de redistribution, gratuité durable ou voie d’accès locale insuffisamment établis; NoCall et Who Called/Saracroche sont en plus incompatibles avec l’interdiction de données communautaires de la charte sans changement de périmètre autorisé. |
| **C — exclue** | NoCall API; Hiya/Bouygues Anti-Spam; bases opérateurs privées; CallShield pour réputation française; FTC/FCC directement pour la France; SignalConso pour une réputation individuelle; services nécessitant un lookup externe. | Coût API, données privées, couverture géographique non pertinente, absence de permission ou transmission de recherche tierce. SignalConso contient des plaintes agrégées/anonymisées sans numéros d’appelants. |

## Sources institutionnelles françaises et points de contact

- **33700 / AF2M :** les signalements sont transmis aux opérateurs pour qualification; pas de dataset public/API de réputation accessible dans les pages consultées. Demander à l’AF2M s’il existe un export agrégé/public et sa licence; le mécanisme de signalement ne suffit pas à autoriser le traitement d’un numéro.
- **ARCEP :** publie les ressources et règles de numérotation; les fichiers MAJNUM ne mesurent pas les appels, plaintes ou fraudes. Demander uniquement une clarification sur les référentiels réglementaires ou leur schéma, pas une liste de suspects.
- **SignalConso / DGCCRF :** jeu public anonymisé sous Licence Ouverte, avec catégories/tendances de plaintes mais sans numéro appelant. Il n’est pas une base de réputation; sa publication statistique reste exclue par le cahier des charges actuel. [Jeu et métadonnées](https://data.economie.gouv.fr/explore/assets/signalconso/) · [Export et licence](https://data.economie.gouv.fr/explore/dataset/signalconso/export/?flg=fr-fr).
- **ANRDI / SignalWeb :** contact@anrdi.fr pour licence des données et export local, sans transmettre de numéros recherchés.
- **NoCall :** support@nocall.io pour l’interprétation de la CC BY 4.0 du CSV, son URL, sa disponibilité, son contenu, ses modalités d’actualisation et la compatibilité avec la clause anti-copie de ses conditions.
- **Saracroche :** contacter l’éditeur via son canal officiel de support/formulaire pour la licence propre aux listes, le fichier public, les seuils détaillés et les droits de redistribution; ne pas se fonder sur le code GPL/AGPL ou sur une licence mentionnée par un tiers.
- **Who Called :** privacy@who-called.com pour la licence propre aux données et l’existence d’un export tiers autorisé.
- **PhoneBlock :** demander au mainteneur les conditions spécifiques de liste bulk, droits d’affichage/stockage/redistribution, pays couverts et engagement de gratuité; les dons sollicités sont facultatifs mais le maintien du service n’est pas garanti.

Ces contacts sont des recommandations de recherche, pas des demandes envoyées. Aucun tiers n’a été contacté.

## Proposition de suite compatible avec le cahier des charges

Pour rester conforme, la piste immédiatement retenue demeure ARCEP (attribution) et, sous conditions, DILA (contacts de services publics). Pour une réputation individuelle, il faut d’abord une décision distincte du propriétaire du projet, car le cahier des charges exclut explicitement les données communautaires, listes noires et classements. Sans cette décision, même une licence CC BY n’autorise pas à élargir le produit de manière incohérente avec sa finalité.

Si le périmètre était réexaminé et une source autorisée identifiée : obtenir d’abord les permissions écrites; importer seulement un fichier de masse officiellement publiable, sans envoyer les recherches; vérifier HTTPS, taille, signature ou empreinte fournie, schéma, valeurs, date et changements de volume; conserver URL, version, date, empreinte et règles de retrait; séparer ce fichier des jeux ARCEP; afficher catégorie et source comme « signalements communautaires modérés », avec nombre/date et limites, jamais comme « fraude confirmée »; définir une procédure de rectification/retrait et une durée maximale de conservation. Les fichiers JSON de l’architecture actuelle suffisent théoriquement à un instantané de taille raisonnable; aucun service, base SQL, nouvelle dépendance ou code n’est proposé dans cette mission.

Ne pas importer un snapshot pour une recherche unitaire. Si la source ne publie pas d’export autorisé, l’abandonner plutôt que de transmettre le numéro recherché à son API.

## Limites de cette investigation

- L’URL effective du fichier CSV NoCall et son contenu binaire n’ont pas pu être validés indépendamment; le compteur visible France indiquait zéro, avec des différences de cache entre instantanés de page.
- La documentation Swagger et l’API technique SignalWeb n’étaient pas accessibles lors de la vérification (erreur 502); aucun appel portant sur un numéro n’a été tenté.
- Les conditions de données de PhoneBlock ne sont pas une licence publique complète; l’indication de non-redistribution provient également d’un projet tiers et doit être confirmée par PhoneBlock.
- Les pages des projets communautaires peuvent changer. Les statuts décrits sont ceux constatés le 25 novembre 2026.
- Cette étude documentaire n’est pas un avis juridique. Une mise en production de données relatives à des numéros de personnes physiques demande une analyse juridique et RGPD spécifique.

Des projets comme [NonMerci](https://github.com/alex14fr/NonMerci) montrent qu’un blocage local de plages de démarchage est techniquement possible, mais ne constituent pas une base de réputation individuelle. Les plages doivent être prises directement dans le référentiel ARCEP. Un endpoint interne/non documenté n’est pas une API autorisée.

## Conformité au projet et limites

L’architecture actuelle décrit SpamPatrol comme un observatoire pédagogique indépendant centré sur l’ARCEP, construit en React, Node.js/Express et JSON. Les fonctions communautaires ont été retirées; la cible exclut signalements, liste noire et classement communautaire. Les recherches ne doivent pas être conservées. Chaque affichage doit préciser source, date, méthode et limites. Documents consultés : docs/ARCHITECTURE.md, docs/DEVELOPMENT_STATUS.md, docs/ROADMAP.md, docs/ARCEP.md et docs/cahier_des_charges.docx.

Un téléphone peut être une donnée personnelle lorsqu’il identifie directement ou indirectement une personne. Le fait qu’un numéro soit public ne suffit pas à autoriser son enrichissement, profilage ou republication. La CNIL rappelle les principes de finalité, base légale, information, minimisation, durée et droits. [Définition](https://www.cnil.fr/fr/definition/donnee-personnelle) · [Réutilisateurs de données publiées](https://www.cnil.fr/fr/recommandations-reutilisateurs-donnees-internet).

La loi n° 2025-594 du 30 juin 2025 a changé le régime du démarchage téléphonique à compter du 11 août 2026, généralisant le consentement préalable sous réserve des exceptions légales. Cela ne transforme pas les plages en listes de fraude. Toute présentation juridique devra être datée et vérifiée. [Loi](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051824277) · [Code de la consommation](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441/2026-08-11).

Risques à encadrer :

- Un signalement, vote, score opaque ou plainte non vérifiée ne démontre pas une fraude; les numéros peuvent être usurpés ou réattribués.
- Une plage réglementaire ne désigne pas son utilisateur; une entreprise peut appeler légitimement et subir un faux positif.
- Ne pas collecter ou publier des numéros individuels communautaires. Ne conserver ni recherche, ni hash, ni historique; examiner aussi journaux d’hébergement et proxys.
- Confirmer séparément accès, licence, stockage, modification, affichage, usage commercial, redistribution, attribution, mise à jour et retrait. Une licence de code ne couvre pas les données.

## Recommandations

1. Garder MAJNUM et Identifiants CE comme références d’attribution et de dénomination à la date du jeu; documenter source officielle, licence, version, empreinte, transformation et fraîcheur.
2. Envisager la DILA uniquement pour les contacts publics de services administratifs, avec attribution, minimisation et répercussion des retraits. Ne pas l’utiliser pour valider un appelant.
3. Ne pas créer de score individuel à partir de ces référentiels : ils ne mesurent aucun comportement d’appel.
4. Garder séparées plages réglementaires, identités publiques et déclarations communautaires; ne jamais présenter les signalements comme faits confirmés.
5. Exclure les bases privées; ne pas scraper ou extraire d’endpoints non documentés.

## Architecture future théorique

Si un besoin est décidé plus tard, l’architecture actuelle suffit pour les sources ouvertes :

1. Valider une fiche avant ingestion : producteur, URL, licence/version, format, fréquence, champs, retraits et limites. Bloquer toute source incertaine.
2. Télécharger les exports officiellement publiés côté backend; valider schéma, taille, date et intégrité; conserver des instantanés versionnés et activer une génération seulement après validation. Réutiliser le processus décrit dans la documentation ARCEP du projet.
3. Garder les sources dans des jeux, métadonnées et contrôles distincts; éviter les rapprochements qui infèrent une réputation.
4. Retourner uniquement le champ nécessaire avec source/date/méthode/limites; ne transmettre les recherches à aucun fournisseur et ne pas les journaliser.
5. Suivre la fraîcheur, répercuter les retraits et prévoir une correction; distinguer « absent du référentiel », « attribution déclarée », « contact public » et « réputation ».

Cette proposition n’autorise pas l’usage d’une source incertaine. Aucun code d’intégration n’a été créé.

## Conclusion

Une information gratuite est possible pour la numérotation réglementaire et certains contacts institutionnels. SignalConso offre également des statistiques anonymisées de plaintes, sans numéros appelants et hors périmètre de publication actuel. Pour une réputation individuelle, la piste NoCall est un CSV explicitement annoncé sous CC BY 4.0, mais le jeu français était vide au dernier état vérifié, l’URL/réponse CSV reste à valider et la portée de la permission au regard des conditions générales demande une confirmation. Les autres bases de réputation trouvées restent privées ou communautaires avec accès et droits insuffisamment établis. Aucune source ne remplit aujourd’hui tous les critères de gratuité durable, de fiabilité, de réutilisation et de compatibilité avec le cahier des charges.

### Références principales

- [ARCEP – numérotation](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique) · [Extranet](https://extranet.arcep.fr/communications-electroniques/numerotation) · [Licence Ouverte 2.0](https://www.data.gouv.fr/pages/legal/licences/etalab-2.0)
- [DILA – base administrative](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales/) · [API](https://dila.gouv.fr/services/api/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr/article/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr)
- [Saracroche – listes](https://saracroche.org/fr/help/blocked-numbers/) · [accès](https://saracroche.org/fr/help/database-downloadable/) · [mentions légales](https://saracroche.org/fr/legal-notice/) · [confidentialité](https://saracroche.org/fr/privacy/)
- [Who Called](https://github.com/who-called/android-ios-web) · [FTC – API](https://www.ftc.gov/policy-notices/open-government/data-sets/do-not-call-data)
- [CNIL – données personnelles](https://www.cnil.fr/fr/definition/donnee-personnelle) · [réutilisation](https://www.cnil.fr/fr/recommandations-reutilisateurs-donnees-internet)
