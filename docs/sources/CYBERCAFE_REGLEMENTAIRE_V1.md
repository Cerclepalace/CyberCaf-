> **Source reçue le 7 septembre 2026, archivée sans modification.**
> Document transmis par le fondateur. Aucune reformulation, aucune correction.
> Le classement et les réserves figurent dans `docs/CADRE_REGLEMENTAIRE.md`.

---

# CYBERCAFE_REGLEMENTAIRE_V1

**Version : 1.0**
**Date de référence : 7 septembre 2026**
**Statut : source réglementaire de travail — ne constitue pas un avis juridique**

---

## 1. Objet

Ce document rassemble les contraintes réglementaires et recommandations identifiées pour le projet de modernisation du cybercafé.

Il doit servir de **source de classement** pour `CYBERCAFE_SPECIFICATIONS_V1.md`.

Chaque point doit être conservé selon son niveau réel :

* **OBLIGATION LÉGALE VÉRIFIÉE**
* **RECOMMANDATION OFFICIELLE**
* **BONNE PRATIQUE**
* **INTERPRÉTATION / À VALIDER**

Aucune recommandation ou interprétation ne doit être transformée silencieusement en obligation technique.

---

# 2. Conservation des données de connexion Internet

## 2.1 Accès public à Internet

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE — niveau de certitude indiqué comme élevé dans la source**

Le document source indique qu'une personne fournissant un accès public à Internet est soumise à une obligation de conservation de certaines données de trafic / connexion.

Sont notamment mentionnés :

* adresse IP attribuée à la source de connexion ;
* date de connexion ;
* heure de connexion ;
* durée de connexion ;
* données permettant, le cas échéant, d'identifier le destinataire d'une communication.

La source distingue explicitement ces métadonnées du contenu des communications.

### Durée indiquée

**1 an à compter de la connexion.**

### Références indiquées dans la source

* Article L. 34-1 du Code des postes et des communications électroniques ;
* Décret n° 2011-219 du 25 février 2011.

### Conséquence potentielle pour le produit

Si le futur système gère lui-même les sessions d'accès public à Internet, il devra permettre la conservation des données légalement requises pendant la durée applicable.

Le système ne doit pas conserver, au titre de cette obligation, le contenu des communications.

---

## 2.2 Contenu des communications

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE — niveau indiqué comme élevé dans la source**

La source distingue :

**Données de connexion :**

* IP ;
* date ;
* heure ;
* durée ;
* autres données légalement requises.

**Contenu :**

* pages consultées ;
* corps des e-mails ;
* fichiers échangés ;
* contenu des communications.

Le contenu ne doit pas être collecté dans le cadre de l'obligation de conservation des données de connexion.

### Conséquence produit

Ne pas concevoir de système enregistrant :

* l'historique détaillé des sites visités ;
* le contenu des communications ;
* les fichiers personnels des utilisateurs ;
* les corps d'e-mails.

---

# 3. Logiciel de caisse

## 3.1 Définition

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE — niveau indiqué comme élevé dans la source**

La source rattache la définition au **3° bis de l'article 286 du CGI**.

Le critère déterminant présenté est la capacité d'un système informatique à :

* mémoriser ;
* enregistrer extra-comptablement ;
* des paiements reçus en contrepartie de ventes de marchandises ou de prestations de services.

### Conséquence produit

Tout module qui réalise directement cette fonction doit être traité comme potentiellement soumis au régime applicable aux logiciels ou systèmes de caisse.

Cela concerne notamment, selon le périmètre envisagé :

* sessions PC ;
* impressions ;
* scans ;
* prestations de services ;
* autres prestations facturées.

---

# 4. Principes de conformité des systèmes de caisse

## 4.1 Principes ISCA

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE — niveau indiqué comme élevé dans la source**

La source identifie quatre principes :

1. **Inaltérabilité**

   * impossibilité de modifier a posteriori les données enregistrées de manière contraire aux exigences applicables.

2. **Sécurisation**

   * protection des opérations et des données de vente ;
   * mécanismes de sécurisation tels que signature, hachage ou dispositifs équivalents selon le système concerné.

3. **Conservation**

   * conservation des données selon les durées légalement applicables.

4. **Archivage**

   * possibilité de produire/exporter les données nécessaires à un contrôle.

La source mentionne une durée de **6 ans minimum** pour les données concernées par les obligations de conservation de caisse/facturation et indique que des durées plus longues peuvent découler d'autres obligations.

### Conséquence produit

Ces contraintes ne doivent s'appliquer au futur outil que si celui-ci entre effectivement dans le périmètre d'un logiciel de caisse.

---

# 5. Certification / attestation des logiciels de caisse

## 5.1 Situation au 7 septembre 2026

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE selon la source — niveau indiqué comme élevé**

La source indique que la loi de finances pour 2026 a rétabli la possibilité d'utiliser une **attestation individuelle de l'éditeur** comme preuve de conformité.

Le régime indiqué au 7 septembre 2026 permettrait :

* soit un certificat délivré par un organisme accrédité ;
* soit une attestation individuelle de l'éditeur conforme au modèle applicable.

