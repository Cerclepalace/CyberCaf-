# CYBERCAFÉ — ARCHITECTURE CIBLE ET VALIDATION V2

**Version 2.0 — 8 septembre 2026 · Visite terrain prévue le 9 septembre 2026**
**Statut : audit critique. Aucun développement. Aucune architecture retenue.**

Document complémentaire de `PROTOCOLE_VALIDATION_TERRAIN_V1.md`, qui reste le
protocole de conduite de la visite. Celui-ci traite l'inventaire technique et
l'évaluation des trois objectifs verrouillés.

---

## 1. Objectifs verrouillés

Trois objectifs fixés par décision du fondateur le 8 septembre 2026. Ils ne
sont pas remplacés par d'autres concepts. Ils ne sont pas non plus validés :
un objectif verrouillé reste soumis à la preuve terrain.

| # | Objectif | Nature réelle | Statut |
|---|---|---|---|
| **1** | Dashboard propriétaire — activité, CA, fréquentation, postes, impressions, indicateurs, tendances, alertes | Couche de lecture et d'analyse | Candidat, non validé |
| **2** | Widget de raccourcis web — accès rapide aux sites utiles | Configuration de poste | Candidat, non validé |
| **3** | Sécurité connectée — supervision, détection d'anomalies, alertes qualifiées | Supervision technique | Candidat, non validé |

### 1.1 Note sur l'objectif 2 — une objection antérieure tombe

L'ancien « outil 2 » était un **bureau numérique simplifié avec gestion de
sessions**. Il était suspendu pour une raison précise : gérer des sessions
d'accès Internet **crée** des données de connexion, donc potentiellement une
obligation de conservation d'un an (point O3), donc un stock de données
personnelles là où il n'y en avait peut-être aucun.

**Un widget de raccourcis ne fait rien de tout cela.** Il ne remplace pas le
navigateur, n'ouvre ni ne ferme de session, n'identifie personne, ne journalise
rien. La reformulation supprime le risque réglementaire qui motivait la
suspension.

`FAIT DE GOUVERNANCE` : la suspension de l'ancien outil 2 ne s'applique pas au
widget tel que redéfini. Elle reste valable pour toute réintroduction de gestion
de sessions.

Cela ne rend pas le widget utile pour autant. Voir §5.

### 1.2 Contradiction signalée, non résolue

`CLAUDE.md` fixe : *phase collecte terrain, aucun développement autorisé*.
Les objectifs verrouillés décrivent des produits à construire.

Il n'y a contradiction que si « verrouillé » signifie « décidé ». Lecture
retenue ici : les objectifs bornent le **périmètre de recherche**, ils ne
déclenchent aucune construction. La règle « aucun code avant données terrain »
reste en vigueur.

Si l'intention était l'inverse — construire les trois quoi qu'il arrive — le
point doit être tranché explicitement, et la moitié de ce document devient sans
objet. Je ne tranche pas à ta place.

---

## 2. Ce qui est déjà établi

| Élément | Statut |
|---|---|
| Contenu du dépôt, documents produits, règles de gouvernance | **FAIT CONFIRMÉ** |
| Les trois objectifs sont verrouillés par décision du fondateur | **FAIT DE GOUVERNANCE** |
| Une visite est prévue le 9 septembre dans un établissement réel | **DÉCLARÉ** |
| Le lieu est un cybercafé | **DÉCLARÉ** — jamais observé |
| Clientèle âgée, personnel non technique, impressions/scans/démarches | **DÉCLARÉ** — description initiale, non vérifiée |
| Le régime des logiciels de caisse s'applique aux systèmes enregistrant des paiements | **À VÉRIFIER** — source secondaire, classée V1 |
| Obligation de conservation des données de connexion | **À VÉRIFIER** — point O3, déclassé volontairement |
| Fuite sur les impressions, temps perdu en assistance | **HYPOTHÈSE** |

**Aucun fait technique concernant l'établissement n'est établi.** Zéro. Tout ce
qui suit sur l'infrastructure est conditionnel.

---

## 3. Ce qui est encore inconnu

Liste des inconnues qui bloquent réellement la conception. Chacune se lève
demain, ou reste bloquante.

### Bloquant pour l'objectif 1

- `INCONNU` Existe-t-il une caisse ? Marque, modèle, version.
- `INCONNU` **Cette caisse exporte-t-elle un fichier ?** Question la plus
  déterminante de toute la visite.
- `INCONNU` Si oui : quel format, quelle granularité, déclenchement manuel ou
  automatique, accessible par le réseau ou seulement par clé USB.
- `INCONNU` Y a-t-il un TPE, et produit-il ses propres relevés ?
- `INCONNU` Comment les impressions sont-elles comptées et facturées ?
- `INCONNU` Les imprimantes sont-elles en réseau (donc interrogeables) ou en USB ?

### Bloquant pour l'objectif 2

- `INCONNU` Quels sites sont réellement utilisés, et à quelle fréquence ?
- `INCONNU` Le poste client a-t-il déjà des favoris, une page d'accueil, des
  raccourcis bureau ? Si oui, pourquoi ne suffisent-ils pas ?
