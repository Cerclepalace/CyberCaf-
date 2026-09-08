# Fiche terrain — données bloquantes

**Version 1.0 — 8 septembre 2026 · à utiliser sur place le 9 septembre**
**Aucun développement ne dépend de ce document. Il sert à collecter, pas à décider.**

Document opérationnel. Il consolide en une seule liste :

- les données bloquantes du §8 de `ARCHITECTURE_CIBLE_ET_VALIDATION_V2.md` — ce
  qu'il faut pour **décider** ;
- les TODO TERRAIN T1 à T12 de `SOCLE_TECHNIQUE.md` — ce qu'il faut pour
  **brancher** quoi que ce soit.

À utiliser avec `PROTOCOLE_VALIDATION_TERRAIN_V1.md`, qui reste le document de
conduite de la visite : **découverte du problème d'abord, inventaire technique
ensuite.** Sortir cette fiche en arrivant transforme l'entretien en visite
commerciale.

---

## 0. Correction de comptage

`ARCHITECTURE_CIBLE_ET_VALIDATION_V2.md` §8 annonçait « douze données
bloquantes ». Le tableau en marque **quatorze**. L'erreur était dans la phrase
de conclusion, pas dans le tableau. Elle est corrigée.

Décompte réel, après consolidation avec les TODO TERRAIN :

| Catégorie | Nombre | Statut |
|---|---:|---|
| **Niveau 1** — bloquants, à rapporter quoi qu'il arrive | **14** | Sans eux, aucune décision |
| **Niveau 2** — conditionnels, seulement si le niveau 1 le permet | **4** | Ne se posent que si une source existe |
| **Hors terrain** — ne se collecte pas sur place | **1** | Expert-comptable |
| **Utiles, non bloquants** | **2** | Bonus |

**Règle d'arrêt : moins de 11 éléments de niveau 1 rapportés = pas de décision,
et une deuxième visite plutôt qu'une conclusion.**

---

## 1. Comment lire une fiche

Chaque élément porte :

- **Ce qu'on veut** — la donnée exacte, pas son approximation ;
- **Comment l'obtenir** — geste précis ;
- **Compte comme réponse** — ce qui vaut donnée ;
- **Ne compte pas** — ce qui ressemble à une réponse sans en être une ;
- **Débloque** — ce que cet élément permet, et rien de plus ;
- **Si absent** — écrire `NON RENSEIGNÉ` et noter ce qui tient lieu.

Aucune de ces données ne se déduit. Si elle n'est pas vue, elle n'est pas
collectée.

---

# NIVEAU 1 — les 14 bloquants

## C1 — Logiciel de caisse : marque, modèle, version

- **Ce qu'on veut** : le nom exact du produit et sa version.
- **Comment** : photo de l'écran en fonctionnement · photo de l'étiquette à
  l'arrière du boîtier · menu « À propos » ou « Aide » pour la version.
- **Compte** : une chaîne exacte, lisible sur une photo.
- **Ne compte pas** : « une caisse classique », un nom de mémoire, une marque
  sans version.
- **Débloque** : recherche concurrentielle, faisabilité de l'objectif 1, T1.
- **Si absent** : noter ce qui tient lieu de caisse — cahier, calculatrice,
  application sur téléphone, rien. **L'absence de caisse est une donnée
  majeure, pas un trou.**

## C2 — Export de la caisse : existence, format, déclenchement

**L'élément le plus déterminant de la visite.**

- **Ce qu'on veut** : est-ce que ce logiciel produit un fichier, lequel, comment
  on le déclenche, où il atterrit.
- **Comment** : **le faire faire devant vous.** Demander : « Vous pouvez me
  montrer ? » Puis regarder le fichier obtenu : nom, extension, taille,
  emplacement. Photo de l'écran d'export et du fichier produit.
- **Compte** : un fichier réellement produit sous vos yeux, dont vous avez vu le
  nom et l'extension. Si possible, une photo des premières lignes ouvertes.
- **Ne compte pas** : « oui je crois que ça exporte », « il y a un bouton
  quelque part », un rapport imprimé sur papier — **le papier n'est pas un
  export**, il impose une recopie quotidienne et invalide la chaîne.
- **Débloque** : la nature entière de l'objectif 1. Fichier = lecteur de 5 à 10
  jours. Pas de fichier = pas de projet sous cette forme.
- **Si absent** : noter précisément ce que la caisse sait produire — ticket Z,
  rapport écran, rien.

## C3 — Imprimantes : nombre, modèles, connexion

- **Ce qu'on veut** : combien, quels modèles exacts, branchées en réseau
  (câble RJ45 ou Wi-Fi) ou en USB sur un poste précis.