La certification par organisme accrédité n'est donc pas présentée comme l'unique voie.

### Référence indiquée

* BOI-LETTRE-000242 ;
* article 286 CGI ;
* sources gouvernementales relatives à la réforme 2026.

### Conséquence produit

Si le projet crée un véritable logiciel de caisse, la conformité devra être traitée comme une **gate réglementaire avant mise en production transactionnelle**.

---

# 6. Distinction essentielle : reporting / caisse

## 6.1 Outil de reporting en lecture seule

### Statut

**INTERPRÉTATION / À VALIDER — niveau de certitude moyen à élevé selon la source**

Scénario :

* le cybercafé possède déjà une caisse ;
* la caisse enregistre les ventes et paiements ;
* le futur outil importe les données ;
* le futur outil ne saisit aucune vente ;
* le futur outil n'enregistre aucun paiement ;
* le futur outil n'édite aucun ticket ;
* le futur outil sert uniquement à analyser/reporting.

Dans cette configuration, la source estime que l'outil **n'entre probablement pas** dans la définition d'un logiciel de caisse.

### Point de validation obligatoire

Cette interprétation doit être confirmée par un :

* expert-comptable ;
* conseil fiscal ;
* ou autre professionnel compétent.

---

## 6.2 Outil qui enregistre directement les ventes

### Statut

**OBLIGATION À TRAITER COMME TELLE SI LE PÉRIMÈTRE EST CONFIRMÉ**

Scénario :

* saisie d'une vente ;
* calcul du prix ;
* enregistrement du paiement ;
* édition éventuelle d'un ticket.

Exemple :

`1 impression — 4 pages — 0,80 € — CB`

Ce type de fonctionnalité doit être considéré comme entrant potentiellement dans le périmètre du logiciel de caisse.

### Règle projet

**L'Outil 1 n'est pas une caisse.**

Tant que le périmètre fiscal n'est pas validé, l'architecture privilégiée est :

`CAISSE EXISTANTE → EXPORT / API / DONNÉES EXISTANTES → REPORTING`

et non :

`CLIENT → NOUVEL OUTIL → PAIEMENT → NOUVELLE CAISSE`

---

# 7. Durées de conservation

Les durées ci-dessous doivent être distinguées selon leur statut juridique réel.

| Catégorie                       |  Durée indiquée par la source | Statut                       |
| ------------------------------- | ----------------------------: | ---------------------------- |
| Logs de connexion Internet      |                          1 an | Obligation indiquée          |
| Données de facturation / caisse | 6 ans minimum selon la source | Obligation selon périmètre   |
| Données clients / prospects     |              Relation + 3 ans | Recommandation CNIL indiquée |
| Comptes inactifs                |                         2 ans | Recommandation indiquée      |
| Logs de sécurité interne        |                   6 à 12 mois | Recommandation indiquée      |

### Règle importante

Ne pas transformer automatiquement les durées recommandées en exigences produit universelles.

Avant implémentation, chaque durée doit être rattachée :

* à une finalité ;
* à une catégorie de données ;
* à une base juridique ;
* à une source officielle ;
* à la situation réelle du cybercafé.

---

# 8. RGPD

## 8.1 Minimisation

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE**

Le système doit respecter le principe de minimisation des données.

Les données doivent être limitées à ce qui est nécessaire aux finalités poursuivies.

Finalités identifiées :

* gestion des sessions ;
* accès Internet ;
* facturation ;
* conservation légale des logs ;
* sécurité du système.

---

## 8.2 Information des utilisateurs

### Statut

**OBLIGATION LÉGALE VÉRIFIÉE**

Les utilisateurs doivent recevoir une information claire concernant notamment :

* identité du responsable du traitement ;
* finalités ;
* catégories de données ;
* durées de conservation ;
* droits des personnes.

L'information peut être fournie selon le dispositif retenu :

* affichage ;
* page d'information ;
* ticket ;
* autre support approprié.

---

## 8.3 Registre des traitements

### Statut

**OBLIGATION / À QUALIFIER SELON LA SITUATION DU RESPONSABLE DE TRAITEMENT**

Le registre des activités de traitement relève de l'article 30 du RGPD, avec des exceptions prévues par le texte.

Compte tenu de traitements réguliers tels que :

* données de facturation ;
* sessions ;
* logs de connexion ;
* sécurité ;

le projet doit prévoir la documentation nécessaire au registre.

### Conséquence produit

Le système doit pouvoir documenter :

* finalités ;
* catégories de données ;
* durées ;
* destinataires ;
* mesures de sécurité.

---

# 9. Postes informatiques accessibles au public

## 9.1 Nettoyage des sessions

### Statut

**BONNE PRATIQUE / RECOMMANDATION DE SÉCURITÉ**

Les postes publics devraient éviter de conserver les données personnelles d'un utilisateur pour l'utilisateur suivant.

Mesures envisagées :

* comptes temporaires/invités ;
* nettoyage des téléchargements ;
* nettoyage des fichiers temporaires ;
* nettoyage des cookies ;
* nettoyage de l'historique ;
* rappel de déconnexion des comptes personnels.

