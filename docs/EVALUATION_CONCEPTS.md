# Évaluation des trois concepts produits

**Version 1.0 — 7 septembre 2026**
**Statut : hypothèses de produits. Aucun besoin validé. Aucun développement.**

Concepts évalués : **Assist-Tech**, **Smart Desk**, **Ops-Snack**.
Aucun n'est retenu. Aucun n'est écarté définitivement.

---

## 0. Réserve préalable — cohérence du contexte

Les trois concepts sont formulés dans un vocabulaire de **lounge gaming** :
joueurs, tournois, flotte de machines, bar, réservations WhatsApp.

Le contexte établi depuis le début de ce projet est un **cybercafé de proximité
à clientèle âgée** : impressions, scans, aide aux démarches administratives,
personnel non technique.

Les deux descriptions ne peuvent pas être vraies en même temps.
L'évaluation ci-dessous est faite **sur le contexte établi** — celui qui a servi
à construire le protocole de collecte.

**Si le lieu est en réalité un espace gaming, l'ensemble du protocole terrain
est à refaire** : les instruments, le questionnaire et les hypothèses de perte
ne mesurent pas la bonne activité. C'est un point à trancher avant la collecte,
pas après.

---

## 1. Assist-Tech — support client et dépannage automatique

| Critère | Évaluation |
|---|---|
| **Problème réellement résolu** | Le personnel s'interrompt pour aider. Mais dans ce contexte, l'aide demandée est majoritairement **humaine et non technique** : ouvrir une pièce jointe, retrouver un fichier scanné, comprendre ce que demande un formulaire. Un assistant automatique ne résout pas cela : il ajoute une étape entre le client et la personne qui sait faire. Le pitch parle de bug réseau, d'audio et de QR code — problèmes d'un autre métier. |
| **Fréquence probable** | Élevée. C'est le seul des trois dont le problème est vraisemblablement réel et quotidien. À mesurer par l'instrument 3. |
| **Valeur économique** | Faible à nulle si le personnel n'est pas saturé. Du temps économisé en heure creuse ne se transforme en rien. Ne compter que les interruptions tombant en heure de pointe. |
| **Complexité d'intégration** | Faible pour une version papier. Élevée pour une version logicielle : il faut un canal, un terminal côté client, une base de connaissances, et surtout que le client sache s'en servir. |
| **Dépendances** | Un QR code suppose un smartphone et la capacité de le scanner. Sur une clientèle âgée, c'est une hypothèse forte et probablement fausse. **C'est la dépendance qui tue le concept sous sa forme actuelle.** |
| **Risques réglementaires** | Faibles tant qu'aucune donnée personnelle ne circule. Deviennent réels dès que l'outil reçoit des captures d'écran, des documents ou des identifiants → gate **P3**. |
| **Données nécessaires pour prouver le besoin** | Instrument 3 : fréquence par motif, répartition horaire, et surtout la part des motifs **résolubles sans intervention physique**. Un motif qui exige de toucher la machine n'est pas automatisable. |
| **MVP réellement testable** | **Pas un logiciel.** Une fiche plastifiée par motif dominant, posée sur chaque poste, pendant deux semaines. Mesure : baisse du nombre d'interruptions pour ce motif. Coût : quelques euros. **Si la fiche ne fait rien baisser, aucun logiciel ne le fera** — le problème n'est alors pas l'information manquante, mais la capacité du client à l'utiliser seul. |

---

## 2. Smart Desk — réservation intelligente et gestion de flotte

