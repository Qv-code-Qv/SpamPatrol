# Étude des référentiels anti-spam des opérateurs téléphoniques

**Projet :** SpamPatrol  
**Date de consultation :** 25 novembre 2026  
**Nature :** étude documentaire et technique, sans intégration de données.

## 1. Résumé exécutif

Les opérateurs et fournisseurs disposent effectivement de systèmes anti-spam alimentés par des bases, des signalements, des événements d’appels et des modèles de réputation. Les recherches n’ont toutefois identifié **aucune base anti-spam d’Orange, SFR, Bouygues Telecom ou Free publiée sous une licence permettant à SpamPatrol de la télécharger, de la stocker et de la redistribuer**.

Deux exceptions apparentes ne changent pas ce constat :

- Orange documente le téléchargement d’une base locale dans Orange Téléphone/Orange et moi, son appui sur des plages ARCEP, des signalements communautaires et des mécanismes automatiques. Le fichier, son schéma et une licence de redistribution ne sont pas publiés. La documentation mobile indique une mise à jour automatique à l’ouverture de l’application ; une autre FAQ Orange indique une périodicité de 24 heures. Cette base reste une ressource interne au service Orange.
- Hiya documente un cache téléchargeable `.tsv.gz` de numéros avec réputation `SPAM` ou `FRAUD`. Son accès est destiné aux partenaires disposant d’identifiants et soumis à des conditions contractuelles distinctes, avec politique d’utilisation des données imposée. La documentation ne donne pas de droit public de redistribution dans SpamPatrol. C’est une piste de partenariat à négocier, pas une source ouverte.

Bouygues Telecom a confirmé en septembre 2026 le recours à Hiya pour son nouveau service Anti-Spam réseau. SFR et Free décrivent des filtrages et listes gérés par l’opérateur, mais ne publient ni fichiers, ni API de réputation, ni méthode détaillée de qualification. Les services grand public Google Phone et Samsung Smart Call n’exposent pas de référentiel librement téléchargeable ; Samsung indique utiliser Hiya pour Smart Call. Les produits First Orion et TNS apparaissent comme offres professionnelles sous contrat ; aucune preuve consultée ne les relie à un référentiel ouvert destiné au marché français.

**Recommandation :** ne pas construire SpamPatrol en recopiant les listes des opérateurs ou leurs résultats de réputation. Continuer à s’appuyer sur les données ARCEP pour les ressources, plages, catégories réglementaires et attributaires ; ajouter éventuellement des données DILA pour les contacts institutionnels publiés et licenciés. Étudier une offre fournisseur uniquement dans le cadre d’un accord écrit couvrant la réutilisation publique et commerciale, l’actualisation, l’attribution, la correction et la redistribution. En l’absence d’un tel accord, ne pas intégrer ces données.