- **Comment** : photo de face **et de l'arrière** de chacune — la connectique
  est la donnée, pas la marque. Étiquette du modèle.
- **Compte** : « HP LaserJet [modèle exact], câble réseau branché » ; ou
  « [modèle], USB vers le poste du comptoir ».
- **Ne compte pas** : « des HP », « je crois que c'est en Wi-Fi ».
- **Débloque** : T6. Une imprimante en réseau expose ses compteurs sans rien
  installer ; une imprimante USB ne le fait pas.
- **Si absent** : compter les imprimantes visibles et noter `MODÈLE NON RELEVÉ`.

## C4 — Postes clients : nombre, système, version

- **Ce qu'on veut** : combien de postes installés, quel système et quelle
  version, tous identiques ou non.
- **Comment** : comptage direct · sur un poste, la commande `winver` sous
  Windows, ou le menu « À propos de ce Mac », ou l'écran de démarrage si c'est
  autre chose. **Photo de l'écran de version.**
- **Compte** : « 8 postes, Windows 10 22H2, apparemment identiques ».
- **Ne compte pas** : « des PC sous Windows ».
- **Débloque** : T11, dimensionnement, faisabilité des objectifs 2 et 3.
- **Si absent** : au minimum le comptage, qui est toujours possible.

## C5 — Navigateur : lequel, favoris et page d'accueil existants

- **Ce qu'on veut** : quel navigateur, et **ce qu'il contient déjà** — barre de
  favoris, page d'accueil configurée, raccourcis sur le bureau.
- **Comment** : demander l'autorisation, puis regarder un poste au hasard.
  Photo de l'écran d'accueil du navigateur et du bureau.
- **Compte** : « Chrome, aucun favori, page d'accueil Google, 4 icônes sur le
  bureau dont une pour impots.gouv ».
- **Ne compte pas** : la réponse du gérant sans vérification. Il ne sait pas
  forcément ce qu'il y a sur les postes.
- **Débloque** : l'objectif 2 en entier. Si des favoris existent déjà et
  suffisent, le widget est mort — et c'est une bonne nouvelle.

## C6 — Procédure de remise à zéro entre deux clients

- **Ce qu'on veut** : ce qui se passe concrètement quand un client part.
- **Comment** : question **et** vérification. Demander « entre deux clients,
  vous faites quoi sur la machine ? », puis regarder un poste : historique du
  navigateur, dossier Téléchargements, bureau, corbeille.
- **Compte** : « rien du tout » est une réponse valide et importante. Ou
  « on redémarre », ou « il y a un logiciel qui remet tout à zéro » — dans ce
  cas, lequel.
- **Ne compte pas** : « on nettoie » sans savoir comment.
- **Débloque** : si la configuration ne survit pas à la remise à zéro, c'est le
  seul cas où l'objectif 2 a un vrai problème technique à résoudre. Alimente
  aussi le volet sécurité.

## C7 — Sites réellement utilisés par les clients

- **Ce qu'on veut** : ce que les gens font vraiment, observé.
- **Comment** : **observation**, sans se pencher sur les écrans ni lire par
  dessus l'épaule. Ce qui est visible depuis une position normale suffit.
  Compléter par la question au personnel : « ils viennent faire quoi, en
  général ? » et par le top 5 des demandes d'aide.
- **Compte** : une liste de 5 à 10 sites ou usages, avec une idée de fréquence.
- **Ne compte pas** : une liste inventée à partir de ce qu'un cybercafé
  « devrait » servir.
- **Débloque** : T7. Sans cette liste, tout catalogue de raccourcis est une
  supposition.
- **Précaution** : ne noter aucun contenu, aucune donnée personnelle, aucun nom.
  Le site, pas ce qui s'y fait.

## C8 — Box / routeur : marque, modèle, type d'abonnement

- **Ce qu'on veut** : quel équipement fournit Internet, et si l'abonnement est
  grand public ou professionnel.
- **Comment** : photo de la box, étiquette comprise. Question sur l'abonnement.
- **Compte** : « Livebox [modèle], abonnement pro ».
- **Débloque** : détermine si des journaux réseau sont accessibles — et la
  réponse est presque toujours non sur une box grand public. C'est ce qui fixe
  le plafond réel de l'objectif 3.

## C9 — Autres équipements réseau : pare-feu, switch, borne Wi-Fi

- **Ce qu'on veut** : tout ce qui a une LED dans le local technique.
- **Comment** : demander à voir le local technique. **Photo d'ensemble et photo
  du câblage.** Ne pas trier sur place : photographier tout, identifier après.
