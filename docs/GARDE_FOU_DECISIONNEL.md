# Garde-fou décisionnel

**Version 1.0 — 8 septembre 2026, écrit AVANT la collecte terrain.**
**Statut : engagement de décision. À ne pas réécrire après la visite.**

---

## 0. Règle

> Avant la collecte, les scénarios qui justifieraient l'archivage du socle sont
> écrits à l'avance. Si un scénario se réalise, la décision de branchement du
> socle est **NO-GO** et le socle est **archivé comme actif non retenu**. Il ne
> doit pas être réinterprété pour lui trouver un usage.

Ce document n'a de valeur que parce qu'il est écrit **avant** de connaître le
résultat. Le modifier après la visite pour assouplir un seuil annulerait sa
fonction. Si un seuil se révèle mal calibré, cela se constate et s'écrit — cela
ne se corrige pas rétroactivement.

---

## 1. Ce que « archivage » veut dire, et ne veut pas dire

| Archivage signifie | Archivage ne signifie pas |
|---|---|
| Décision **NO-GO** sur le branchement du socle | Suppression du code |
| Inscription datée et motivée dans ce document | Suppression de la branche ou du dépôt |
| Statut « actif non retenu » | Effacement de l'historique git |
| Arrêt de tout développement sur l'objectif concerné | Interdiction de rouvrir sur preuve nouvelle |

**Le code reste en place, intact, dans le dépôt.** Ce qui s'arrête, c'est la
décision de s'en servir. Aucune suppression automatique.

---

## 2. Inversion de la charge de la preuve

Chaque scénario ci-dessous est **actif par défaut**. Il ne se déclenche pas :
il est déjà déclenché, et seule une preuve positive rapportée du terrain le
lève.

Formulé autrement : au 8 septembre 2026, **les huit scénarios sont tous
réalisés**, puisqu'aucune donnée terrain n'existe. La visite ne sert pas à
déclencher un NO-GO, elle sert à en lever un.

C'est ce qui rend le garde-fou falsifiable. Un scénario formulé comme « si
aucun problème significatif n'apparaît » ne se déclenche jamais, faute de
savoir quand le déclarer. Un scénario formulé comme « le NO-GO tombe si et
seulement si X est mesuré » se tranche.

---

## 3. Les scénarios

Les seuils cités viennent de `EVALUATION_CONCEPTS.md` §5 et de la règle des
quatre conditions cumulatives — problème dominant, mesuré, récurrent,
économiquement significatif. Ce sont des ordres de grandeur, à recalibrer sur
les volumes réels ; leur imprécision ne justifie pas de les ignorer.

---

### S1 — Aucune source réelle ne peut alimenter l'objectif 1

**NO-GO levé si et seulement si :** une source de données a été **vue
fonctionner** pendant la visite — un fichier réellement produit, dont le nom et
l'extension ont été constatés (élément C2 de la fiche terrain).

**Reste déclenché si :** la caisse ne produit qu'un rapport papier · l'export
exige une manipulation quotidienne · il n'y a pas de caisse · le gérant affirme
qu'un export existe sans le montrer.

**Conséquence :** NO-GO branchement de l'objectif 1. Les adaptateurs `pos` et
`api` restent inertes. **Aucune interface de saisie n'est créée pour compenser
l'absence de source** — ce serait fabriquer la tâche manuelle que le projet
cherche à supprimer.

---

### S2 — Aucun problème ne justifie Assist-Tech

*Concept issu de la grille du 7/09. Voir §4 sur sa correspondance.*

**NO-GO levé si et seulement si :** un même motif d'interruption est mesuré à
≥ 8 occurrences par jour, dont au moins la moitié en heure de pointe, **et** une
fiche papier testée n'a pas fait baisser ce compte.

**Reste déclenché si :** les interruptions sont rares · elles tombent en heure
creuse — auquel cas le temps économisé vaut zéro euro · une fiche papier suffit
· le motif dominant exige une intervention physique, donc non automatisable.

---

### S3 — Aucune demande non satisfaite ne justifie Smart Desk

*Concept issu de la grille du 7/09.*

**NO-GO levé si et seulement si :** taux d'occupation de pointe ≥ 80 % sur au
moins 5 jours sur 14, **et** ≥ 3 clients par jour repartis faute de poste.

**Reste déclenché si :** l'occupation de pointe reste sous 80 % — il y a alors
toujours une machine libre, et rien à optimiser · aucune demande de réservation
n'est reçue aujourd'hui · la clientèle vient sans rendez-vous.

---