| Critère | Évaluation |
|---|---|
| **Problème réellement résolu** | Postes mal attribués, pics de fréquentation, réservations à traiter. Suppose deux choses non établies : que des clients repartent faute de poste libre, et qu'ils souhaitent réserver à l'avance. Dans un cybercafé de proximité, on vient quand on a un papier à imprimer — pas sur rendez-vous. |
| **Fréquence probable** | Inconnue. Aujourd'hui, le nombre de demandes de réservation reçues est probablement nul. À vérifier avant toute autre chose. |
| **Valeur économique** | Réelle uniquement s'il y a des ventes perdues. **Seuil objectif : si le taux d'occupation de pointe reste sous 80 %, la valeur est nulle par construction** — il y a toujours une machine libre, il n'y a rien à optimiser. |
| **Complexité d'intégration** | Élevée. Une réservation est un état partagé, avec des no-shows, des annulations et des conflits. L'API WhatsApp Business suppose une vérification d'entreprise, un prestataire et des modèles de messages payants : ce n'est pas une brique de week-end. |
| **Dépendances** | WhatsApp Business API, fiche Google, affichage en salle, et un moyen de savoir quel poste est libre — donc un agent sur les postes ou une saisie manuelle. Chaque dépendance est un point de panne que le personnel ne saura pas réparer. |
| **Risques réglementaires** | **Les plus élevés des trois.** Gérer des sessions d'accès Internet produit des données de connexion → point **V2**, non tranché. Y ajouter un identifiant client pour la réservation → gate **P3**. C'est le seul concept qui peut **créer** une obligation légale là où il n'y en avait peut-être aucune. |
| **Données nécessaires pour prouver le besoin** | Taux d'occupation horaire sur 14 jours ; nombre de clients repartis sans être servis ; nombre de demandes de réservation actuellement reçues. **Aucune de ces trois mesures n'est dans le protocole actuel** (voir §4). |
| **MVP réellement testable** | Un tableau blanc au mur avec les numéros de postes et un feutre, pendant deux semaines. Si personne ne s'en sert — ni le personnel, ni les clients — la question est réglée sans écrire une ligne. |

---

## 3. Ops-Snack — gestion intelligente du bar / catering

| Critère | Évaluation |
|---|---|
| **Problème réellement résolu** | Ruptures de stock, gâchis, marge. **Question préalable non instruite : y a-t-il un bar ?** Aucun des six volets du protocole ne mentionne de vente de consommables. Si le lieu n'en vend pas, le concept est sans objet ; s'il en vend, c'est une activité entière absente de la collecte. |
| **Fréquence probable** | Indéterminable en l'état. |
| **Valeur économique** | Réelle si la part du CA snack est significative. Se mesure avec l'instrument 1, en ajoutant un code de prestation. |
| **Complexité d'intégration** | La plus élevée des trois : c'est un logiciel de caisse doublé d'une gestion de stock. |
| **Dépendances** | Un inventaire à jour suppose un comptage quotidien par le personnel. **Le concept crée une tâche manuelle répétitive au lieu d'en supprimer une** — exactement ce que le projet cherche à éviter. |
| **Risques réglementaires** | **Maximaux.** Enregistrer un règlement place l'outil dans la gate **P2**, bloquée jusqu'à validation fiscale. Le pitch affirme « tu ne livres pas un logiciel de caisse » tout en décrivant précisément ses fonctions : la qualification ne dépend pas du nom qu'on lui donne. |
| **Données nécessaires pour prouver le besoin** | Existence et part du CA snack ; nombre de références vendues ; fréquence des ruptures ; gâchis mesuré en euros. |
| **MVP réellement testable** | Un carnet de comptage des ruptures et des invendus, deux semaines, coût zéro. |

**Sur la prédiction de stock et les tendances sectorielles :** prédire les besoins
suppose un historique qui n'existe pas — il faudra plusieurs mois de ventes
avant qu'un modèle ait quoi que ce soit à apprendre. Et ce qui se vend dans le
secteur ne prédit pas ce qui se vend dans ce lieu précis : quatorze jours de
données propres valent mieux que n'importe quelle tendance de marché.

---

## 4. Quelles données terrain départagent les trois

| Concept | Mesure décisive | Déjà dans le protocole ? |
|---|---|---|
| Assist-Tech | Instrument 3 : fréquence par motif + répartition horaire + part des motifs résolubles à distance | **Oui** |
| Smart Desk | Taux d'occupation horaire des postes ; clients repartis faute de poste ; demandes de réservation reçues | **Non** |
| Ops-Snack | Existence d'un bar ; part du CA snack ; ruptures et invendus | **Partiellement** (l'instrument 1 le capte si un code de prestation est ajouté) |

### Ajouts proposés au protocole — à autoriser

Le protocole est gelé. Deux ajouts seraient nécessaires pour départager
équitablement les trois concepts :

1. **Relevé d'occupation** — toutes les heures, noter le nombre de postes occupés.
   Une croix par heure sur la feuille de vente. Quatorze jours.
   C'est la seule mesure capable de valider ou de tuer Smart Desk.
2. **Comptage des clients repartis** — une croix chaque fois qu'un client repart
   sans être servi, avec le motif s'il est connu (pas de poste libre, attente
   trop longue, prestation non proposée).

