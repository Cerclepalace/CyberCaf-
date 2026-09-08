# Cadre réglementaire — classement

**Version 2.0 — 7 septembre 2026**
**Source classée : `docs/sources/CYBERCAFE_REGLEMENTAIRE_V1.md`**
**Statut : cadre de travail. Aucun développement en cours.**

Ce document classe la source reçue selon trois niveaux et en tire les
contraintes de conception. La source est archivée sans modification ;
les écarts de classement entre elle et ce document sont signalés et motivés.

---

## 0. Avertissement sur la source

`CYBERCAFE_REGLEMENTAIRE_V1.md` est une **source secondaire**. Son texte est
rédigé au style indirect (« le document source indique que… »), ce qui signifie
qu'il relaie une analyse sans en produire la vérification. Les mentions
« OBLIGATION LÉGALE VÉRIFIÉE » y désignent donc un **niveau de confiance
déclaré**, pas une vérification indépendante contre le texte de loi.

Sa propre règle de gouvernance (§14) — *« aucune interprétation ne doit être
transformée en exigence produit sans validation »* — s'applique à elle-même.
Elle est appliquée ici : deux points classés « vérifiés » par la source sont
déclassés en niveau 2, avec motif.

Aucune vérification indépendante des textes n'a pu être faite dans ce projet.
Les points de niveau 1 restent des contraintes de conception, pas des
certitudes juridiques.

---

## 1. Correction de numérotation — à lire avant tout

La source introduit des gates **P1 / P2 / P3** qui ne portent pas sur le même axe
que les périmètres P1/P2/P3 employés dans `COLLECTE_TERRAIN.md` §8 et dans la
version 1 de ce document. Laisser cohabiter les deux produirait un contresens
en phase de spécifications.

**Numérotation canonique retenue : celle de la source.**
P1 = reporting · P2 = transactionnel · P3 = données personnelles.

L'ancienne échelle est renommée **niveaux d'enregistrement E0 / E1 / E2** :

| Ancien | Nouveau | Contenu | Gate de rattachement |
|---|---|---|---|
| P1 | **E0** | Volumes seuls : pages, sessions, durées. Aucun montant. | P1 — reporting |
| P2 | **E1** | Totaux journaliers issus d'une caisse existante | P1 — reporting, sous réserve de validation |
| P3 | **E2** | Enregistrement du règlement du client | P2 — bloqué |

`COLLECTE_TERRAIN.md` §8 n'a pas été modifié : le protocole de collecte est gelé.
Sa table P1/P2/P3 doit être lue comme E0/E1/E2. Correction à appliquer sur
autorisation, quand le protocole sortira de son gel.

---

## 2. NIVEAU 1 — CONTRAINTE À RETENIR

Obligations suffisamment établies **et** directement applicables au périmètre retenu.
Une spécification qui les viole est rejetée, pas arbitrée.

| # | Contrainte | Source | Périmètre touché | Effet sur la conception |
|---|---|---|---|---|
| C1 | Ne pas conserver le contenu des communications : historique détaillé de navigation, corps d'e-mails, fichiers personnels | §2.2 | Tout outil touchant aux postes clients | Interdit toute fonction de journalisation d'activité de navigation. Ferme définitivement une famille de fonctionnalités |
| C2 | Minimisation : les données collectées se limitent à ce qui est nécessaire à une finalité identifiée | §8.1 | Tout | Chaque champ stocké doit être rattaché à une finalité écrite. Un champ sans finalité est supprimé |
| C3 | Un système qui mémorise et enregistre extra-comptablement des **paiements reçus** relève du régime des logiciels de caisse (ISCA + certificat ou attestation) | §3.1, §4.1, §5.1 | Activée seulement en E2 | Contrainte conditionnelle : elle ne s'applique pas tant que l'outil n'enregistre aucun règlement. C'est précisément ce qui rend E0 attractif |
| C4 | Information des personnes : responsable du traitement, finalités, catégories, durées, droits | §8.2 | L'exploitation du cybercafé | S'applique au lieu, pas mécaniquement à l'outil 1. En E0 sans donnée personnelle, l'outil n'ajoute aucune obligation nouvelle |

**Précision sur C3, contre une lecture trop large de la source.**
Le §3.1 liste « sessions PC, impressions, scans, prestations » en conséquence
produit. Pris littéralement, cela ferait entrer dans le périmètre caisse tout
module qui compte des pages. Ce n'est pas ce que dit le critère lui-même : le
déclencheur est **l'enregistrement du paiement reçu**, pas le suivi du volume
d'un service. Compter 12 pages imprimées n'est pas enregistrer un règlement.
Cette lecture est ce qui autorise E0. Elle fait partie des points à faire
confirmer (V1 ci-dessous).

---

## 3. NIVEAU 2 — À VALIDER

Interprétations juridiques, ou obligations dont l'applicabilité à ce cybercafé
n'est pas établie. Chaque ligne bloque une fonctionnalité, pas le projet.