### S4 — Aucune activité snacks ne justifie Ops-Snack

*Concept issu de la grille du 7/09.*

**NO-GO levé si et seulement si :** l'établissement vend effectivement des
consommables (élément A10 du protocole de collecte), **et** le CA snack
représente ≥ 15 % du CA total, **et** ≥ 2 ruptures par semaine sur une
référence qui tourne.

**Reste déclenché si :** il n'y a pas de bar · le CA snack est marginal · les
ruptures sont rares. **Rappel : même levé, ce scénario bute sur la gate P2** —
tout enregistrement de règlement est bloqué, le périmètre se limiterait à un
suivi de volumes en E0.

---

### S5 — Les données terrain sont insuffisantes pour démontrer une valeur économique

**NO-GO levé si et seulement si :** au moins 11 des 14 éléments de niveau 1 de
la fiche terrain sont rapportés, **et** au moins une perte est chiffrée en
euros ou en heures de pointe.

**Reste déclenché si :** moins de 11 éléments rapportés · aucune perte chiffrée
· uniquement des impressions générales sans fréquence ni durée · les seules
données disponibles sont déclaratives.

**Conséquence particulière :** ce scénario n'est pas un échec, c'est un
« pas encore ». Il appelle une **deuxième visite**, pas une conclusion. Mais il
interdit toute décision de branchement dans l'intervalle.

---

### S6 — Le terrain révèle un problème prioritaire hors de la grille actuelle *(scénario obligatoire)*

**Se déclenche si :** le problème dominant identifié sur place ne correspond à
aucun des concepts ni des objectifs actuels.

**Conséquence :** NO-GO branchement sur **tous** les objectifs, et non pas
choix du « moins mauvais des trois ». La grille entière est invalidée et
réécrite à partir du problème observé.

**Pourquoi ce scénario est obligatoire.** Les trois objectifs ont été
verrouillés avant toute observation. Sans S6, la collecte ne pourrait que
choisir entre trois réponses définies à l'avance — ce qui est l'inversion
exacte de la méthode `PROBLÈME → PREUVE → SOLUTION` que le projet s'impose.
S6 est la seule clause qui autorise le terrain à avoir raison contre la grille.

**Conséquence sur le socle :** l'archivage ne dépend pas de la qualité du code.
Un socle qui fonctionne parfaitement mais qui ne répond pas au problème observé
est archivé comme les autres.

---

### S7 — Aucun problème ne justifie le widget de raccourcis *(ajout — objectif 2 verrouillé)*

**NO-GO levé si et seulement si :** les postes n'ont **pas** de favoris ni de
page d'accueil équivalents (élément C5), **ou** cette configuration existe mais
ne survit pas à la remise à zéro entre clients (élément C6), **et** la liste des
sites réellement utilisés a été observée, pas devinée (élément C7).

**Reste déclenché si :** les favoris existants suffisent · la page d'accueil est
déjà configurée et personne ne la regarde · le personnel dit que ce n'est pas ce
qui lui prend du temps.

**Cas particulier à trancher explicitement :** si le NO-GO est levé uniquement
parce que rien n'est configuré, la réponse correcte est **une heure de
configuration par poste, pas un développement.** Le socle du widget reste
archivé.

---

### S8 — Aucun incident ne justifie la supervision technique *(ajout — objectif 3 verrouillé)*

**NO-GO levé si et seulement si :** un incident **daté et chiffré** dans les
12 derniers mois est rapporté (élément C13), **et** le gérant ne voit pas toute
sa salle depuis sa place (élément C14), **et** une machine peut rester allumée
(élément C11), **et** un accès administrateur est possible si nécessaire
(élément C12).

**Reste déclenché si :** aucun incident daté et chiffré · le gérant voit tout et
détecte les pannes en quelques minutes · pas de machine permanente · pas d'accès
administrateur · un outil existant couvre le besoin · **l'astreinte implicite
n'est pas tenable** — ce dernier motif suffit seul.

---

## 4. Cohérence des deux grilles — point ouvert, non résolu

Les scénarios S2, S3 et S4 portent sur **Assist-Tech, Smart Desk et Ops-Snack**,
concepts de la grille du 7 septembre. Les objectifs verrouillés le 8 septembre
sont **dashboard propriétaire, widget de raccourcis, supervision technique**.
Ce ne sont pas les mêmes.

