# Collecte terrain — Cybercafé

**Version 1 — 7 septembre 2026**
**Statut : protocole de collecte. Aucun développement en cours.**

---

## 1. Objectif de ce document

Recueillir les données nécessaires pour produire `CYBERCAFE_SPECIFICATIONS_V1.md`.

Principe directeur : **automatiser ou simplifier le fonctionnement existant sans le remplacer.**

Le MVP n'est pas décidé. Il sera la réponse à la plus grosse perte réelle identifiée ici,
et uniquement si l'automatisation produit un gain démontrable.

---

## 2. Trois natures de perte, classées par valeur

La collecte ne mesure pas seulement du temps. Elle mesure trois choses,
qui n'ont pas la même valeur économique.

| Rang | Nature | Pourquoi elle compte | Unité |
|---|---|---|---|
| 1 | **Fuite d'argent** — prestation rendue, jamais facturée | Gain immédiat, indépendant de la charge du personnel | € / mois |
| 2 | **Vente perdue** — client qui repart, poste bloqué | Gain immédiat | € / mois |
| 3 | **Temps** | Ne vaut que s'il est pris en heure de pointe (il bloque une vente) ou s'il est pris par le fondateur | h / mois |

**Règle d'analyse :** du temps de personnel économisé en heure creuse vaut zéro euro.
Il ne sera pas compté comme un gain. Toute tâche candidate doit être horodatée
pour savoir si elle tombe en pointe ou en creux.

---

## 3. Règles de collecte

1. **Un fait est ce qui a été compté ou chronométré.** Tout le reste est une hypothèse.
2. Chaque réponse est préfixée : `[FAIT]`, `[ESTIMATION PERSONNEL]`, ou `[HYPOTHÈSE]`.
3. Ne pas corriger le comportement observé pendant la mesure. On mesure le réel, pas l'idéal.
4. Ne rien promettre au personnel pendant l'observation. Une attente créée fausse les réponses.
5. Photographier plutôt que décrire quand c'est possible.

---

## 4. Les quatre instruments à mettre en place

### Instrument 1 — Feuille de vente (14 jours)

Une ligne par vente. À la caisse. Papier.

```
DATE : ____________          POSTE TENU PAR : ____________

Heure | Prestation          | Qté | Montant | Paiement | Remarque
------|---------------------|-----|---------|----------|----------
      |                     |     |         | ESP / CB |
      |                     |     |         | ESP / CB |
      |                     |     |         | ESP / CB |
```

Codes prestation à imprimer en haut de la feuille (à compléter au terrain) :
`IMP-NB` `IMP-COUL` `PHOTOCOP` `SCAN` `CONNEX` `AIDE` `PLASTIF` `RELIURE` `AUTRE`

**Ce que ça donne :** volume réel, ticket moyen, répartition du CA, courbe horaire
(donc : où sont les heures de pointe).

**Test caché :** si la feuille n'est pas remplie au bout de 5 jours, le personnel
ne saisira jamais rien dans un logiciel. Le projet devra alors s'orienter vers
la mesure automatique, pas vers la saisie. Noter honnêtement le taux de remplissage.

---

### Instrument 2 — Relevé de compteur imprimante (14 jours)

C'est la mesure la plus importante du protocole. Elle chiffre une fuite d'argent en euros.