Aucun des deux n'ajoute de charge significative au personnel.

---

## 5. Quel signal justifierait un premier prototype

Seuils **proposés**, à recalibrer sur les volumes réels. Ce sont des ordres de
grandeur destinés à empêcher une décision au feeling, pas des règles.

| Concept | Signal suffisant | Si le signal est absent |
|---|---|---|
| **Assist-Tech** | Un même motif ≥ 8 interruptions/jour, dont au moins la moitié en heure de pointe, **et** la fiche papier n'a pas fait baisser le compte après deux semaines | La fiche papier est la solution définitive. Pas de logiciel. |
| **Smart Desk** | Occupation de pointe ≥ 80 % sur au moins 5 jours sur 14, **et** ≥ 3 clients/jour repartis faute de poste | Abandon. Il n'y a rien à optimiser. |
| **Ops-Snack** | CA snack ≥ 15 % du CA total **et** ≥ 2 ruptures/semaine sur une référence qui tourne | Abandon. |

**Condition commune :** le signal doit désigner **un seul** problème dominant.
Trois signaux faibles ne justifient pas trois prototypes — ils justifient de
continuer à observer.

### Règle de décision — conservée

Un prototype ne se déclenche que si le problème est, cumulativement :

1. **dominant** — un seul problème se détache, pas trois signaux faibles ;
2. **mesuré** — par un instrument du protocole, pas par une impression ;
3. **récurrent** — présent sur la durée du relevé, pas sur deux journées ;
4. **économiquement significatif** — chiffré en euros, ou en temps d'heure de pointe.

Les quatre conditions à la fois. Trois sur quatre ne suffisent pas.

### Statut des seuils

Les seuils du tableau ci-dessus sont des **ordres de grandeur destinés à être
recalibrés** sur les volumes réels du lieu. Ils ne proviennent d'aucune source
vérifiée et n'ont aucune valeur établie, quelle que soit leur origine. Leur
seule fonction est d'empêcher une décision prise au ressenti.

Ils devront être réécrits une fois les volumes réels connus — un cybercafé de
6 postes et un de 25 postes n'ont pas les mêmes seuils.

**Condition sur Ops-Snack :** même si son signal est atteint, la gate **P2**
interdit tout enregistrement de règlement. Le prototype devrait alors se limiter
à un suivi de **volumes** sans montants (niveau **E0**) : entrées, sorties,
ruptures. Pas de prix, pas de paiement, pas de ticket.

---

## 6. Fonctionnalités prématurées

À ce stade, sans donnée terrain, toutes les fonctionnalités suivantes sont
prématurées, quel que soit le concept retenu :

- toute prédiction ou modèle de stock — aucun historique n'existe ;
- analyse de tendances sectorielles — sans valeur prédictive pour ce lieu ;
- intégration WhatsApp Business API et fiche Google ;
- upsell, suggestion de combos, copywriting commercial ;
- QR code côté client ;
- comptes clients, historique individuel, fidélité ;
- édition de tickets, enregistrement de paiements, clôture de caisse ;
- gestion automatisée des sessions d'accès Internet ;
- toute plateforme regroupant plusieurs des trois concepts.

---

## 7. Ordre provisoire

L'ordre provisoire indiqué — Assist-Tech, puis Smart Desk, puis Ops-Snack —
est probablement le bon, mais pour des raisons différentes de celles des pitchs :

1. **Assist-Tech** — le seul dont le problème sous-jacent est vraisemblablement
   réel et quotidien, et le seul dont le MVP de test coûte quelques euros.
2. **Smart Desk** — problème non établi, dépendances lourdes, et le seul qui
   puisse dégrader la situation réglementaire du lieu.
3. **Ops-Snack** — activité qui n'est pas même documentée comme existante,
   et complexité maximale.

Cet ordre reste **provisoire**. Les données terrain peuvent l'inverser
entièrement, ou écarter les trois.

---

## 8. Remarque sur la méthode de production

Répartir le travail entre plusieurs assistants — l'un pour le code, l'un pour la
rédaction, l'un pour la recherche — est un choix d'outillage. Cela ne dit rien de
ce qu'il faut construire. Une chaîne de production rapide accélère la fabrication
d'un mauvais produit exactement aussi bien que celle d'un bon.

Le facteur limitant de ce projet n'est pas la vitesse d'écriture du code.
C'est l'absence de données terrain.