| Concept 7/09 | Objectif verrouillé 8/09 correspondant |
|---|---|
| Assist-Tech — support et dépannage automatique | **Aucun.** Partiellement voisin de la supervision, mais ce n'est pas le même produit |
| Smart Desk — réservation et gestion de flotte | **Aucun.** Écarté |
| Ops-Snack — bar et catering | **Aucun.** Hors périmètre |
| — | Objectif 1 — dashboard : couvert par S1 |
| — | Objectif 2 — widget : **non couvert par la liste initiale**, d'où S7 |
| — | Objectif 3 — supervision : **non couvert**, d'où S8 |

`À VÉRIFIER` — le point n'est pas tranché ici : les concepts du 7/09 sont-ils
abandonnés, ou coexistent-ils avec les objectifs verrouillés ? Les huit
scénarios restent actifs dans les deux cas, ce qui rend la décision d'archivage
possible sans attendre la réponse. **Le point reste ouvert.**

---

## 5. Clause anti-réinterprétation

Une fois un scénario constaté, les raisonnements suivants sont **refusés par
avance**. Ils sont listés nommément parce qu'ils se présenteront, et qu'ils
paraîtront raisonnables sur le moment.

| Raisonnement | Pourquoi il est refusé |
|---|---|
| « Le socle marche, autant s'en servir pour autre chose » | Le coût déjà engagé n'est pas un argument. C'est la définition du coût irrécupérable |
| « Il suffirait d'ajouter une petite saisie manuelle » | Interdit par S1. Cela fabrique la tâche répétitive que le projet devait supprimer |
| « Ça servira pour un autre établissement » | Aucun autre établissement n'a été observé. C'est une hypothèse, pas un usage |
| « On garde le dashboard, même vide, ça ne coûte rien » | Un écran vide chez un client détruit la confiance plus vite qu'une absence d'écran |
| « Le problème observé ressemble un peu à l'objectif 2 » | S6 existe précisément pour interdire cette manœuvre |
| « On rebranche juste le module de supervision, il est déjà écrit » | Le code écrit n'est pas une preuve de besoin |
| « On refait le seuil, il était trop strict » | Un seuil se recalibre **avant** de connaître le résultat, jamais après |

---

## 6. Registre de décision — à remplir après la visite

Un seul enregistrement par objectif. À dater et à ne plus modifier.

```
DATE DE LA VISITE : __________     DATE DE LA DÉCISION : __________

OBJECTIF 1 — Dashboard
  Scénario S1 levé ?        oui / non
  Preuve (élément C2) : ____________________________________________
  DÉCISION : GO conditionnel / NO-GO — ARCHIVÉ / Besoin de données

OBJECTIF 2 — Widget
  Scénario S7 levé ?        oui / non
  Preuve (éléments C5, C6, C7) : ___________________________________
  DÉCISION : GO conditionnel / NO-GO — ARCHIVÉ / Configuration seule

OBJECTIF 3 — Supervision
  Scénario S8 levé ?        oui / non
  Preuve (éléments C11, C12, C13, C14) : ___________________________
  DÉCISION : GO conditionnel / NO-GO — ARCHIVÉ / Besoin de données

CONCEPTS 7/09 — Assist-Tech (S2), Smart Desk (S3), Ops-Snack (S4)
  Scénarios levés ? _______________________________________________

TRANSVERSAL
  S5 — données suffisantes ?     oui / non   (éléments niveau 1 : __/14)
  S6 — problème hors grille ?    oui / non
  Si S6 = oui, problème observé : __________________________________
  __________________________________________________________________

SOCLE
  Statut : BRANCHÉ / ARCHIVÉ COMME ACTIF NON RETENU
  Motif en une phrase : ____________________________________________
  Code conservé dans le dépôt : OUI (toujours)

CONDITION DE RÉOUVERTURE
  Une décision d'archivage ne se rouvre que sur une donnée terrain
  NOUVELLE. Une relecture des données existantes, un argument de coût
  déjà engagé ou une reformulation du besoin ne suffisent pas.
  Donnée qui justifierait la réouverture : ___________________________
```

---

## 7. Ce qui se passe après un archivage

1. Remplir le registre §6, dater, ne plus le modifier.
2. Le code reste dans le dépôt, tel quel. Aucune suppression.
3. `CLAUDE.md` est mis à jour : l'objectif passe en statut `ARCHIVÉ`.
4. Aucun développement supplémentaire sur cet objectif.
5. Si S6 s'est déclenché : reprendre la chaîne
   `PROBLÈME → PREUVE → VALEUR → DONNÉES → FAISABILITÉ → RISQUE → SOLUTION`
   depuis le problème réellement observé, sans réutiliser la grille invalidée.