- `INCONNU` Quel navigateur, quelle version, quels droits sur les postes ?

### Bloquant pour l'objectif 3

- `INCONNU` Quel routeur ? Box FAI grand public, ou équipement pro ?
- `INCONNU` Y a-t-il un pare-feu autre que celui de la box ?
- `INCONNU` Y a-t-il une machine qui reste allumée en permanence ?
- `INCONNU` Quel antivirus ? Defender par défaut, ou une solution centralisée ?
- `INCONNU` **Existe-t-il un accès administrateur, et nous serait-il accordé ?**
- `INCONNU` Les postes sont-ils dans un domaine, un groupe de travail, ou rien ?
- `INCONNU` Qui intervient aujourd'hui quand une machine tombe en panne ?

### Bloquant pour les trois

- `INCONNU` Le propriétaire est-il sur place ? Est-il le décideur ?
- `INCONNU` Dépense-t-il aujourd'hui de l'argent en logiciel ? Combien ?
- `INCONNU` L'établissement est-il en croissance, stable, ou en déclin ?

---

## 4. OBJECTIF 1 — Dashboard propriétaire

### 4.1 Valeur pour le propriétaire

Voir son activité sans avoir à la reconstituer. Détecter une dérive avant la fin
du mois. Comparer des périodes.

**Réserve majeure :** si la caisse imprime déjà un ticket Z quotidien avec le
total, l'information *existe déjà*, chaque soir, sur papier. La valeur du
dashboard n'est alors ni l'information ni le calcul — c'est **l'historisation,
la tendance et la consultation à distance**. C'est une valeur réelle, mais
c'est une valeur de confort, pas une valeur de production.

Le test décisif est dans le protocole V1, bloc 5 : *« Comment savez-vous si un
mois a été bon ou mauvais ? »* Réponse immédiate et précise → objectif 1 en
grande difficulté.

### 4.2 Problème réel auquel il répond

`HYPOTHÈSE` — le propriétaire pilote au ressenti et ne détecte les dérives
qu'avec retard. Non démontré.

`HYPOTHÈSE` — une partie du CA (impressions notamment) échappe au comptage.
C'est le seul problème de cette famille qui se chiffre directement en euros.

### 4.3 Données nécessaires

Par ordre de préférence décroissante :

1. **Export de la caisse existante** — fichier, lisible, régulier. Idéal.
2. **Compteurs physiques** — pages imprimées relevées sur l'imprimante.
   Ne nécessite aucune caisse et reste en niveau **E0** (volumes, aucun montant).
3. **Saisie manuelle** — dernier recours. Crée une tâche quotidienne au lieu
   d'en supprimer une, et fait basculer vers **E1/E2**, donc vers la gate
   fiscale P2. **À éviter.**

### 4.4 Infrastructure nécessaire

Minimale : une machine qui reste allumée et qui lit un fichier ou interroge une
imprimante. Un mini-PC ou l'ordinateur du comptoir suffit. Aucun serveur, aucun
cloud obligatoire.

### 4.5 Dépendances

| Dépendance | Criticité | Commentaire |
|---|---|---|
| Format d'export de la caisse | **Critique** | Si absent, tout l'objectif change de nature |
| Stabilité de ce format dans le temps | Élevée | Une mise à jour de la caisse peut casser l'import |
| Accès SNMP/IPP aux imprimantes réseau | Moyenne | Permettrait de lire les compteurs sans agent |
| Une machine allumée en permanence | Faible | Facile à satisfaire |

### 4.6 Risques

- **Réglementaire** — dès qu'un montant lié à un règlement est enregistré, gate
  P2. Rester en E0 supprime le risque par construction.
- **Fiabilité de la donnée** — un dashboard alimenté par une saisie irrégulière
  affiche des chiffres faux. Un chiffre faux est pire que pas de chiffre : il
  fonde des décisions.
- **Abandon** — un tableau que personne ne regarde après trois semaines.
- **Dépendance à un format non documenté** — reverse-engineering d'un export
  propriétaire, à refaire à chaque mise à jour.

### 4.7 Concurrence

`À VÉRIFIER` — je n'ai pas vérifié l'état du marché en 2026 et je ne peux pas
le faire depuis ici.

Catégories qui existaient et qu'il faut examiner :

- logiciels de gestion de cybercafé (recherche : *cyber cafe management software*) ;
- logiciels de caisse avec module de reporting intégré — souvent déjà présent
  dans la caisse existante, et déjà payé ;
- **logiciels de comptabilisation d'impression** (recherche : *print accounting*,
  *print quota*) — catégorie mature. Si le problème principal est la fuite sur
  les impressions, un produit établi le résout peut-être déjà.

**Vérifier ce dernier point avant tout développement.** Reconstruire une
catégorie mature est le plus mauvais investissement possible.

### 4.8 Complexité

Faible à moyenne **si** un export exploitable existe.
Élevée sinon — il faut alors construire la collecte, ce qui n'est plus un
dashboard mais un système d'information.