### Important

Il s'agit d'une mesure de sécurité à intégrer au design des postes, et non d'une obligation fiscale.

---

# 10. Assistance aux démarches administratives

## 10.1 Positionnement

### Statut

**INTERPRÉTATION / À VALIDER**

Le document source ne relève pas d'interdiction générale empêchant un commerce privé d'accompagner un client dans une démarche administrative en ligne.

Le risque porte notamment sur :

* identifiants ;
* mots de passe ;
* données personnelles ;
* données potentiellement sensibles ;
* validation d'actions au nom du client ;
* responsabilité en cas d'erreur.

### Règles projet proposées

Le service doit être positionné comme **accompagnement** :

* le client reste maître de ses identifiants ;
* le cybercafé ne conserve pas les mots de passe ;
* le client valide lui-même les étapes sensibles ;
* aucune conservation inutile des documents ou données personnelles.

### Validation requise

Faire valider par un juriste :

* le positionnement exact du service ;
* l'éventuelle nécessité d'un formulaire d'accord ;
* les limites d'intervention du personnel.

---

# 11. Cybersécurité

## 11.1 Postes clients

### Statut

**BONNE PRATIQUE / RECOMMANDATION**

Mesures proposées :

* aucun droit administrateur pour le client ;
* compte temporaire ou mécanisme équivalent ;
* nettoyage de session ;
* mises à jour ;
* protection antivirus/endpoint adaptée ;
* déconnexion des sessions précédentes.

---

## 11.2 Réseau

### Statut

**BONNE PRATIQUE / RECOMMANDATION**

Séparer logiquement :

`RÉSEAU CLIENTS`

et

`RÉSEAU ADMINISTRATION`

Le niveau de séparation dépendra de l'infrastructure réellement présente sur le terrain.

---

## 11.3 Serveur / PC principal

### Statut

**BONNE PRATIQUE / RECOMMANDATION**

Prévoir :

* comptes nominatifs ;
* accès restreints ;
* mots de passe robustes ;
* mises à jour ;
* protection antivirus/endpoint ;
* sauvegardes ;
* contrôle des accès.

---

## 11.4 Sauvegardes

### Statut

**BONNE PRATIQUE / RECOMMANDATION**

Prévoir au minimum une stratégie de sauvegarde adaptée aux données réellement conservées.

Le niveau de sauvegarde sera déterminé après observation :

* matériel ;
* logiciels ;
* données ;
* fréquence ;
* criticité ;
* connectivité ;
* procédure actuelle.

---

# 12. Contraintes à reporter dans les spécifications

Les contraintes suivantes peuvent servir de base au futur `CYBERCAFE_SPECIFICATIONS_V1.md`, sous réserve du classement indiqué ci-dessus :

1. Conservation des données de connexion légalement requises.
2. Absence de conservation du contenu des communications dans le cadre des logs légaux.
3. Respect du principe de minimisation RGPD.
4. Information des utilisateurs.
5. Documentation des traitements.
6. Sécurisation des postes publics.
7. Nettoyage des sessions.
8. Séparation logique des réseaux lorsque techniquement pertinente.
9. Protection du poste/serveur d'administration.
10. Sauvegardes adaptées.
11. **Outil 1 conçu par défaut comme couche de reporting et non comme caisse.**
12. Toute évolution vers une fonction de caisse constitue une **gate fiscale spécifique**.
13. Les interprétations juridiques doivent rester explicitement marquées **À VALIDER** jusqu'à confirmation professionnelle.

---

# 13. Gates réglementaires du projet

## P1 — Reporting

Objectif :

`DONNÉES EXISTANTES → LECTURE / IMPORT → ANALYSE`

Condition :

* aucune saisie de vente ;
* aucun enregistrement de paiement ;
* aucun ticket généré ;
* validation du périmètre par expert fiscal avant développement définitif.

---

## P2 — Fonctionnalités transactionnelles

Exemples :

* saisie de ventes ;
* calcul tarifaire ;
* paiement ;
* ticket ;
* clôture de caisse.

### Statut

**BLOQUÉ JUSQU'À VALIDATION FISCALE.**

---

## P3 — Fonctions impliquant des données personnelles / services numériques

Exemples :

* comptes clients ;
* historique individuel ;
* assistance administrative avancée ;
* stockage documentaire.

### Statut

**BLOQUÉ JUSQU'À QUALIFICATION RGPD / JURIDIQUE DU BESOIN.**

---

# 14. Règle de gouvernance

Aucune contrainte juridique ne doit être déduite d'une simple bonne pratique.

Aucune bonne pratique ne doit être présentée comme une obligation légale.

Aucune interprétation juridique ne doit être transformée en exigence produit sans validation.

Aucune fonctionnalité ne doit être développée uniquement parce qu'elle apparaît dans ce document.

Le terrain reste prioritaire.

**Collecte → faits observés → analyse → qualification réglementaire → spécifications → décision GO / MODIFIER / ABANDONNER → développement éventuel.**