Cette approche rejoint le cahier des charges : SpamPatrol est un observatoire pédagogique indépendant, privilégie MAJNUM, ne qualifie pas une attribution de spam, ne réintroduit pas de référentiel communautaire actif et doit conserver provenance, dates et limites. Son architecture demeure React, Node.js/Express et JSON, maintenue simplement par une seule personne, sans base SQL prévue. Voir `docs/cahier_des_charges.docx`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_STATUS.md`, `docs/ROADMAP.md` et `docs/ARCEP.md`.

## 2. Méthodologie et degré de preuve

Les pages officielles d’assistance, de produit, les conditions/API publiées, les fiches data.gouv.fr, les pages ARCEP et les textes réglementaires ont été privilégiés. Les éléments techniques sont qualifiés comme suit :

- **Confirmé officiellement** : indiqué par l’opérateur, le fournisseur ou l’institution dans sa documentation publique.
- **Secondaire** : communiqué ou publication d’un tiers ; utile comme piste, insuffisant pour prouver un droit ou un accès.
- **Non établi** : aucun fichier, contrat, API publique ou lien d’usage n’a été identifié dans les documents consultés. Cela ne prouve pas l’absence de données internes.

Les recherches n’ont pas contourné d’authentification, de mécanisme technique ou de restriction d’accès. Les consultations de pages produit ne donnent pas accès aux bases sous-jacentes. La date indiquée en tête est celle de la consultation des pages citées ; leurs dates de publication ou de modification sont reportées lorsqu’elles sont affichées par la source.

## 3. Étude par opérateur

### 3.1 Orange — Orange Téléphone et Orange et moi

**Fonctionnement documenté.** La documentation Orange mise à jour le 23 novembre 2026 indique que la protection d’appels utilise la liste ARCEP et des signalements de la communauté. Elle distingue les appels « indésirables », « démarchage ou démarchage potentiel » et « approuvé ou approuvé majoritairement ». Orange précise que la base anti-spam est téléchargée localement et se met à jour automatiquement lorsque l’utilisateur ouvre régulièrement l’application. Une FAQ Orange Téléphone Pro indique ailleurs que la liste téléchargée est mise à jour toutes les 24 heures. Ces documents ne décrivent ni une fréquence garantie pour toutes les versions, ni le format ou la structure du fichier.

**Fichier/référentiel.** Une base locale est confirmée, mais aucun nom de fichier, URL publique de téléchargement, schéma JSON/CSV/XML/SQLite, API publique ou dépôt source n’a été trouvé. Il est donc impossible d’en auditer les entrées, doublons, dates de signalement, mécanismes de retrait ou niveau de précision. L’application mentionne les avis communautaires, la réglementation ARCEP et des algorithmes de détection ; les règles de seuil, vérification humaine, poids des signalements et procédures de contestation n’étaient pas exposées dans les pages consultées.

**Droits.** La disponibilité de la base dans une application Orange ne vaut pas licence de stockage ni de redistribution dans une application tierce. Aucune licence ouverte de la base n’a été publiée. Les avis ou numéros associés à des personnes physiques peuvent impliquer des données à caractère personnel. **Classement : C pour l’importation/redistribution en l’état ; B comme piste de partenariat si Orange délivre une autorisation et une documentation.**

Sources : [Orange — protection des appels sur iOS, Orange et moi](https://assistance.orange.fr/livebox-modem/toutes-les-livebox-et-modems/installer-et-utiliser/piloter-et-parametrer-votre-materiel/l-application-mobile-orange-et-moi/orange-et-moi-tout-savoir-sur-l-anti-spam-appels-ios-_442605-972089) ; [Orange — dépannage Orange Téléphone Pro (FAQ base mise à jour toutes les 24 h)](https://assistancepro.orange.fr/telephone_mobile/utiliser_une_application_orange/orange_telephone_pro/orange_telephone_pro_depannage-x925558) ; [fiche officielle Orange Téléphone](https://applications-et-logiciels.orange.fr/applications/orange-telephone).

### 3.2 SFR

**Fonctionnement documenté.** SFR décrit un service Antispam voix activé par défaut sur les lignes concernées. Le filtrage peut bloquer des appels considérés comme douteux, par exemple des tentatives de fraude, hameçonnage, démarchage abusif ou ping call. L’abonné peut demander sa désactivation au service client. Pour les lignes fixes, SFR propose également des outils de filtrage par numéros depuis la box, avec consultation du nombre d’appels filtrés.

**Fichier/référentiel.** Aucune liste de réputation SFR téléchargeable, API publique, format de données, fréquence de mise à jour, dépôt public ou méthodologie de classement n’a été trouvé. La page SFR renvoie le consommateur vers le 33700 pour signaler certains appels ; elle ne dit pas que ces signalements alimentent directement la liste Antispam voix, ni selon quels critères.

**Droits.** Base et méthode non publiques ; aucune licence ou droit de redistribution repéré. **Classement : C comme source de données exploitable en l’état ; B pour une demande de partenariat/documentation adressée à SFR.**

Sources : [SFR — reconnaître et signaler un appel ou message frauduleux](https://assistance.sfr.fr/sfrmail-appli/phishing-spam/email-phishing-sms-frauduleux.html) ; [SFR — filtrer les appels entrants sur box NB6](https://assistance.sfr.fr/internet-tel-fixe/tel-fixe/filtrer-appels-ligne-fixe-sfr-via-box-nb6.html).

### 3.3 Bouygues Telecom

**Fonctionnement documenté au jour de l’étude.** Bouygues a annoncé le 28 septembre 2026 son service Anti-Spam intégré au réseau mobile, développé avec Hiya. Le service analyse les appels entrants VoLTE/VoWiFi en temps réel et fournit une alerte ; la page commerciale annonce une base « constamment mise à jour » et des algorithmes d’IA évaluant notamment l’ancienneté du numéro, le volume d’appels et leur durée. Bouygues indique que certaines données d’appel sont traitées en France par Hiya puis supprimées à la volée, sous réserve de données non identifiantes conservées pour l’amélioration du service. L’opérateur reconnaît la possibilité de faux positifs. Les détails publics ne permettent pas de reproduire le modèle ou les seuils.

**Fichier/référentiel.** Aucun fichier, export, flux public ou dépôt de la base utilisée par Bouygues/Hiya n’est publié dans les documents consultés. Les mentions de « plus de 28 milliards d’événements d’appels par mois » et « plus de 550 millions d’utilisateurs dans le monde » viennent du communiqué Bouygues et sont des chiffres de présentation du fournisseur ; elles ne sont pas une mesure auditable de couverture française.

**Droits.** Le service est fourni sous offre payante et les données traitées alimentent un service réseau ; aucune licence de redistribution de la base ou de ses verdicts n’est proposée publiquement. **Classement : C comme source téléchargeable ; B comme partenaire potentiel, sous contrat explicite autorisant le produit envisagé.**

Sources : [Bouygues Telecom — offre Anti-Spam et traitement par Hiya](https://www.bouyguestelecom.fr/option-mobile/anti-spam/) ; [communiqué Bouygues du 28 septembre 2026](https://www.corporate.bouyguestelecom.fr/archives-communique-presse/bouygues-telecom-lance-anti-spam-alerter-sur-les-appels-potentiellement-frauduleux-grace-a-lia-integree-au-reseau/) ; [assistance Bouygues sur les signalements et le 33700](https://www.assistance.bouyguestelecom.fr/s/article/spam-sms-appels-indesirables-mobile).

### 3.4 Free Mobile et Freebox

**Free Mobile.** L’assistance Free décrit l’Antispam voix, activé par défaut, comme un filtrage fondé sur une liste établie par Free. L’abonné peut le désactiver ou rediriger les appels concernés vers sa messagerie. Free ne publie pas les numéros de la liste, son format, la provenance de ses entrées, sa fréquence de mise à jour ou les critères qui font qu’un appel est « douteux ».

**Freebox.** Pour le fixe, Free indique qu’une liste de numéros indésirables est établie et gérée par Free. La documentation publique décrit l’activation/désactivation, pas le contenu ou les modalités de mise à jour. Le filtrage d’appels et SMS configuré par l’abonné dans l’Espace Mobile Free est un mécanisme distinct : il permet à l’utilisateur de créer ses propres règles pour des numéros précis ou des plages, sans constituer une base anti-spam générale.

**Droits.** Aucune base publique ou licence de réutilisation n’a été identifiée. **Classement : C pour les listes opérateur ; B pour un échange de partenariat éventuel.**

Sources : [Free — Antispam voix mobile](https://assistance.free.fr/articles/883) ; [Free — filtrage des appels non sollicités Freebox](https://assistance.free.fr/articles/549) ; [Free — règles de filtrage personnelles des appels/SMS](https://assistance.free.fr/articles/896).

## 4. Fournisseurs spécialisés et outils des appareils

### 4.1 Hiya

Le partenariat Bouygues/Hiya est confirmé officiellement en 2026. Samsung confirme également que Smart Call s’appuie sur Hiya dans les régions où la fonction est disponible. Cela prouve des usages communs de la technologie Hiya, **pas le partage libre de la même base, la même configuration ou les mêmes étiquettes entre opérateurs**.

Hiya publie une documentation technique pour deux voies distinctes :

1. **Hiya Protect Spammer Cache** : téléchargement d’un fichier gzip TSV (`.tsv.gz`) via API, avec numéro, niveau `SPAM`/`FRAUD` et catégorie numérique parfois absente. L’URL de téléchargement signée est temporaire. La doc précise qu’il faut signer des conditions d’utilisation séparées et rendre la politique d’utilisation des données accessible à l’utilisateur final.
2. **Number Reputation API** : statut et métriques d’engagement pour des numéros d’entreprises enregistrés ; accès payant après accord de service. Le produit sert à la gestion de réputation des entreprises et ne constitue pas une licence générale de republication d’une liste de tous les numéros suspects.

Les classifications sont dynamiques, probabilistes et fondées sur le comportement observé/les interactions ; Hiya prévoit aussi un mécanisme de recours (« redress ») pour une entreprise estimant que ses numéros sont étiquetés à tort. Une réponse `SPAM` ou `FRAUD` est le verdict du fournisseur à un moment donné, pas une décision officielle ni une preuve judiciaire. Aucune licence libre n’est proposée dans la documentation consultée ; disponibilité API ≠ droit de redistribution.

**Classement : B — techniquement intéressant sous accord.** C’est la piste privée la plus concrète, mais elle exige une négociation écrite sur droit de stockage, affichage des verdicts, cache local, redistribution, territoires, durée, attribution, contestation, correction, conservation et fin de contrat. Le coût et l’éligibilité commerciale de SpamPatrol ne sont pas publiquement établis.

Sources : [Hiya Protect — format et conditions du Spammer Cache](https://developer.hiya.com/docs/protect/cache/endpoints/v-1-get-spammer-cache) ; [Hiya — accès aux APIs et exigences d’accord](https://connect-support.hiya.com/hc/en-us/articles/55700147155987-Hiya-APIs-what-is-available-plan-eligibility-and-how-to-request-access) ; [Hiya Number Reputation — portée et accès](https://developer.hiya.com/docs/guides/voice-protection/number-reputation/get-started) ; [Hiya — usage et contestation des verdicts](https://developer.hiya.com/docs/guides/voice-protection/number-reputation/use-reputation-data).

### 4.2 First Orion

First Orion commercialise des solutions de réputation, d’authentification et d’affichage d’appels aux entreprises et aux opérateurs. Sa documentation API indique qu’il faut obtenir un accès au portail/à l’API auprès de l’entreprise. Les pages de support consultées concernent l’enregistrement de numéros d’entreprises et le contrôle de leur statut, pas la publication d’un flux ouvert de numéros signalés. Les informations destinées au client ou les étiquettes de chaque opérateur peuvent différer ; First Orion précise que les résultats de présentation dépendent aussi des analyses de l’opérateur.

Aucun élément public consulté ne prouve l’utilisation par Orange, SFR, Bouygues ou Free en France. Aucun jeu ouvert ou licence de redistribution d’une base anti-spam globale n’a été trouvé. **Classement : C comme données publiques ; B seulement si un accord commercial adapté est offert.**

Sources : [First Orion — accès à une clé API](https://support.firstorionenterprise.com/hc/en-us/articles/27590654141453-How-do-I-generate-an-API-Key) ; [First Orion — portée des enregistrements pour opérateurs](https://support.firstorionenterprise.com/hc/en-us/articles/46371973004941-What-Carriers-Will-Receive-My-Registration-Information) ; [conditions First Orion](https://firstorion.com/legal).

### 4.3 TNS

TNS Call Guardian décrit une solution destinée aux opérateurs, s’appuyant sur événements d’appels en temps réel et contributions communautaires pour calculer des profils de réputation. La documentation produit et les rapports consultés relèvent d’une offre fournisseur et mentionnent des données confidentielles. Aucun flux public européen, dépôt ouvert, licence de redistribution ou adoption française identifiée. La présence de TNS sur le marché mondial n’est pas une preuve qu’un opérateur français utilise son référentiel.

**Classement : C comme source ouverte ; B uniquement pour une négociation de contrat et une vérification de couverture en France.**

Sources : [TNS Call Guardian — fiche produit](https://tnsi.com/wp-content/uploads/2024/08/CM_ProductSheet_CallGuardian_JUL2024.pdf) ; [rapport TNS et méthode annoncée](https://tnsi.com/wp-content/uploads/2024/10/TNS_2024_Q3_Robocall-Report_FINAL.pdf).

### 4.4 Truecaller

Truecaller utilise des signalements et données communautaires pour l’identification d’appelants et la réputation. Son API n’est pas une base libre : l’API License Addendum accorde un droit limité pour l’application du client, interdit la redistribution du contenu sauf accord écrit contraignant et non moins restrictif. Les conditions générales interdisent également le scraping/extraction automatisée et réservent les usages commerciaux/API à des accords spécifiques.

**Classement : C pour réutilisation des listes visibles dans l’app ou scraping ; B pour une intégration API uniquement si un accord écrit autorise expressément l’affichage commercial des réponses dans SpamPatrol.** Aucun feed ouvert de numéros n’a été trouvé.

Sources : [Truecaller — API License Addendum](https://www.truecaller.com/api-license-addendum) ; [conditions d’utilisation](https://www.truecaller.com/terms-of-service) ; [conditions UE et interdiction de scraping](https://www.truecaller.com/privacy/our-privacy-policy/terms-conditions/row).

### 4.5 Google Phone

Google explique que l’identification et la protection anti-spam peuvent impliquer l’envoi d’informations d’appel à Google ; son système compare à une base de spammeurs/appels automatisés connus et permet des signalements. Certains traitements Call Screen sont distincts : l’audio/transcription reste sur l’appareil sauf partage volontaire selon la documentation consultée. Aucun fichier JSON/CSV/SQLite de réputation ni API de lookup publique redistribuable n’a été identifié.

**Classement : C comme source de données à importer ;** l’utilisation des fonctions dans l’application Google ne donne aucun droit de collecte ou d’extraction des verdicts.

Sources : [Google — fonctionnement de l’identification et du signalement](https://support.google.com/phoneapp/answer/3459196?hl=en-ca) ; [Google — confidentialité Call Screen](https://support.google.com/phoneapp/answer/9094888).

### 4.6 Samsung Smart Call

Samsung indique que Smart Call identifie des appelants inconnus et fournit une protection spam, et que la fonctionnalité est fournie par Hiya. Cela confirme la relation Samsung/Hiya mais ne donne pas accès au cache Hiya utilisé par Samsung. La disponibilité varie selon marché/appareil ; aucun référentiel Samsung réutilisable ou export public n’a été trouvé.

**Classement : C comme source de données ; B comme indice sur l’écosystème fournisseur, sans preuve d’accès/licence.**

Sources : [Samsung UK — Smart Call](https://www.samsung.com/uk/apps/smart-call/) ; [assistance Samsung](https://www.samsung.com/uk/support/mobile-devices/how-do-i-use-the-call-functions-on-my-device/) ; [Hiya — Smart Call powered by Hiya](https://www.hiya.com/samsung/products-smart-call).

## 5. Sources officielles et mécanismes de signalement

### 5.1 ARCEP : ressource et réglementation, pas réputation anti-spam

Le jeu ARCEP « Ressources en numérotation téléphonique » fournit MAJNUM, GELNUM, MAJPORTA, MAJNFB et d’autres fichiers en CSV complet, séparé par `;`, avec les ressources et tranches attribuées et des identifiants associés. La fiche data.gouv.fr affiche une Licence Ouverte. Les fichiers sont mis à jour après les collèges de l’ARCEP ; la date courante de chaque fichier est publiée sur l’extranet.

MAJNUM décrit l’attribution réglementaire de ressources à des opérateurs/attributaires. Ce n’est pas une base d’appels, de réputation ou de fraude. L’attributaire n’est pas nécessairement l’opérateur qui sert actuellement l’utilisateur final après portabilité. Le plan de numérotation et la décision n° 2022-1583 permettent d’identifier les plages associées à l’usage par des systèmes automatisés, mais ne qualifient pas le comportement d’un appel individuel.

Depuis le 11 août 2026, le régime français prévoit en principe le consentement préalable du consommateur au démarchage téléphonique, avec les exceptions prévues par les textes. Il faut donc présenter les plages réglementaires dans leur contexte historique et juridique actuel, sans les transformer en liste de spam autorisé ou en accusation concernant un numéro particulier.

Sources : [ARCEP — dataset ressources](https://www.data.gouv.fr/datasets/ressources-en-numerotation-telephonique) ; [extranet ARCEP — fichiers et dates](https://extranet.arcep.fr/communications-electroniques/numerotation) ; [décision n° 2022-1583](https://www.arcep.fr/uploads/tx_gsavis/22-1583.pdf?v=1671463459) ; [loi n° 2025-594](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051824277) ; [Code de la consommation, article L. 223-1 en vigueur le 11 août 2026](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032221441/2026-08-11).

**Classement : A** pour l’usage réglementaire documenté et limité à ce que les champs signifient. Licence exacte/version et mention d’attribution à vérifier sur la fiche de chaque ressource avant import ; `docs/ARCEP.md` consigne déjà les modalités d’attribution pour les données localement utilisées.

### 5.2 33700 : signalements examinés par l’opérateur, pas open data

L’AF2M décrit un parcours de signalement par SMS et une phase de qualification conduite par l’opérateur concerné ; si le signalement est confirmé, des mesures peuvent suivre. Il s’agit d’un mécanisme opérationnel de lutte contre les spams SMS/vocaux, mais les pages publiques consultées ne proposent ni téléchargement des signalements individuels, ni API de réputation, ni licence permettant de redistribuer ces données. L’AF2M affiche des volumes historiques (par exemple chiffres 2013) qui ne doivent pas être présentés comme un état courant.

**Classement : B comme voie de signalement institutionnelle ; C comme référentiel importable en l’absence de jeu ouvert et de licence.** Le fait qu’un opérateur qualifie un signalement pour son action ne rend pas la donnée publique ni libre de droits.

Source : [AF2M — dispositif 33700](https://af2m.org/33700-2/).

### 5.3 DILA — contacts publics institutionnels

Le référentiel de l’organisation administrative de l’État et l’API de l’annuaire de l’administration/service public peuvent apporter des noms et coordonnées de services publics, y compris des téléphones de guichets. Data.gouv.fr mentionne la Licence Ouverte 2.0 pour le référentiel et sa documentation expose les obligations d’attribution et de version/date. C’est une bonne source pour afficher le numéro de contact publié d’une administration, avec URL et date de vérification. Ce n’est ni une liste anti-spam, ni un registre de l’ensemble des entreprises appelantes.

**Classement : A** pour une éventuelle fonction limitée de vérification des coordonnées publiques institutionnelles, après vérification de la licence et des champs exacts du jeu importé.

Sources : [DILA — Référentiel de l’organisation administrative de l’État](https://www.data.gouv.fr/datasets/referentiel-de-lorganisation-administrative-de-letat) ; [DILA — API annuaire et conditions de réutilisation](https://dila.gouv.fr/services/api/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr/article/api-annuaire-de-l-administration-et-des-services-publics-service-public-fr) ; [DILA — fiche de la Base de données locales](https://www.data.gouv.fr/fr/datasets/service-public-fr-annuaire-de-l-administration-base-de-donnees-locales/).

### 5.4 INSEE/SIRENE — identité légale, pas numéro de téléphone

SIRENE aide à identifier les établissements et entreprises (SIREN/SIRET, dénomination, activité, état administratif, adresse selon les règles de diffusion). Ce n’est pas un annuaire téléphonique exhaustif et ne permet pas de déduire qu’une entreprise est l’utilisateur d’un numéro appelant. L’INSEE précise que les numéros de téléphone des personnes physiques ne sont pas diffusés depuis le répertoire SIRENE.

**Classement : A pour l’identité administrative d’une organisation dans son périmètre ; C pour la prétention d’y trouver le propriétaire d’un numéro à partir de MAJNUM ou d’un appel reçu.** Une relation numéro-organisation exige une source distincte qui établit explicitement cette relation.

Source : [INSEE — informations SIRENE non diffusées](https://www.insee.fr/fr/information/6790269?question=quelles-sont-les-informations-du-repertoire-sirene-diffusees-par-l-insee).

## 6. Tableau comparatif des référentiels

| Source | Producteur | Type de données | Format | Provenance vérifiable | Mise à jour | Licence | Stockage autorisé | Redistribution autorisée | Utilité SpamPatrol |
|---|---|---|---|---|---|---|---|---|---|
| Orange Téléphone / Orange et moi | Orange | Avis communauté, réglementation ARCEP, algorithmes ; statuts d’appels | Base locale téléchargeable dans l’app ; format non publié | Partiellement : description fonctionnelle officielle, pas de données inspectables | Auto à l’ouverture régulière ; FAQ distincte indique 24 h | Aucune licence de base publiée | Non établi pour un tiers | Non établie | Piste partenariat, pas import en l’état |
| SFR Antispam voix | SFR | Filtrage réseau d’appels suspects/indésirables | Non publié | Fonctionnement général confirmé, contenu interne non documenté | Non publiée | Aucune licence de base publiée | Non établi | Non établie | Faible sans accord et schéma |
| Bouygues Anti-Spam + Hiya | Bouygues / Hiya | Réputation comportementale, événements et modèle IA | Service réseau, aucun fichier public | Partenaire et méthode générale confirmés | « constamment mise à jour » selon Bouygues, cadence exacte non publiée | Offre contractuelle ; licence data non publique | Non établi hors service | Non établie | Potentiellement pertinent sous contrat |
| Free Antispam voix/fixe | Free | Listes internes d’appels douteux/indésirables | Liste interne non publiée | Existence confirmée, provenance détaillée non publiée | Non publiée | Aucune licence de base publiée | Non établi | Non établie | Pas exploitable en l’état |
| Hiya Protect cache | Hiya | Numéro et verdict SPAM/FRAUD, catégorie facultative | `.tsv.gz`, TSV tabulé | Format/champs documentés par le fournisseur | Cache courant ; fréquence annoncée non spécifiée dans l’extrait public consulté | Conditions contractuelles requises | Selon contrat, accès réservé aux partenaires | Non accordée par la seule documentation | Meilleure piste fournisseur, accord requis |
| First Orion | First Orion | Réputation, enregistrement et authentification d’appels | API/portail sous accès | Documentation API publique, données non ouvertes | Selon service/contrat | Licence d’accès limitée | Pour clients selon conditions | Pas de redistribution libre | Faible sans contrat France adapté |
| TNS Call Guardian | TNS | Événements temps réel et données crowd-sourcées | Solution privée/opérateur | Méthode générale annoncée, base non publique | Temps réel annoncé pour le service | Conditions commerciales/confidentialité | Non établi pour SpamPatrol | Non établie | Partenariat à étudier uniquement si offre locale |
| Truecaller | Truecaller | Réputation communautaire, identification | App/API licenciée | Source générale décrite ; entrées non auditées individuellement | Service propriétaire | API Addendum | Accès limité selon accord | Redistribution interdite sauf accord écrit | À exclure en l’état |
| Google Phone | Google | Base de réputation Google, signalements, fonctions d’écran | Base distante et fonctions appareil ; export non publié | Principes de service documentés | Non publiée | Conditions Google, pas licence data | Pas de droit de copie établi | Non | Pas source de référentiel |
| Samsung Smart Call / Hiya | Samsung / Hiya | Identification d’appelant et spam | Fonction appareil ; export non publié | Partenaire confirmé selon la région | Non publiée | Conditions de service/fournisseur | Pas établi | Non | Confirme l’écosystème Hiya seulement |
| 33700 | AF2M et opérateurs | Signalements SMS/vocaux et qualification par opérateur | SMS/formulaire ; dataset non trouvé | Processus documenté | Activité opérationnelle ; export/fréquence non publié | Pas de licence de jeu trouvée | Données individuelles non accessibles en open data | Non établie | Source de signalement, pas base importable |
| ARCEP MAJNUM/jeux liés | ARCEP | Attribution de ressources, plages, attributaires et catégories techniques | CSV complet `;` | Oui, source primaire | Après décisions/collèges ; dates publiées | Licence Ouverte affichée sur data.gouv.fr | Oui selon licence et conditions exactes du fichier | Oui sous obligations applicables | Référence réglementaire du projet |
| DILA Annuaire | DILA / administrations | Coordonnées publiées de services publics | API et exports structurés selon jeu | Oui, service public | Selon jeu/API | Licence Ouverte 2.0 annoncée pour les jeux indiqués | Oui sous conditions | Oui sous attribution/licence | Contacts institutionnels vérifiés |
| SIRENE | INSEE | Identité et caractéristiques administratives des entreprises | Fichiers/API selon service | Oui | Selon publication INSEE | Conditions/licences propres au service | Selon conditions du jeu utilisé | Selon conditions du jeu utilisé | Identité organisationnelle, pas téléphone/spam |
| Begone Simon Perols / Jérôme Fresnay | Fournisseurs/mainteneurs non vérifiés complètement | Mélange allégué de signaux communautaires et/ou plages réglementaires | Fichiers exacts non tous identifiés | Insuffisante pour l’intégration | Non établie de façon fiable | Droits non établis pour chaque source | Non validé | Non validée | Comparateur uniquement ; ne pas intégrer |

## 7. Qualification, mises à jour et contestation

| Acteur/source | Base de qualification publiquement décrite | Contestation/correction publique | Limite pour SpamPatrol |
|---|---|---|---|
| Orange | Signaux communautaires + ARCEP + algorithmes ; catégories parfois potentielles/majoritaires | L’app permet de donner un avis/signaler ; règles de recours détaillées non trouvées | Catégories et seuils opaques ; ne pas transposer des étiquettes sans données/licence |
| SFR | Filtrage d’appels à caractère douteux ; critères non publiés | Désactivation par l’abonné ; canal 33700 pour certains signalements | Aucun jeu de référence ni statut d’entrée visible |
| Bouygues/Hiya | Modèle IA, signaux de volume, durée, ancienneté, événements globaux annoncés | Hiya documente un mécanisme de redress pour les entreprises dans son produit de réputation | Probabilité et comportement observé ne sont pas preuve juridique ; faux positifs reconnus |
| Free | Liste interne établie par Free ; détails non publiés | Désactivation/paramétrage par abonné ; pas de recours par numéro documenté | Base non auditable |
| 33700 | Signalements consommateur puis qualification de l’opérateur concerné | Parcours de signalement public ; publication des résultats non documentée | Signalement ne vaut pas verdict public réutilisable |
| ARCEP | Décisions, plan de numérotation et fichiers d’attribution | Procédures institutionnelles de signalement/correction, décisions publiées | Règle/attribution uniquement, pas réputation ni usage réel |
| Hiya API | Réputation dynamique, métriques de comportement et retours des destinataires | Redress fournisseur pour entreprise qualifiée | API ne rend pas la base publique et l’accord régit les usages |

Les fréquences « temps réel », « constamment mise à jour » et quotidiennes ont été rapportées telles que les décrivent les fournisseurs. Sauf date/versions exposées à un tiers, elles ne permettent pas à SpamPatrol d’afficher un horodatage vérifiable par numéro. Il faudrait contractualiser la fraîcheur et demander un identifiant de version, un `updatedAt`, une politique de retrait et une procédure de correction.

## 8. Réutilisation, confidentialité et modèle Freemium

Il faut distinguer accès dans une app, consultation par un utilisateur, téléchargement par un partenaire, stockage local par ce partenaire, affichage de résultats dans un produit commercial et redistribution d’un fichier dérivé. Aucune de ces permissions ne découle automatiquement des autres.

- Les opérateurs n’ont pas publié de licence ouverte couvrant leurs listes anti-spam. Une base consultée ou mise en cache par l’application de l’opérateur ne peut être aspirée ou copiée pour SpamPatrol.
- Hiya documente une cache exploitable par API, mais impose des conditions/API agreement hors de la documentation technique et politique d’utilisation intégrée dans le produit consommateur. Il faut une autorisation contractuelle explicite pour usage commercial, stockage, affichage et redistribution des valeurs. Ne pas supposer que le droit de télécharger le cache autorise une copie permanente ou une reconstitution d’une base publique.
- Truecaller interdit la redistribution d’API content sauf accord séparé écrit ; le scraping des services est interdit par ses conditions.
- ARCEP et DILA publient des jeux avec licences ouvertes, sous attribution et respect du texte de licence/de la fiche du fichier. Les droits de données tierces incluses restent à vérifier.
- Un numéro de téléphone qui permet d’identifier une personne physique est une donnée personnelle selon la CNIL. Les numéros professionnels d’une société peuvent sortir du champ du RGPD dans certaines situations, mais les coordonnées professionnelles d’une personne physique restent personnelles. La publicité d’une donnée n’est pas à elle seule une base légale de réutilisation.
- Le modèle Freemium n’interdit pas par principe la réutilisation des données ouvertes sous Licence Ouverte ; il rend en revanche indispensable la vérification des restrictions contractuelles d’un fournisseur privé et des coûts de licence. Une formule payante ne permet pas de contourner les droits des personnes, secrets d’affaires ou restrictions de redistribution.

Sources : [CNIL — définition de donnée personnelle](https://www.cnil.fr/fr/definition/donnee-personnelle?trk=article-ssr-frontend-pulse_little-text-block) ; [CNIL — réutilisateurs de données publiées sur Internet](https://www.cnil.fr/fr/recommandations-reutilisateurs-donnees-internet) ; [Truecaller API License Addendum](https://www.truecaller.com/api-license-addendum) ; [Licence Ouverte 2.0 et licences data.gouv.fr](https://www.data.gouv.fr/pages/legal/licences).

Cette analyse documentaire n’est pas un avis juridique. Pour une licence d’opérateur/fournisseur, faire examiner le contrat et les clauses de droits dérivés, durée, conservation, attribution, sous-traitance, effacement, contestation et responsabilité avant mise en production.

## 9. Classement A/B/C

### Classe A — exploitable dans un périmètre défini

- **ARCEP MAJNUM et référentiels associés** : attribution et ressources réglementaires ; provenance primaire et licence ouverte publiée. Ne pas en déduire un usage actuel, une entreprise cliente, du spam ou une fraude.
- **DILA Annuaire / référentiel administratif** : coordonnées d’institutions et de services publics publiées sous Licence Ouverte 2.0 pour les jeux correspondants. Utiliser uniquement les coordonnées présentes dans le jeu et conserver l’URL/date.
- **Sirene/INSEE** : identité légale d’entités, dans le cadre du jeu et de ses conditions ; pas d’association directe au numéro appelant.

### Classe B — potentiellement exploitable après accord/clarification

- **Hiya Protect Cache et Number Reputation API** : formats et fonctions documentés, mais accès contractuel, produit payant selon l’API et droits de redistribution à obtenir par écrit.
- **Orange** : base locale et méthode générale officiellement décrites, mais fichier, licence et export absents.
- **Bouygues/Hiya** : fournisseur et principes du service confirmés ; aucun export, API publique ou droit de redistribution.
- **SFR / Free** : existence de filtrages internes établie, mais référentiels et droits inconnus. Intérêt principalement pour une éventuelle demande formelle de partage/licence.
- **33700/AF2M** : chaîne de signalement et qualification intéressante pour comprendre les actions opérateur ; pas de base ouverte identifiée. Demander si un jeu agrégé, anonymisé et réutilisable existe.
- **First Orion/TNS** : solutions pertinentes professionnellement, mais couverture française, prix et réutilisation par SpamPatrol à établir.
- **Begone Simon/Jérôme** : source secondaire jusqu’à obtention des fichiers exacts, de la généalogie des données et des licences de toutes les composantes.

### Classe C — non exploitable en l’état

- Bases internes Orange, SFR, Bouygues et Free en l’absence d’accès/licence ; listes extraites des applications ; données de comptes ou événements d’appel.
- Contenu Truecaller réextrait de l’application ou de ses pages, car redistribution restreinte et scraping interdit.
- Référentiels Google/Samsung copiés depuis les appareils ou applications, faute de données exportables et de licence.
- Tout fichier communautaire/mixte dont chaque entrée ne peut être reliée à une provenance et à un droit d’usage précis.

## 10. Faisabilité d’intégration future dans SpamPatrol

Sans ajouter une fonctionnalité ni une base de données maintenant, la future organisation pourrait maintenir des ensembles séparés :

```text
backend/src/data/
  arcep/                 # sources et index ARCEP déjà séparés
  organizations.json     # coordonnées d'organisations vérifiées, si une source admissible est retenue
  external/
    <provider>/          # snapshots autorisés sous contrat/licence, jamais mélangés à ARCEP
  metadata/              # provenance, licence, dates, version, limites