### 4.9 Coût de réalisation

`HYPOTHÈSE` — ordres de grandeur pour un développeur seul assisté par IA :

| Scénario | Effort |
|---|---|
| Lecture d'un export propre + 3 écrans de lecture | 5 à 10 jours |
| Idem + lecture des compteurs d'imprimante en SNMP | +3 à 5 jours |
| Sans source de données : construction de la saisie | 15 à 25 jours, et changement de nature du projet |

### 4.10 Coût de maintenance

`HYPOTHÈSE` — 1 à 3 h/mois en régime normal, plus le support quand l'export
change de format ou que la caisse est mise à jour. Le support est imprévisible
et tombe aux heures d'ouverture de l'établissement.

### 4.11 Niveau de preuve disponible

**Aucun.** Zéro observation, zéro mesure. Uniquement des hypothèses.

### 4.12 Conditions pour démarrer

Les quatre, cumulativement :

1. Une source de données exploitable existe et a été **vue** — pas décrite.
2. Le propriétaire ne sait pas répondre rapidement à « comment savez-vous si le
   mois a été bon ? ».
3. Le périmètre reste en E0 ou E1, jamais E2 avant que V1 soit tranché.
4. Aucun produit existant ne couvre déjà le besoin (§4.7).

### 4.13 Conditions d'abandon

- Aucune source de données, et la seule voie est la saisie manuelle quotidienne.
- Le propriétaire suit déjà son activité correctement.
- Un produit existant fait le travail pour un prix inférieur au coût de
  maintenance de notre solution.
- Le format d'export change à chaque mise à jour de la caisse.

---

## 5. OBJECTIF 2 — Widget de raccourcis web

### 5.1 Valeur pour le propriétaire

Faible et indirecte. La valeur, si elle existe, va au **client** — trouver
impots.gouv sans le taper — et au **personnel**, qui n'a plus à le montrer.

### 5.2 Problème réel auquel il répond

`HYPOTHÈSE` — les clients ne savent pas atteindre les sites dont ils ont besoin,
et le personnel doit se déplacer pour le faire.

**Objection immédiate :** ce problème, s'il existe, est déjà résolu par des
mécanismes gratuits et universels — favoris du navigateur, page d'accueil,
raccourcis sur le bureau, page de démarrage HTML locale.

Donc la vraie question n'est pas « faut-il un widget ? » mais :

> **Les postes ont-ils déjà des favoris et une page d'accueil configurés ?**
> Si oui, pourquoi ne suffisent-ils pas ?

Trois réponses possibles, trois conclusions différentes :

| Réponse observée | Conclusion |
|---|---|
| Rien n'est configuré | Le problème n'est pas logiciel. C'est une heure de configuration par poste. **Aucun développement.** |
| C'est configuré mais les clients ne s'en servent pas | Le problème est l'usage, pas l'outil. Un widget aura le même sort |
| C'est configuré, mais ça se perd à chaque nettoyage de session | **Là seulement il y a un vrai problème technique** : la persistance de la configuration. Et sa solution est une image de poste ou une stratégie de groupe, pas un widget |

### 5.3 Données nécessaires

Aucune. C'est une liste de liens. C'est précisément ce qui rend l'objectif peu
risqué — et peu défendable comme produit.

### 5.4 Infrastructure nécessaire

Aucune. Un fichier HTML local défini comme page d'accueil suffit.
Aucun serveur, aucun réseau, fonctionne hors ligne par construction.

### 5.5 Dépendances

Navigateur installé. C'est tout. **C'est le seul des trois objectifs sans
dépendance sérieuse.**

### 5.6 Risques

- **Dérive fonctionnelle vers un gestionnaire de mots de passe.** Interdite par
  la règle, et c'est la bonne règle : stocker les identifiants de clients âgés
  sur un poste public serait la faute la plus grave possible du projet.
- **Dérive vers un profilage d'usage.** Compter les clics par site, c'est
  produire de la donnée sur des personnes. À proscrire.
- **Faux sentiment de valeur.** Livrer quelque chose de visible et rapide donne
  l'impression d'avancer, alors qu'aucun problème coûteux n'a été résolu.
- **Liens qui pourrissent.** Les URL des sites administratifs changent. Sans
  maintenance, le widget devient nuisible : il envoie les clients sur des pages
  mortes. C'est un coût récurrent pour une valeur faible.

### 5.7 Concurrence

Favoris de navigateur, page d'accueil, raccourcis Windows, mode kiosque,
stratégies de groupe. **Gratuits, universels, déjà installés, sans maintenance.**

C'est la concurrence la plus dure des trois objectifs, parce qu'elle est déjà
sur la machine.

### 5.8 Complexité

Très faible.

### 5.9 Coût de réalisation

`HYPOTHÈSE` — 0,5 à 2 jours pour une page HTML statique, gros boutons,
gros texte, contraste élevé, aucune dépendance externe.

### 5.10 Coût de maintenance

