# Feuille de route

## MVP local (livré dans ce dépôt)

- Recherche par numéro, informations de préfixe disponibles et commentaires communautaires.
- Création validée de signalements dans le JSON local.
- Statistiques, répliques, export CSV et indication honnête de l’analyse simulée.
- Couverture des routes API et du client frontend par des tests.

## Prochaines améliorations sûres

1. Faire valider le schéma et la stratégie d’archivage des objets historiques non interprétables de `reports.json` ; aucune suppression ou réécriture ne doit précéder cette validation.
2. Vérifier le fichier de préfixes face à une publication ARCEP actuelle et documenter la date de référence.
3. Ajouter pagination et filtres sur les signalements lorsque le volume le justifie.
4. Ajouter, si nécessaire, sauvegardes et protection anti-abus persistante tout en conservant d’abord le stockage JSON.

## Extension collaborative (à spécifier avant d’engager)

Comptes et droits, historique personnel, liste noire, votes, API externe authentifiée, statistiques temporelles et géographiques. Une base de données ne sera envisagée qu’après spécification des besoins de concurrence, sauvegarde et migration des JSON.