Chaque imprimante possède un compteur total de pages
(menu de l'écran, ou impression d'une « page de configuration » / « rapport d'état »).

```
IMPRIMANTE : ____________  MODÈLE : ____________

Date | Compteur MATIN | Compteur SOIR | Pages du jour | Pages facturées (feuille de vente) | Écart
-----|----------------|---------------|---------------|------------------------------------|------
```

**Calcul final :** `Écart moyen/jour × prix de la page × jours ouvrés/mois = fuite mensuelle en €`

Si cette fuite dépasse quelques dizaines d'euros par mois, elle devient
le premier candidat MVP, devant toute considération de dashboard.

À noter aussi : les pages de test, de configuration et les reprises gratuites
gonflent l'écart. Les compter séparément sur la feuille de vente (`REPRISE`, gratuit).

---

### Instrument 3 — Feuille d'interruptions (5 jours consécutifs)

Une croix chaque fois qu'un membre du personnel se lève ou interrompt sa tâche
pour aider un client.

```
DATE : ____________

Heure | Motif (code) | Durée : <1min / 1-5min / >5min | Poste concerné
------|--------------|--------------------------------|----------------
```

Codes motif (à ajuster après une demi-journée d'observation) :

- `IMP` — problème d'impression
- `SCAN` — problème de scan / le client ne retrouve pas son fichier
- `NAV` — le client ne sait pas ouvrir un site ou une pièce jointe
- `CONN` — le poste ou le réseau ne répond pas
- `USB` — clé USB, transfert de fichier
- `DEM` — aide à une démarche administrative
- `AUT` — autre (préciser)

**Ce que ça donne :** fréquence réelle par motif, et surtout la répartition
horaire — donc si ce temps a une valeur ou non.

---

### Instrument 4 — Journal d'incidents (rétrospectif, 6 mois)

À remplir de mémoire avec le personnel, en une fois.

| Date approx. | Type | Description | Conséquence | Temps perdu |
|---|---|---|---|---|

Types : panne matérielle, panne réseau, virus, litige de paiement,
plainte client, données d'un client laissées accessibles, vol.

---

## 5. Chronomètres à relever

Trois mesures, chacune répétée **5 fois** à des moments différents. Noter les 5 valeurs, pas une moyenne.

| # | Ce qu'on chronomètre | Du... | ...au |
|---|---|---|---|
| C1 | Clôture du soir | le personnel commence à compter | le CA du jour est arrêté |
| C2 | Cycle d'impression complet | le client demande | le paiement est encaissé |
| C3 | Cycle de scan complet | le client pose son document | le client repart avec son fichier |

---

## 6. Questionnaire terrain

### A. Caisse

1. Quel outil enregistre les ventes aujourd'hui ? (caisse enregistreuse / logiciel / TPE seul / cahier / rien)
2. Si logiciel ou caisse : marque, modèle, version. **Photo de l'écran et de l'étiquette arrière.**
3. **Cet outil peut-il exporter des données ?** (export CSV/Excel, rapport imprimé, port USB, accès réseau, sauvegarde sur clé) — question centrale : elle décide si l'outil 1 peut lire l'existant au lieu de le remplacer.
4. Un ticket est-il remis au client ? Systématiquement ou sur demande ? **Photo d'un ticket.**
5. Modes de paiement acceptés et part estimée de chacun.
6. Qui fait la clôture, à quelle heure, selon quelle procédure exacte ?
7. Comment le CA de la journée est-il calculé et où est-il noté ?
8. Écarts de caisse : fréquence, montant typique, que fait-on quand il y en a un ?
9. Volume : nombre d'encaissements par jour (chiffre du personnel, puis chiffre réel de l'instrument 1).
10. Le cybercafé vend-il actuellement des consommables, snacks ou boissons ? **Oui / Non / Ne sait pas.** Question factuelle uniquement : ne pas instruire cette activité plus avant à ce stade.

### B. Impressions

1. **Workflow complet, étape par étape**, du moment où le client arrive avec son besoin jusqu'au paiement. Écrire chaque étape, y compris « le client ne sait pas ouvrir sa pièce jointe ».
2. D'où vient le fichier à imprimer ? (clé USB, boîte mail du client, site administratif, photo du téléphone, document papier à photocopier)
3. Nombre d'imprimantes, modèles, connexion (USB sur un poste précis / réseau / Wi-Fi). **Photo de chacune.**
4. Le compteur de pages est-il accessible ? Où, comment ? (voir instrument 2)
5. Comment les pages sont-elles comptées pour facturer aujourd'hui ?
6. Erreurs : à quelle fréquence une impression est-elle ratée ? Pour quelles causes ?
7. Reprises gratuites : combien par jour ? Qui décide ?
8. Coût réel : prix d'une cartouche/toner, nombre de pages annoncé, prix du papier. → coût par page.
9. Prix de vente par page (N&B, couleur, recto-verso, A3 si applicable).

### C. Scans

1. **Workflow complet, étape par étape.** Qui manipule : le client ou le personnel ?
2. Matériel utilisé : scanner dédié, imprimante multifonction, téléphone ?
3. **Où atterrit le PDF ?** (dossier du poste, bureau, clé USB du client, mail envoyé, cloud) — c'est ici que se situent la plupart des blocages.
4. Comment le client repart-il avec son fichier ? Est-ce qu'il y arrive seul ?
5. Difficultés concrètes observées : fichier introuvable, format non accepté par le site administratif, taille trop grosse, plusieurs pages à regrouper, orientation.
6. Le fichier scanné reste-t-il sur le poste après le départ du client ? → à croiser avec le volet sécurité.
7. Fréquence : combien de scans par jour ? Le scan est-il facturé ?

### D. Postes clients

1. Nombre de PC. Tous identiques ?
2. OS exact et version (`winver` sous Windows). Âge approximatif, RAM.
3. Comment une session client démarre-t-elle aujourd'hui ? (session Windows unique déjà ouverte / mot de passe donné par le personnel / autre)
4. Y a-t-il un mot de passe ? Est-il affiché, connu des clients ?
5. Les clients ont-ils les droits administrateur ?
6. **Top 10 des usages réels** observés sur une journée.
7. **Procédure entre deux clients : que fait-on exactement ?** (rien / fermeture du navigateur / redémarrage / suppression de fichiers / outil de restauration)
8. Reste-t-il des traces du client précédent ? À vérifier sur un poste au hasard : historique du navigateur, sessions restées ouvertes, fichiers sur le bureau, dossier Téléchargements, documents dans la corbeille.
9. Quels logiciels sont installés ? Antivirus ? À jour ?

### E. Personnel

1. Combien de personnes, quels horaires, quel niveau technique réel ?
2. Rotation : depuis combien de temps sont-ils là ?
3. Comptes utilisés : chacun a-t-il son propre compte, ou un compte partagé ?
4. **Top 5 des demandes clients**, dans leurs mots.
5. **Top 5 des tâches qu'ils refont plusieurs fois par jour**, dans leurs mots.
6. Question à poser telle quelle : *« Si tu pouvais supprimer une seule tâche de ta journée, laquelle ? »*
7. Question à poser telle quelle : *« Qu'est-ce qui te fait perdre le plus de temps avec un client ? »*
8. Sont-ils saturés aux heures de pointe, ou attendent-ils entre deux clients ? Observer, ne pas demander.

### F. Réseau et serveur

1. Box : FAI, offre grand public ou professionnelle, modèle. **Photo.**
2. Débit réel mesuré (test depuis un poste client, aux heures de pointe et en heure creuse).
3. Coupures : fréquence, durée, que fait-on pendant ?
4. **Le « hub » / « serveur » : qu'est-ce que c'est physiquement ?** Machine dédiée, NAS, simple switch, rien ? **Photo du local technique, câblage inclus.**
5. S'il existe une machine serveur : OS, rôle exact, qui y accède, mot de passe partagé ?
6. Wi-Fi client : existe-t-il ? Ouvert ou avec mot de passe ? Le mot de passe est-il affiché au mur ? Est-ce le même réseau que les postes de travail et la caisse ?
7. **Sauvegardes : existe-t-il quoi que ce soit ?** De quoi, où, à quelle fréquence, quelqu'un a-t-il déjà testé une restauration ?
8. Accès à distance actif sur une machine (TeamViewer, AnyDesk, RDP) ?

#### F8 — Conservation actuelle des données de connexion Internet

*Repère F8. Distinct du point 8 ci-dessus, qui porte sur l'accès à distance.*

Objectif : documenter uniquement les faits existants, afin de permettre
l'instruction juridique du point V2 (`docs/CADRE_REGLEMENTAIRE.md` §3).

Le cybercafé conserve-t-il actuellement des données de connexion Internet,
pour les postes ou pour l'accès Wi-Fi public ?

- Oui / Non / Ne sait pas
- Si oui, lesquelles ? (IP, date/heure, durée, autre)
- Où sont-elles conservées ? (box, routeur, serveur, logiciel, autre)
- Depuis combien de temps sont-elles conservées ?
- Qui peut y accéder ?
- Existe-t-il une procédure de suppression ou d'expiration ?
- Photo ou capture de l'écran / de la configuration concernée, si possible.

**Consignes de passation :**

- Ne pas demander au personnel de conclure sur la conformité.
- Ne pas suggérer qu'une obligation s'applique déjà.
- `NE SAIT PAS` est une réponse valide et doit être notée telle quelle.

#### F9 — Occupation des postes

*Relevé continu, pas une question. Repère F9.*

Objectif : mesurer si la capacité est réellement saturée. C'est la seule mesure
capable de valider ou d'écarter un besoin de gestion de flotte ou de réservation.

- **Une mesure par heure d'ouverture, pendant 14 jours.**
- Noter l'**heure exacte** du relevé, pas l'heure prévue.
- Noter le **nombre de postes occupés** et le **nombre total disponibles**.
- Noter séparément les **postes indisponibles** et leur motif, si celui-ci est
  facilement observable (en panne, réservé au personnel, imprimante hors service,
  autre). Ne pas enquêter : si le motif n'est pas évident, écrire `INCONNU`.

```
DATE : ____________          POSTES INSTALLÉS AU TOTAL : ______

Heure exacte | Occupés | Disponibles | Indisponibles | Motif indisponibilité
-------------|---------|-------------|---------------|----------------------
```

Un relevé manqué se note `NON RELEVÉ`. Ne jamais reconstituer de mémoire.

---

#### F10 — Clients repartis sans être servis

*Relevé continu, pas une question. Repère F10.*

Objectif : mesurer la vente perdue, qui est la deuxième nature de perte par
ordre de valeur (§2).

Comptabiliser chaque client quittant le cybercafé **sans avoir obtenu le service
qu'il venait chercher**.

```
DATE : ____________

Heure | Motif
------|--------------------------------------------------------------
```

Motifs :

- aucun poste disponible
- attente trop longue
- problème technique
- service indisponible
- autre — à préciser en clair

**Aucune donnée nominative.** Ni nom, ni description physique, ni signalement
permettant d'identifier une personne. Une ligne = une heure et un motif.

Cas incertain — le personnel ne sait pas si le client cherchait un service :
noter la ligne avec le motif `INCERTAIN` plutôt que de l'omettre ou de l'interpréter.

### G. Incidents

Voir instrument 4.

---

## 7. Photos à rapporter

- [ ] Le comptoir et la caisse en fonctionnement
- [ ] L'écran de la caisse ou du logiciel de caisse
- [ ] Un ticket client
- [ ] Chaque imprimante, de face et de dos (connectique)
- [ ] Le rapport de configuration imprimé d'une imprimante (avec le compteur)
- [ ] Le scanner
- [ ] Un poste client au démarrage, tel que le client le trouve
- [ ] Le bureau Windows d'un poste, avec ses icônes
- [ ] Le local technique : box, switch, serveur, câblage
- [ ] La grille tarifaire affichée au mur

---

## 8. Volet légal — à traiter en parallèle

À vérifier auprès du comptable **pendant** la collecte, pas après.

Trois périmètres possibles pour le futur outil, du plus sûr au plus contraignant :

| Périmètre | Ce que l'outil enregistre | Qualification probable |
|---|---|---|
| **P1** | Volumes seuls : pages, sessions, durées. Aucun montant. | Hors champ |
| **P2** | Totaux journaliers recopiés depuis une caisse existante | Incertaine |
| **P3** | Le règlement du client | Logiciel de caisse — attestation requise |

**Orientation retenue par défaut : concevoir pour rester en P1.**
Ne passer en P2 ou P3 que si le terrain démontre que la perte se situe
dans l'encaissement lui-même.

Questions au comptable :

1. Un outil enregistrant uniquement des volumes physiques (pages, durées),
   sans aucun montant, sort-il du champ de l'art. 286-I-3° bis du CGI ?
2. Un logiciel développé en interne pour son propre usage peut-il faire l'objet
   d'une attestation individuelle de l'éditeur — et qui la signe ?
3. Si l'outil se contente de recopier le total journalier d'une caisse déjà conforme,
   est-il requalifié en logiciel de caisse ?
4. Quel est le risque réel en cas de contrôle sur une requalification ?

---

## 9. Volet sécurité — actif dès maintenant, sans code

Ce volet n'attend pas les spécifications. Il produit une checklist et des procédures,
pas un logiciel. La collecte ci-dessus l'alimente directement.

Six sujets, dans l'ordre où le terrain les rendra prioritaires :

1. **Protection du serveur** — si une machine centrale existe : qui y accède, avec quel mot de passe, est-elle exposée à internet ?
2. **Séparation réseau** — la caisse et les postes du personnel doivent-ils être sur le même réseau que les postes clients et le Wi-Fi public ? (réponse par défaut : non)
3. **Sauvegardes** — quoi, où, à quelle fréquence, et une restauration testée. Point le plus souvent totalement absent.
4. **Remise à zéro des postes** — procédure entre deux clients.
5. **Protection des sessions précédentes** — comptes, historiques, fichiers et scans laissés par le client d'avant. Risque le plus grave du lieu, et sans rapport avec le chiffre d'affaires.
6. **Comptes et droits du personnel** — comptes nominatifs, retrait des droits administrateur sur les postes clients.

---

## 10. Ce qui sera produit à réception des données

Document `CYBERCAFE_SPECIFICATIONS_V1.md`, dans cet ordre :

1. Faits observés, séparés des hypothèses
2. Cartographie des workflows réels (caisse, impression, scan, session client)
3. Problèmes réels, avec fréquence et coût chiffré
4. Les trois plus grosses pertes, classées par nature (argent / vente perdue / temps)
5. Opportunités d'automatisation, avec gain estimé et coût de construction
6. Faisabilité technique
7. Implications réglementaires
8. Classement par ROI
9. MVP minimal recommandé
10. Architecture minimale et stack — **en dernier, et seulement à ce moment**

---

## 11. Périmètre exclu

Écartés à ce stade, ne pas les instruire pendant la collecte :

CRM · fidélité · réservation de poste · RADIUS · portail captif · CCBoot ·
diskless · statistiques temps réel · comptabilité · facturation avancée ·
remplacement du navigateur sur les postes clients.

---

## 12. Statut des trois outils

| Outil | Statut | Condition de déblocage |
|---|---|---|
| 1. Dashboard | **Candidat MVP, non validé** | Doit d'abord être démontré qu'il résout la plus grosse perte, et que les données sont récupérables depuis l'existant |
| 2. Bureau numérique | **Suspendu** | Preuve terrain d'un problème précis et répétitif que la configuration seule ne résout pas |
| 3. Sécurité | **Actif** | Aucune — avance en parallèle, sous forme de configuration et de procédures |