Faible mais non nul : vérifier les liens. `HYPOTHÈSE` — 1 h par trimestre.
Sur cinq ans, cette heure trimestrielle coûte plus cher que le développement.

### 5.11 Niveau de preuve disponible

**Aucun.** Nous ne savons même pas quels sites sont utilisés.

### 5.12 Conditions pour démarrer

- La liste des sites réellement utilisés a été observée, pas devinée.
- Les postes n'ont pas déjà de configuration équivalente, **ou** cette
  configuration ne survit pas au nettoyage de session.
- Le propriétaire s'engage à signaler les liens morts.

### 5.13 Conditions d'abandon

- Les favoris existants suffisent.
- Les clients ne regardent pas la page d'accueil, quelle qu'elle soit.
- Le personnel dit que ce n'est pas ce qui lui prend du temps.

**Position à ce stade :** l'objectif 2 est probablement une tâche de
configuration déguisée en produit. C'est le moins risqué des trois, et le moins
utile. Le livrer en premier parce qu'il est facile serait une erreur de méthode :
on aurait dépensé la crédibilité de la première livraison sur ce qui rapporte le
moins.

---

## 6. OBJECTIF 3 — Sécurité connectée

C'est l'objectif le plus dangereux du projet. Pas techniquement : contractuellement.

### 6.1 Le problème de fond : la promesse et les sources de données

Une supervision ne peut signaler que ce qu'elle peut **observer**. Dans un petit
cybercafé, l'inventaire réaliste des sources est très pauvre :

| Source souhaitée | Disponibilité réelle | Condition |
|---|---|---|
| Disponibilité réseau (Internet up/down) | **Accessible** | Une machine allumée qui teste |
| Poste allumé / éteint / injoignable | **Accessible** | Ping sur le réseau local |
| Imprimante en panne, bac vide, compteur | **Probablement accessible** | Si l'imprimante est en réseau (SNMP/IPP) |
| Espace disque, mises à jour, ancienneté des définitions antivirus | **Accessible seulement avec un agent sur chaque poste** | Voir §6.5 |
| Journaux d'événements Windows | **Agent obligatoire** | Idem |
| Événements du pare-feu | `INCONNU` — **probablement indisponible** | Une box FAI grand public n'exporte pas ses journaux |
| Événements antivirus centralisés | `INCONNU` — **probablement indisponible** | Defender seul ne remonte rien sans console de gestion payante |
| Détection d'intrusion, comportement suspect | **Indisponible** | Aucune source ne le permet dans ce contexte |

**Conclusion à énoncer clairement : ce qui est réellement réalisable relève à
90 % de la supervision technique — panne, indisponibilité, matériel — et non de
la sécurité.**

Appeler ce module « sécurité connectée » crée une attente que l'architecture ne
peut pas satisfaire. Un propriétaire qui achète de la « sécurité » et qui se
fait pirater demandera des comptes. Le nom doit correspondre à la capacité
réelle : **supervision technique**.

### 6.2 Qualification des alertes

La règle demandée est juste et doit être appliquée strictement. Toute alerte
porte un niveau de confiance et une nature :

| Nature | Exemple | Confiance |
|---|---|---|
| **Panne** | Poste 4 injoignable depuis 20 min | Élevée |
| **Mauvaise configuration** | Imprimante hors ligne, IP changée | Élevée |
| **Comportement inhabituel** | Un poste allumé à 3 h du matin | Moyenne — factuel, interprétation incertaine |
| **Incident de sécurité** | Defender a mis un fichier en quarantaine | Moyenne, et seulement avec agent |
| **Suspicion** | — | À n'émettre qu'avec une source qui la fonde |
| **Attaque confirmée** | — | **Hors de portée. Ne jamais afficher ce niveau.** |

Une alerte sans niveau de confiance est une alerte qui sera ignorée après deux
faux positifs. Le taux de faux positifs, pas la couverture, détermine si un
système de supervision est utilisé ou désactivé.

### 6.3 Valeur pour le propriétaire

Réelle si — et seulement si — il perd aujourd'hui de l'argent à cause de pannes
non détectées : un poste hors service pendant deux jours sans que personne ne
s'en aperçoive, une imprimante en panne un samedi matin.

`HYPOTHÈSE`. Dans une salle de dix postes que le gérant voit de son comptoir,
la supervision automatique n'apporte peut-être rien : **il voit déjà.**

C'est l'argument le plus fort contre cet objectif, et il faut le tester demain
en regardant simplement si le gérant voit toute la salle depuis sa place.

### 6.4 Infrastructure nécessaire

- Une machine allumée en permanence sur le réseau local.
- Un moyen d'envoyer les alertes : notification, e-mail, message. Sortie
  Internet requise pour cela — donc le seul point où la dépendance réseau est
  incontournable, et il faut prévoir le cas où c'est justement Internet qui
  tombe.
- **Pour tout ce qui dépasse le ping : un agent sur chaque poste.**

### 6.5 L'agent sur les postes clients — la dépendance la plus dangereuse du projet

Installer un logiciel sur les machines d'un tiers, en accès public, engage
lourdement.