- **Compte** : une photo lisible où l'on distingue les boîtiers et les câbles.
- **Ne compte pas** : « il n'y a rien d'autre » sans avoir vu.
- **Débloque** : T8, et la question de savoir si une source de sécurité existe.

## C10 — Antivirus et outils de sécurité présents

- **Ce qu'on veut** : quel antivirus tourne sur les postes, et s'il existe une
  console de gestion centralisée.
- **Comment** : sur un poste, regarder la barre des tâches et le centre de
  sécurité. Photo. Question : « vous avez un antivirus payant, ou celui de
  Windows ? »
- **Compte** : « Defender uniquement, aucune console » ou « [produit], licence
  payée, tableau de bord accessible depuis le comptoir ».
- **Débloque** : T8. Sans console centralisée, aucun événement antivirus ne
  remonte nulle part — l'objectif 3 perd sa principale source supposée.

## C11 — Machine allumée en permanence

- **Ce qu'on veut** : existe-t-il un ordinateur qui ne s'éteint jamais, lequel,
  sous quel système.
- **Comment** : question directe, puis vérification visuelle.
- **Compte** : « le poste du comptoir reste allumé la nuit » ou « tout est
  éteint à la fermeture ».
- **Débloque** : T9. Sans machine permanente, ni l'objectif 1 ni l'objectif 3
  n'ont d'hôte, et l'installation change complètement de nature.

## C12 — Accès administrateur : possible ou non

- **Ce qu'on veut** : qui détient le mot de passe administrateur des postes, et
  si un accès nous serait accordé.
- **Comment** : question directe et franche. « Qui a le mot de passe
  administrateur ? Si un jour il fallait installer quelque chose, ce serait
  possible ? »
- **Compte** : un nom, ou « personne ne sait », ou « c'est le neveu qui a tout
  installé et on ne l'a plus ».
- **Ne compte pas** : un « oui » de politesse. Une hésitation vaut « non ».
- **Débloque** : tout ce qui touche aux postes. Sans accès administrateur,
  l'objectif 3 s'arrête au ping.

## C13 — Incidents des 12 derniers mois, datés et chiffrés

- **Ce qu'on veut** : des incidents réels, avec une date approximative et un
  coût.
- **Comment** : question ouverte, puis relances. « Il s'est passé quoi de grave
  cette année ? » puis « c'était quand ? » et « ça vous a coûté combien ? ».
  Question complémentaire décisive : « une machine est déjà restée en panne
  plusieurs jours sans que vous le remarquiez ? »
- **Compte** : « en mars, le serveur est tombé, deux jours fermés, environ 400 €
  perdus ».
- **Ne compte pas** : « oui, ça arrive parfois ». Un incident sans date ni coût
  ne prouve rien.
- **Débloque** : c'est **la seule preuve possible** que l'objectif 3 a une
  valeur. Sans un incident daté et chiffré, il n'y a rien à justifier.

## C14 — Le gérant voit-il toute la salle depuis sa place

- **Ce qu'on veut** : une observation, pas une opinion.
- **Comment** : se mettre à sa place et regarder. Compter les postes visibles et
  les postes hors de vue.
- **Compte** : « 8 postes, tous visibles du comptoir » ou « 3 postes dans
  l'arrière-salle, invisibles ».
- **Débloque** : à lui seul une grande partie de l'objectif 3. **S'il voit tout,
  la supervision automatique n'apporte presque rien** — il détecte déjà les
  pannes en quelques minutes.

---

# NIVEAU 2 — les 4 conditionnels

Ils ne se posent que si le niveau 1 a donné le résultat correspondant. Les poser
sans cette condition serait supposer une infrastructure.

## D1 — Structure de l'export *(seulement si C2 a produit un fichier)*

- **Ce qu'on veut** : les noms exacts des colonnes, le séparateur, l'encodage.
- **Comment** : ouvrir le fichier obtenu et **photographier la première ligne**
  ainsi que deux ou trois lignes de données. Si le fichier peut être copié sur
  une clé ou envoyé par mail, le récupérer — c'est mieux qu'une photo.
- **Débloque** : T3 et T5. Sans cela, l'adaptateur ne peut pas être écrit, même
  si le fichier existe.

## D2 — Libellés réels des prestations *(seulement si C2 a produit un fichier, ou si une grille tarifaire existe)*

- **Ce qu'on veut** : la liste exacte des libellés utilisés, tels qu'écrits.
- **Comment** : photo de la grille tarifaire affichée · libellés visibles dans
  l'export ou sur un ticket.
- **Débloque** : T4, la correspondance vers les catégories. Sans elle, tout
  tombe dans « Autres ».