```

Recommandations de schéma et de processus, à valider avant développement :

1. **Ne conserver que le niveau nécessaire.** Les plages restent représentées par préfixe ou bornes ; ne pas matérialiser des millions de numéros individuels à partir d’une plage.
2. **Séparer les faits par nature.** Une entrée distincte pour attribution ARCEP, catégorie réglementaire, contact d’organisation, réputation fournisseur ou observation communautaire. Ne pas fusionner les sources en un champ générique `isSpam`.
3. **Métadonnées requises.** `sourceId`, URL/source primaire, producteur, licence/version de licence, `publishedAt`, `retrievedAt`, période de validité, empreinte, format et méthode de normalisation, statut (`official`, `provider_assessment`, `community`, `unverified`), niveau et date de vérification.
4. **Associations vérifiables.** Pour `organizations.json`, conserver uniquement le numéro que l’organisation publie ou revendique dans une source officielle/fiable, le type (standard, support, service public), URL de preuve et date de dernière vérification. Ne jamais déduire le titulaire du numéro depuis le code attributaire seul.
5. **Normalisation sans perte.** Conserver la forme brute de la plage dans le snapshot autorisé ; produire une forme canonique E.164 pour une recherche unitaire et documenter l’indicatif, les numéros courts, les formats étendus et les exceptions. Les règles ne doivent pas transformer des plages de pays/territoires différents en collisions.
6. **Contrôles d’import.** Vérifier schéma, valeurs autorisées, taille, bornes, chevauchements, doublons, attribution de licence et version/date. Refuser une mise à jour si la source ou les conditions ont changé de façon inattendue.
7. **Diffs et historique.** Conserver snapshots datés si les droits le permettent ; calculer ajouts, retraits et changements de statut sans transformer une date d’attribution en historique d’usage. Respecter les durées de conservation et la fin de licence.
8. **API/UI prudentes.** L’API renvoie la provenance, la date, la catégorie et les limites. Employer des libellés tels que « plage réglementaire liée aux systèmes automatisés », « attribution ARCEP » ou « réputation indiquée par [fournisseur], relevée le… ». Éviter « arnaque » comme résultat définitif.
9. **Tests nécessaires avant implémentation.** Tests de normalisation et plages, doublons/scissions/fusions, cohérence d’empreintes, données manquantes, dates périmées, différences de licence, absence de fuite du numéro recherché et exactitude de la présentation des limites.
10. **Maintenance réaliste.** Avec un mainteneur unique et JSON, commencer par des imports manuels reproductibles et documentés. N’automatiser une source privée qu’après accord et seulement si l’API garantit un accès supporté, un coût prévisible et une procédure de retrait.

L’architecture actuelle traite déjà MAJNUM séparément, stocke des métadonnées d’import et ne prévoit pas de SQL. L’étude ne recommande donc ni base supplémentaire ni réintroduction des signalements communautaires retirés.

## 11. Réponses aux questions de décision

1. **Des fichiers anti-spam opérateurs sont-ils accessibles publiquement ?** Orange confirme une base locale dans l’application, mais son fichier n’est pas publié. SFR et Free décrivent des listes internes sans export public. Hiya publie la spécification d’un cache téléchargeable par API partenaire. Aucun fichier opérateur français ouvert n’a été trouvé.
2. **Peut-on légalement les télécharger et les intégrer ?** Pas depuis les applications ou bases privées sans autorisation. Pour Hiya, seulement après contrat qui autorise explicitement le produit, le stockage et les usages envisagés. Les données ARCEP/DILA sous licence ouverte sont les voies immédiatement les plus claires, avec leurs obligations.
3. **Existe-t-il des API publiques ou flux réutilisables ?** Le flux ARCEP en CSV et les API/exports DILA sont documentés sous conditions ouvertes. Hiya expose API et cache, mais sous conditions contractuelles ; First Orion expose des API commerciales. Pas d’API publique de réputation SFR/Free/Orange identifiée.
4. **Quels opérateurs ont les informations les plus intéressantes ?** Orange documente un modèle hybride et une base locale ; Bouygues a le partenariat fournisseur le plus clairement documenté avec Hiya pour la réputation réseau. Free confirme une liste propre ; SFR confirme un filtrage mais peu de méthode. Aucun n’offre aujourd’hui une source publique réutilisable.
5. **Hiya est-il accessible ?** Oui techniquement pour des partenaires, avec un cache TSV et des API ; non comme dataset libre. Accord, prix/éligibilité et droits d’usage doivent être négociés.
6. **Quelles sources sont meilleures que Begone ?** Pour les faits réglementaires, ARCEP est supérieure par sa provenance primaire, sa mise à jour annoncée et sa licence ouverte. Pour contacts de services publics, DILA est mieux adaptée. Aucun fournisseur privé n’est « meilleur » pour SpamPatrol sans transparence, droit et contrat établis.
7. **Quelles sources identifient quoi ?** MAJNUM identifie des ressources/plages et attributaires historiques/réglementaires. DILA identifie des services publics avec coordonnées publiées. Sirene identifie des personnes morales/établissements, pas leurs numéros appelants. Les bases Hiya/opérateurs attribuent des réputations probabilistes à des numéros, sans fournir une preuve générale de l’identité du titulaire ou d’une fraude.
8. **Quelles sources conviennent à un service public et commercial ?** ARCEP/DILA sous leur licence et attribution ; un fournisseur commercial uniquement si le contrat permet explicitement usage Freemium, stockage, affichage et distribution. Les conditions actuelles publiques ne suffisent pas à autoriser Hiya/Truecaller ou des listes opérateurs.
9. **Quelle combinaison respecte le cahier des charges ?** ARCEP comme source centrale, DILA seulement pour contacts publics souhaités, Sirene uniquement pour décrire une organisation par identifiants. Maintenir les résultats de réputation commerciale hors de l’application tant qu’un partenariat ne garantit pas provenance, contestation, fraîcheur et droits.
10. **Prochaine étape concrète.** Avant de coder, demander par écrit à Orange, SFR, Bouygues/Hiya, Free et AF2M si un dataset ou endpoint est proposé à des tiers, avec le schéma, la fréquence, le SLA, le coût et les clauses de licence/redistribution en produit commercial. Prioriser une demande à Hiya et Orange (seuls à documenter respectivement un cache/API et une base locale) et demander à l’AF2M si des statistiques agrégées, non identifiantes et sous licence existent. En l’absence d’autorisation écrite satisfaisante, poursuivre avec ARCEP/DILA.

## 12. Conclusion

Les systèmes anti-spam des opérateurs sont plus riches que les listes publiques Begone, car ils peuvent exploiter des événements d’appels et des signalements à grande échelle. Cette richesse est précisément liée à des données privées, à des algorithmes propriétaires et à des traitements opérateur : elle ne rend pas les bases accessibles ou redistribuables. L’alternative réaliste et immédiatement traçable pour SpamPatrol reste un référentiel officiel centré sur ARCEP, complété au besoin par DILA pour des contacts publics, et non une compilation de réputations privées.

**Aucun code, fichier de données, route API, dépendance ou configuration du projet n’a été modifié.** Ce rapport est le seul fichier créé pour cette mission. Aucune donnée anti-spam opérateur n’a été téléchargée ni importée.