- Il tourne avec des privilèges élevés sur des machines utilisées par le public :
  **il devient lui-même une surface d'attaque.**
- S'il consomme trop, ralentit un poste, ou empêche un démarrage, c'est notre
  faute et c'est immédiatement visible.
- Il faut le déployer sur chaque machine, le mettre à jour, gérer les postes
  réinstallés.
- Il faut un accès administrateur — `INCONNU`, à demander demain.
- Il crée une responsabilité : si une donnée fuit ou si un poste devient
  inutilisable, la question de la responsabilité se pose, et aucun contrat ne
  la couvre aujourd'hui.

**Position : aucun agent en v1.** Tout ce qui se mesure depuis le réseau
(disponibilité, imprimantes) se mesure sans rien installer. L'agent n'est
justifiable que si la supervision sans agent a démontré sa valeur et que le
manque est précisément identifié.

### 6.6 Concurrence

`À VÉRIFIER` — état du marché 2026 non vérifié.

La catégorie existe, est mature, et comporte des options gratuites :

- outils de supervision réseau et de disponibilité, dont des solutions libres
  auto-hébergeables ;
- outils d'administration à distance de parc (recherche : *RMM*), avec des
  offres gratuites jusqu'à un certain nombre de postes ;
- consoles de gestion d'antivirus, souvent incluses dans les licences pro.

**Construire un RMM seul n'est pas réaliste.** Ces produits représentent des
années-hommes et leur valeur tient à leur fiabilité, pas à leurs
fonctionnalités. La bonne question n'est pas « comment le construire » mais
« lequel installer, et faut-il quelque chose par-dessus ».

### 6.7 Complexité

Élevée pour un résultat fiable. Une supervision qui produit des faux positifs
est pire que rien : elle sera coupée au bout d'une semaine, et elle aura
consommé la confiance.

### 6.8 Coût de réalisation

`HYPOTHÈSE` :

| Périmètre | Effort |
|---|---|
| Disponibilité + imprimantes, sans agent, alertes simples | 8 à 15 jours |
| Ajout d'un agent poste fiable et déployable | 20 à 40 jours **supplémentaires** |
| Corrélation, qualification, réduction des faux positifs | Ouvert. C'est là que passe l'essentiel du temps |

### 6.9 Coût de maintenance

`HYPOTHÈSE` — 4 à 8 h/mois, plus un engagement de disponibilité implicite :
un système d'alerte qui tombe en panne le samedi doit être réparé le samedi.

**C'est la question décisive pour un fondateur seul qui mène plusieurs projets
en parallèle. Un système de supervision installé chez un tiers crée une astreinte
de fait. Cet engagement doit être assumé avant d'écrire une ligne, pas découvert
après.**

### 6.10 Niveau de preuve disponible

**Aucun.** Nous ne savons pas s'il y a des pannes, ni combien elles coûtent.

### 6.11 Conditions pour démarrer

- Des pannes non détectées ont réellement coûté quelque chose — un incident daté
  et chiffré, pas une impression générale.
- Le gérant ne voit pas toute sa salle depuis son poste.
- Une machine peut rester allumée.
- Le périmètre est nommé **supervision technique**, pas sécurité.
- Aucun produit existant ne couvre le besoin pour moins cher que notre coût de
  maintenance.
- L'astreinte implicite est acceptée en connaissance de cause.

### 6.12 Conditions d'abandon

- Le gérant voit toute la salle et détecte les pannes en quelques minutes.
- Aucun incident coûteux dans les douze derniers mois.
- Pas d'accès administrateur, et pas de machine pouvant rester allumée.
- Un outil existant couvre le besoin.
- L'astreinte n'est pas tenable — **critère suffisant à lui seul.**

---

## 7. Architecture technique candidate

Aucune technologie n'est retenue. Ce sont des principes, à confronter au terrain.

### 7.1 Principes

1. **Local d'abord.** Tout ce qui peut fonctionner sans Internet fonctionne sans
   Internet. Un cybercafé dont la connexion tombe ne doit pas perdre en plus son
   outil de gestion.
2. **Trois choses séparées, pas une plateforme.** Les trois objectifs ne
   partagent presque aucune donnée : le dashboard lit des données commerciales,
   le widget est une page statique côté client, la supervision observe le
   réseau. Les réunir créerait un couplage sans bénéfice — une panne de l'un
   ferait tomber les autres.
3. **Aucun agent sur les postes clients en v1.**
4. **Lecture seule partout où c'est possible.** Ne rien écrire sur les systèmes
   existants.
5. **Permissions minimales.** Un compte en lecture, jamais un compte
   administrateur permanent.
6. **Collecte minimale.** Aucune donnée nominative, aucun historique de
   navigation, aucun identifiant client. Si une donnée n'a pas de finalité
   écrite, elle n'est pas collectée.
7. **Une seule machine à administrer**, pas un parc.
8. **Réinstallable en une heure.** Si la machine meurt, la remise en service ne
   doit pas dépendre de nous.

### 7.2 Forme candidate