| # | Point | Question précise | Destinataire | Ce qui est bloqué | Priorité |
|---|---|---|---|---|---|
| V1 | Reporting en lecture seule hors champ caisse | Un outil qui importe des données d'une caisse existante, ne saisit aucune vente, n'enregistre aucun paiement et n'édite aucun ticket, sort-il du 3° bis de l'art. 286 CGI ? Et un outil qui n'enregistre que des volumes physiques, sans aucun montant ? | Expert-comptable | E0 et E1 — donc le MVP éventuel de l'outil 1 | **Haute** |
| V2 | Applicabilité de l'obligation de conservation des logs de connexion | Un cybercafé de cette taille est-il effectivement soumis à l'obligation de conservation de l'art. L.34-1 CPCE, dans son état applicable en 2026 ? Le cybercafé y est-il soumis **aujourd'hui**, indépendamment de tout projet informatique ? | Juriste, ou avocat en droit du numérique | Toute gestion de sessions d'accès Internet — donc l'outil 2 | **Haute** |
| V3 | Attestation individuelle de l'éditeur | Un logiciel développé en interne pour son propre usage peut-il en faire l'objet ? Qui la signe : l'exploitant, le développeur ? Quelle valeur en cas de contrôle ? | Expert-comptable | E2 / gate P2 | Moyenne |
| V4 | Assistance aux démarches administratives | Positionnement du service, nécessité d'un accord écrit du client, limites d'intervention du personnel, responsabilité en cas d'erreur | Juriste | Toute fonctionnalité liée à l'assistance | Moyenne |
| V5 | Registre des traitements (art. 30 RGPD) | Le cybercafé est-il dans le champ, ou dans une exception ? Le registre existe-t-il déjà ? | Comptable ou juriste | Rien côté produit — c'est une obligation du lieu, pas de l'outil | Basse |
| V6 | Durées de conservation issues de recommandations CNIL (relation + 3 ans, comptes inactifs 2 ans, logs de sécurité 6-12 mois) | Lesquelles s'appliquent réellement ici, pour quelle finalité et quelle base juridique ? | Juriste | Rien à ce stade — aucune de ces catégories de données n'existe dans le périmètre retenu | Basse |

### Déclassements assumés par rapport à la source

**V2 — la source classe §2.1 en « OBLIGATION LÉGALE VÉRIFIÉE ». Je la classe À VALIDER.**
Motifs : la source relaie l'analyse sans citer le texte applicable en 2026 ;
le régime français de conservation des données de connexion a fait l'objet de
remises en cause juridictionnelles depuis le décret de 2011 cité ; et la
qualification d'un cybercafé au regard de l'art. L.34-1 CPCE n'est pas
évidente. Je n'ai pas les moyens de trancher — ma base de connaissances est
antérieure à 2026 et je n'ai vérifié aucun texte. **C'est un désaccord explicite
avec la source, pas un oubli.**

**V6 — la source range ces durées dans un tableau intitulé « durées de conservation »,
à côté d'obligations réelles.** Ce sont des recommandations. La source le dit
elle-même, mais la mise en tableau les met visuellement au même rang. Elles
n'ont aucun effet produit à ce stade.

---

## 4. NIVEAU 3 — BONNE PRATIQUE

Ni obligation, ni interprétation à trancher : mesures d'hygiène. Elles
n'attendent aucune validation juridique et relèvent intégralement de l'outil 3.

| Mesure | Source |
|---|---|
| Comptes temporaires / invité sur les postes clients | §9.1, §11.1 |
| Nettoyage entre deux clients : téléchargements, fichiers temporaires, cookies, historique | §9.1 |
| Rappel de déconnexion des comptes personnels | §9.1 |
| Aucun droit administrateur pour le client | §11.1 |
| Mises à jour, protection antivirus/endpoint | §11.1, §11.3 |
| Séparation logique réseau clients / réseau administration | §11.2 |
| Serveur : comptes nominatifs, accès restreints, mots de passe robustes | §11.3 |
| Sauvegardes adaptées aux données réellement conservées | §11.4 |
| Supervision | — |

### Remarque de méthode

Le nettoyage des sessions est classé « bonne pratique » par la source. Sa
qualification juridique exacte est discutable : dès lors qu'un fichier scanné
ou téléchargé par un client reste sur le poste, le cybercafé détient de fait des
données personnelles, ce qui rapproche le sujet de l'obligation de sécurité de
l'art. 32 RGPD.

**Trancher ne sert à rien.** L'action est identique dans les deux cas, elle est
gratuite, et elle est déjà décidée. Le budget de validation juridique — qui est
limité et payant — doit aller sur **V1 et V2**, qui conditionnent réellement ce
qui sera construit. Ne pas le dépenser sur des points où la réponse ne change
aucune décision.

---

## 5. Conséquence stratégique majeure — outil 2

**La gestion de sessions d'accès Internet est le seul élément du projet qui
puisse créer une obligation légale nouvelle. Elle doit être écartée par défaut.**

Enchaînement :