## D3 — API *(seulement si C1 a identifié un logiciel qui en annonce une)*

- **Ce qu'on veut** : existence, adresse, mode d'authentification.
- **Comment** : documentation du produit, menu « intégrations » ou
  « connecteurs » du logiciel. Ne rien tester sur place.
- **Débloque** : T2. **Ne pas chercher cette information si C1 n'a rien donné :
  ce serait chercher l'API d'un logiciel inconnu.**

## D4 — Séparation réseau *(seulement si C9 a montré plus qu'une simple box)*

- **Ce qu'on veut** : la caisse et les postes du personnel sont-ils sur le même
  réseau que les postes clients et le Wi-Fi public.
- **Comment** : observation du câblage · question : « le Wi-Fi des clients,
  c'est le même réseau que la caisse ? » · le mot de passe Wi-Fi est-il affiché
  au mur.
- **Débloque** : T10, et la décision d'exposer ou non l'interface au réseau
  local. Par défaut elle reste sur `127.0.0.1`.

---

# HORS TERRAIN — 1 élément

## X1 — Niveau d'enregistrement autorisé *(expert-comptable, point V1)*

Ne se collecte pas sur place. Détermine si le futur outil peut dépasser E0
(volumes seuls). Tant qu'il n'est pas tranché, le code reste verrouillé en E0 et
refuse tout montant. Les quatre questions à poser figurent dans
`CADRE_REGLEMENTAIRE.md` §3.

---

# UTILES, NON BLOQUANTS — 2 éléments

## N1 — Compteur de pages accessible

Demander à imprimer la « page de configuration » ou le « rapport d'état » de
chaque imprimante, et photographier tous les compteurs affichés — pas seulement
le total. Sur une multifonction, impressions, copies et scans sont souvent
comptés séparément.

## N2 — Qui dépanne aujourd'hui, et à quel prix

Renseigne sur le budget technique réel et sur l'existence d'un prestataire déjà
en place. C'est un des meilleurs indicateurs de capacité d'achat.

---

# FICHE DE SAISIE — à remplir sur place

```
ÉTABLISSEMENT : ______________________   DATE : __________
HEURE ARRIVÉE : ______   DÉPART : ______

NIVEAU 1                                            RAPPORTÉ ?   PHOTO N°
C1  Caisse : marque / modèle / version              [ ]          ____
C2  Export : format et déclenchement                [ ]          ____
C3  Imprimantes : nb / modèles / connexion          [ ]          ____
C4  Postes : nb / OS / version                      [ ]          ____
C5  Navigateur : favoris et page d'accueil          [ ]          ____
C6  Remise à zéro entre clients                     [ ]          ____
C7  Sites réellement utilisés                       [ ]          ____
C8  Box / routeur : modèle et abonnement            [ ]          ____
C9  Local technique : autres équipements            [ ]          ____
C10 Antivirus et console de gestion                 [ ]          ____
C11 Machine allumée en permanence                   [ ]          ____
C12 Accès administrateur                            [ ]          ____
C13 Incidents 12 mois, datés et chiffrés            [ ]          ____
C14 Le gérant voit-il toute la salle                [ ]          ____
                                     TOTAL NIVEAU 1 : ____ / 14

NIVEAU 2 (si applicable)
D1  Structure de l'export                           [ ] [ ] n/a  ____
D2  Libellés réels des prestations                  [ ] [ ] n/a  ____
D3  API                                             [ ] [ ] n/a  ____
D4  Séparation réseau                               [ ] [ ] n/a  ____

NON BLOQUANTS
N1  Compteurs imprimantes                           [ ]          ____
N2  Qui dépanne, à quel prix                        [ ]          ____

ÉLÉMENTS NON RENSEIGNÉS — les lister, ne pas les combler :
_______________________________________________________________
_______________________________________________________________

DÉCISION DE COLLECTE
Total niveau 1 >= 11  →  analyse possible
Total niveau 1 <  11  →  deuxième visite, pas de conclusion
```

---

# CE QUE CETTE FICHE NE FAIT PAS

Elle ne décide rien. Rapporter les 14 éléments ne démontre pas qu'un problème
existe : cela démontre seulement que l'inventaire technique est fait.

La preuve du problème vient de `PROTOCOLE_VALIDATION_TERRAIN_V1.md` —
observation, entretien, preuves fortes, scoring. **Les deux sont indépendants.**

Un inventaire complet avec un score de problème faible reste un NO-GO produit,
même si tout est techniquement branchable. Un socle qui fonctionne n'est pas un
argument : c'est un outil qu'on branche si, et seulement si, le terrain le
justifie.