```
   [ Caisse existante ]        [ Imprimantes réseau ]        [ Postes clients ]
            │ export                    │ SNMP / IPP                  │ ping
            │ (fichier)                 │ (lecture seule)             │ (rien d'installé)
            ▼                           ▼                             ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │   Une machine locale, allumée en permanence (mini-PC ou poste       │
   │   du comptoir). Stockage fichier ou base légère. Aucun cloud.       │
   │                                                                      │
   │   Module A — lecture / reporting      (objectif 1)                   │
   │   Module C — supervision technique    (objectif 3)                   │
   │   Modules indépendants : l'un peut tomber sans l'autre.             │
   └──────────────────────────────────────────────────────────────────────┘
            │ page web sur le réseau local          │ alerte sortante
            ▼                                        ▼
     [ Téléphone du propriétaire ]            [ Notification / e-mail ]
     (même Wi-Fi, aucun compte)               (seul point nécessitant Internet)


   Le widget (objectif 2) ne figure pas dans ce schéma : c'est un fichier
   HTML local sur chaque poste, sans lien avec le reste. C'est voulu.
```

### 7.3 Ce que cette architecture refuse explicitement

- Pas de cloud obligatoire.
- Pas de comptes utilisateurs, pas de mots de passe à gérer.
- Pas de base de données serveur si un fichier suffit.
- Pas d'agent sur les postes clients.
- Pas d'écriture dans la caisse ni dans aucun système existant.
- Pas de synchronisation multi-établissements. Un seul lieu, un seul système.

---

## 8. Données nécessaires — inventaire à établir demain

| Donnée | Pour quel objectif | Comment l'obtenir | Bloquant ? |
|---|---|---|---|
| Marque/modèle/version de la caisse | 1 | Photo | **Oui** |
| Capacité et format d'export de la caisse | 1 | Le faire faire devant nous | **Oui** |
| Modèle des imprimantes + réseau ou USB | 1, 3 | Photo dos + étiquette | **Oui** |
| Compteur de pages accessible | 1 | Page de configuration | Non |
| Nombre de postes, OS, version | 2, 3 | Observation + `winver` | **Oui** |
| Navigateur, favoris et page d'accueil existants | 2 | Regarder un poste | **Oui** |
| Procédure de remise à zéro entre clients | 2, 3 | Question + observation | **Oui** |
| Modèle de box/routeur | 3 | Photo | **Oui** |
| Pare-feu ou équipement réseau autre | 3 | Photo local technique | **Oui** |
| Antivirus installé | 3 | Regarder un poste | **Oui** |
| Machine allumée en permanence | 1, 3 | Question | **Oui** |
| Accès administrateur possible | 3 | Question directe | **Oui** |
| Qui dépanne aujourd'hui, à quel prix | 1, 3 | Question | Non |
| Incidents des 12 derniers mois, datés et chiffrés | 3 | Question | **Oui** |
| Sites réellement utilisés par les clients | 2 | Observation | **Oui** |
| Le gérant voit-il toute la salle de sa place ? | 3 | Observation directe | **Oui** |

Douze données bloquantes. Une visite qui n'en rapporte pas au moins dix ne
permet aucune décision.

---

## 9. Risques

### 9.1 Risques réglementaires

| Risque | Objectif | Gravité | Traitement |
|---|---|---|---|
| Requalification en logiciel de caisse | 1 | Élevée | Rester en E0. Gate P2 bloquée jusqu'à V1 |
| Collecte de données personnelles de clients | 2, 3 | Élevée | Ne rien collecter. Aucun identifiant, aucun historique |
| Création d'une obligation de conservation | — | Nulle dans le périmètre actuel | Aucun des trois objectifs ne gère de sessions |
| Responsabilité en cas d'incident sur un poste tiers | 3 | **Non traitée** | Aucun cadre contractuel n'existe aujourd'hui |

### 9.2 Risques de cybersécurité créés par le projet lui-même

- Un agent sur les postes = surface d'attaque supplémentaire sur des machines
  publiques.
- Une machine de supervision avec des accès réseau = cible privilégiée.
- Une interface web accessible sur le réseau local = accessible aussi aux
  clients si le réseau n'est pas séparé.
- Des identifiants d'accès aux équipements stockés quelque part = risque
  classique et sous-estimé.

**Le projet peut dégrader la sécurité qu'il prétend améliorer.** C'est le
paradoxe habituel des outils de supervision, et il doit être traité dès la
conception, pas après.

### 9.3 Risques de maintenance et d'exploitation

- Astreinte de fait sur l'objectif 3.
- Formats d'export qui changent sans prévenir.
- Un fondateur seul, quatre autres projets actifs, un client qui appelle un
  samedi.
- Aucune procédure de reprise si la machine locale meurt.

### 9.4 Coûts cachés

- Déplacements sur site — chaque intervention physique coûte une demi-journée.
- Support téléphonique avec un interlocuteur non technique.
- Matériel : un mini-PC, un onduleur éventuel, un disque de sauvegarde.
- Temps passé à comprendre un format d'export non documenté.
- Le coût de l'échec : un système installé puis abandonné laisse une trace
  négative chez le client et chez ses confrères.