1. Aujourd'hui, sans système de sessions, le cybercafé ne produit probablement
   aucune donnée de connexion exploitable. La question de la conservation est
   théorique.
2. Un lanceur simplifié ou un gestionnaire de sessions crée cette donnée.
3. Créer la donnée fait entrer dans le champ de la conservation (V2), donc
   dans un stock d'un an de données personnelles.
4. Ce stock déclenche à son tour des obligations de sécurité, d'information,
   de registre, et devient une cible.

Autrement dit : **l'outil 2 est le seul des trois qui puisse dégrader la
situation réglementaire du cybercafé.** Il reste suspendu, et cette raison
s'ajoute à celles déjà retenues — clientèle âgée, personnel non technique,
absence de douleur démontrée.

Corollaire : **si V2 révèle que l'obligation s'applique déjà aujourd'hui**, alors
le cybercafé est en écart de conformité **indépendamment du projet**. C'est un
constat à remonter, pas un problème à résoudre par du logiciel.

---

## 6. Règle architecturale — outil 1

**L'outil 1 n'est pas une caisse, et ne le devient pas par défaut.**

```
caisse existante  →  export / API / données existantes  →  reporting
```

et non :

```
client  →  nouvel outil  →  paiement  →  nouvelle caisse
```

Interdits tant que V1 n'est pas tranché :

- saisir une vente ;
- enregistrer un paiement ;
- éditer un ticket ;
- effectuer une clôture de caisse.

Cible par défaut : **E0** — volumes seuls, aucun montant. C'est le seul niveau
qui échappe à la question fiscale par construction plutôt que par interprétation.

### Conditions de viabilité de la chaîne « export → reporting »

À vérifier au terrain avant de retenir cette architecture :

1. L'export produit-il un **fichier**, ou seulement un rapport papier ?
   Un rapport papier impose une recopie quotidienne : cela crée une tâche
   manuelle répétitive au lieu d'en supprimer une. La chaîne est alors invalide.
2. L'export peut-il se faire **sans intervention quotidienne** ?
   Une clé USB à brancher chaque soir est une nouvelle tâche, pas une automatisation.
3. Si l'information existe déjà, imprimée chaque soir par la caisse :
   la valeur du reporting **pour l'exploitation** est proche de zéro.
   La valeur restante — historisation, tendance, accès à distance — est une
   valeur **de pilotage**, à porter dans la colonne correspondante et non à
   présenter comme un gain opérationnel.

---

## 7. Évaluation de l'outil 1 — deux colonnes distinctes

Aucune fusion des deux colonnes. Un gain de pilotage ne compense pas l'absence
de gain d'exploitation ; il se justifie seul, ou pas du tout.

| | Valeur pour l'exploitation | Valeur pour le pilotage |
|---|---|---|
| Bénéficiaire | Le cybercafé, le personnel | Le fondateur |
| Mesure | € gagnés ou € de fuite évités, ventes non perdues, temps en heure de pointe | Temps du fondateur, fiabilité de l'information, décisions rendues possibles |
| À remplir | *(après données terrain)* | *(après données terrain)* |

---

## 8. Gates du projet

| Gate | Périmètre | Statut | Débloqué par |
|---|---|---|---|
| **P1** | Reporting : données existantes → lecture/import → analyse. Aucune saisie de vente, aucun paiement, aucun ticket | Ouvert sous réserve | V1 |
| **P2** | Transactionnel : saisie de vente, calcul tarifaire, paiement, ticket, clôture | **Bloqué** | V1 + V3 + attestation ou certificat |
| **P3** | Données personnelles : comptes clients, historique individuel, assistance avancée, stockage documentaire | **Bloqué** | V4 + qualification RGPD du besoin |

Gestion de sessions d'accès Internet : hors gate, **écartée par défaut** (§5).

---

## 9. Question de collecte non couverte par le protocole

Le protocole terrain est gelé et n'a pas été modifié. Une question manque
désormais, rendue matérielle par la source :

> **Le cybercafé conserve-t-il aujourd'hui des données de connexion Internet ?
> Si oui : lesquelles, où, depuis combien de temps, qui y a accès ?**

Ajout proposé au volet F, sur autorisation. Sans elle, V2 ne peut pas être
instruit correctement : on ne saura pas si l'obligation éventuelle est déjà
satisfaite, déjà en écart, ou sans objet.

---

## 10. Ordre de traitement à réception des données

```
DONNÉES BRUTES
  → faits observés (séparés des hypothèses et des contraintes réglementaires)
  → problèmes mesurés
  → fréquence
  → temps perdu
  → opportunités
  → analyse ROI
  → gate réglementaire
  → spécifications
  → architecture
  → MVP
  → décision GO / MODIFIER / ABANDONNER
  → code
```

Aucune donnée manquante n'est comblée. Une information absente est marquée
`NON RENSEIGNÉ` et le reste jusqu'à ce qu'elle soit collectée.

Aucune fonctionnalité n'est développée au seul motif qu'elle apparaît dans la
source réglementaire. Le terrain reste prioritaire.