---

## 10. Concurrence

`À VÉRIFIER` sur les trois lignes. État du marché 2026 non vérifié — recherche
à faire, si possible avant la visite.

| Objectif | Concurrence probable | Effet si elle existe |
|---|---|---|
| **1 — Dashboard** | Reporting déjà inclus dans la caisse ; logiciels de gestion de cybercafé ; logiciels de comptabilisation d'impression | Peut annuler l'objectif, surtout sur le volet impressions |
| **2 — Widget** | Favoris, page d'accueil, raccourcis, mode kiosque — gratuits et déjà installés | **Annule presque certainement l'objectif comme produit** |
| **3 — Supervision** | Outils de supervision libres ; solutions RMM avec offre gratuite ; consoles antivirus | Rend le développement propre difficilement justifiable |

**Une bonne partie du travail de demain consiste à découvrir ce qui est déjà
installé et déjà payé.** Une fonctionnalité déjà couverte par un logiciel présent
sur place est une fonctionnalité morte.

---

## 11. Questions à poser demain

À poser **après** la phase de découverte du problème décrite dans
`PROTOCOLE_VALIDATION_TERRAIN_V1.md`. Sortir une liste de questions techniques
en arrivant transforme l'entretien en visite commerciale et fausse tout ce qui
suit.

### Caisse et données

1. Vous enregistrez les ventes comment ? Vous pouvez me montrer ?
2. Ce logiciel, il peut sortir un fichier ? *(demander à le faire devant nous)*
3. Vous imprimez un ticket de fin de journée ? Vous le gardez ?
4. Il tourne sur quelle machine ? Elle reste allumée ?

### Impressions

5. Comment vous comptez les pages pour facturer ?
6. Les imprimantes sont branchées comment — en réseau, ou sur un poste ?
7. Vous savez combien de pages vous imprimez par mois ?

### Postes

8. Les postes sont tous pareils ? Ils ont quel Windows ?
9. Quand un client s'installe, il trouve quoi à l'écran ?
10. Il y a des favoris, une page d'accueil ? *(regarder soi-même)*
11. Entre deux clients, vous faites quoi sur la machine ?
12. Les clients peuvent installer des choses ?

### Réseau et sécurité

13. Vous avez quelle box ? Un abonnement pro ou particulier ?
14. Il y a autre chose dans le local technique ? *(demander à voir)*
15. Il y a une machine allumée en permanence ?
16. Vous avez un antivirus ? Lequel ?
17. Qui a le mot de passe administrateur des postes ?
18. Quand une machine tombe en panne, qui vient ? Vous le payez combien ?
19. Il s'est passé quoi de grave sur les douze derniers mois ? *(dates et coûts)*
20. Une machine est déjà restée en panne plusieurs jours sans que vous le
    remarquiez ?

### Argent et décision

21. Vous payez quoi aujourd'hui en logiciels ou abonnements ? Combien par mois ?
22. C'est vous qui décidez des achats ?

---

## 12. Observations à réaliser demain

À faire sans poser de question. Ce qui est observé vaut plus que ce qui est dit.

- [ ] **Le gérant voit-il toute la salle depuis son poste ?** Se mettre à sa
      place et regarder. Répond à lui seul à une grande partie de l'objectif 3.
- [ ] Nombre de postes, allumés, éteints, hors service.
- [ ] Ce qu'affiche un poste au démarrage. **Photo de l'écran d'accueil.**
- [ ] Favoris et page d'accueil du navigateur sur un poste. **Photo.**
- [ ] Dossier Téléchargements et bureau d'un poste : reste-t-il des fichiers du
      client précédent ?
- [ ] Marque et modèle de la box. **Photo.**
- [ ] Local technique : tout ce qui a une LED. **Photo d'ensemble et du câblage.**
- [ ] Arrière des imprimantes : câble réseau ou USB ? **Photo.**
- [ ] Écran de la caisse. **Photo.**
- [ ] Tout papier manuscrit scotché sur un mur ou une machine. **Photo de chacun.**
- [ ] Combien de fois le personnel se lève, et pourquoi. **Chronométrer.**
- [ ] Quels sites sont ouverts sur les écrans des clients, sans se pencher.

---

## 13. Critères GO / NO-GO

### 13.1 Règle générale

Aucun objectif ne démarre parce qu'il paraît utile. Chaîne obligatoire :

```
PROBLÈME → PREUVE → VALEUR → DONNÉES → FAISABILITÉ → RISQUE → SOLUTION
```

Un maillon manquant arrête la chaîne. Aucune exception.

### 13.2 Par objectif

| Objectif | GO conditionnel si | NO-GO si |
|---|---|---|
| **1 — Dashboard** | Une source de données a été **vue** fonctionner **et** le propriétaire ne sait pas dire rapidement si son mois a été bon **et** aucun produit existant ne couvre le besoin | Aucune source exploitable, seule voie = saisie manuelle quotidienne · ou il pilote déjà correctement · ou la caisse fait déjà le reporting |
| **2 — Widget** | Les postes n'ont pas de configuration équivalente **ou** elle ne survit pas au nettoyage de session, **et** la liste des sites a été observée | Les favoris existants suffisent · ou personne ne regarde la page d'accueil · ou ce n'est pas ce qui fait perdre du temps |
| **3 — Supervision** | Un incident coûteux daté et chiffré dans les 12 derniers mois **et** le gérant ne voit pas toute sa salle **et** une machine peut rester allumée **et** l'astreinte est acceptée | Le gérant voit tout · ou aucun incident coûteux · ou pas d'accès administrateur · ou un outil existant suffit · **ou l'astreinte n'est pas tenable** |

### 13.3 Règle de séquence

**Un seul objectif à la fois.** Trois chantiers en parallèle chez un fondateur
seul menant déjà plusieurs projets, c'est trois abandons.

Le premier objectif doit être terminé, installé, et **utilisé pendant un mois
sans intervention** avant que le deuxième ne commence. « Utilisé sans
intervention pendant un mois » est le seul critère de succès qui compte.

---

## 14. Fonctionnalités interdites ou prématurées

### Interdites — quel que soit le résultat de la visite

- Gestionnaire de mots de passe, stockage ou saisie d'identifiants clients.
- Historique de navigation, journal des sites visités, profilage d'usage.
- Toute donnée nominative sur un client.
- Affichage d'un niveau « attaque confirmée » ou « détection d'attaque en temps
  réel ».
- Prise de contrôle à distance d'un poste client.
- Remédiation automatique — un système qui agit seul sur une machine tierce.
- Enregistrement d'un règlement tant que la gate P2 est fermée.
- Écriture dans la caisse ou dans tout système existant.

### Prématurées — à réexaminer seulement après un objectif livré et stable

- Agent sur les postes clients.
- Cloud, synchronisation, accès hors du réseau local.
- Comptes utilisateurs, rôles, permissions fines.
- Multi-établissements, multi-tenant.
- IA, détection d'anomalie par apprentissage, prédiction.
- Application mobile.
- Notifications temps réel autres qu'une alerte simple.
- Rapports personnalisables, exports, tableaux de bord configurables.
- Toute intégration d'API tierce.

---

## 15. Ordre de réalisation recommandé

### Étape 0 — Avant tout développement

1. Visite du 9 septembre : rapporter les douze données bloquantes du §8.
2. Recherche concurrentielle sur les trois catégories du §10.
3. Réponses de l'expert-comptable (V1) et du juriste (V2).

**Tant que l'étape 0 n'est pas close, aucune étape suivante ne commence.**

### Étape 1 — Le premier objectif

Choisi par la preuve, pas par la facilité. À ce stade, sans données, l'ordre le
plus probable — `HYPOTHÈSE`, à réviser après la visite :

| Rang | Objectif | Motif |
|---|---|---|
| **1er** | **Dashboard, en E0** — volumes seuls, alimenté par un export existant ou par les compteurs d'imprimante | Seul objectif dont le bénéfice peut se chiffrer en euros. Sans agent, sans risque fiscal, sans astreinte |
| **2e** | **Widget** — mais probablement comme configuration, pas comme développement | Coût quasi nul. À faire pendant une visite, pas dans un sprint |
| **3e** | **Supervision** — et d'abord en installant un outil existant, sans rien développer | Le plus coûteux, le plus risqué, le plus concurrencé, et le seul qui crée une astreinte |

### Étape 2 — Vérification avant d'aller plus loin

Le premier objectif doit avoir tourné **un mois complet sans notre intervention**
et être encore utilisé. Si le propriétaire ne l'ouvre plus au bout de trois
semaines, l'échec doit être constaté et analysé, pas compensé par de nouvelles
fonctionnalités.

### Étape 3 — Objectif suivant

Même chaîne, depuis le début : problème, preuve, valeur, données, faisabilité,
risque, solution.

---

## Ce qui, dans le raisonnement actuel, n'est pas démontré

Par honnêteté méthodologique, à relire avant toute décision :

1. **Qu'un problème coûteux existe dans ce cybercafé.** Aucune observation.
2. **Que le propriétaire cherche une solution.** Non testé.
3. **Qu'il a un budget.** Inconnu.
4. **Que les trois objectifs répondent à ses problèmes** plutôt qu'aux nôtres.
   Ils ont été définis avant toute observation — c'est l'inversion exacte de la
   méthode que le projet s'impose par ailleurs.
5. **Qu'un développement sur mesure batte les produits existants.** Non vérifié.
6. **Qu'un fondateur seul puisse assurer la maintenance et l'astreinte.** Non
   traité, et c'est probablement le risque le plus sous-estimé du projet.

Le point 4 mérite d'être formulé sans détour : **des objectifs verrouillés avant
la première observation restent des hypothèses, quel que soit leur statut de
gouvernance.** Verrouiller le périmètre de recherche est légitime. Verrouiller la
réponse avant d'avoir vu le terrain ne l'est pas.
