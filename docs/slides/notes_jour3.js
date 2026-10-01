// Notes de présentateur du deck « Jour 3, version pratique ».
// Les slides reprises du deck principal gardent leur texte (notes.js) ; les autres sont ici.
// Rédigé à la première personne : c'est ce que je dis, pas un résumé.
const base = require("./notes.js");

module.exports = {
...base,

"[titre jour 3]": `Projetée à l'arrivée. Mon Codespace de démo tourne depuis 8h30, Grafana ouvert dans un autre onglet, Teams ouvert sur le canal de la formation.

À dire quand tout le monde est assis : « Bonjour à tous. Dernier jour. Hier, on s'est arrêté au moment d'écrire du code dans l'application. Aujourd'hui, on change de rythme : on ne code plus, on pratique. Ce soir, vous aurez construit deux tableaux de bord selon les méthodes de Google, envoyé des alertes dans Teams, dans Slack et par e-mail, et mené une enquête sur une boutique sabotée. »`,

"[statement] Aujourd'hui, vous ne codez pas": `« Vous êtes des gens d'infrastructure. Lundi, ce n'est pas vous qui instrumenterez les applications : ce sont vos développeurs. Et PromQL, je vous l'ai dit, une IA l'écrit très bien. Mais une IA se trompe avec beaucoup d'assurance. Donc la compétence d'aujourd'hui, ce n'est pas d'écrire du PromQL : c'est de le demander, de le comprendre, et de le vérifier. Je vous demanderai à chaque fois de faire expliquer la requête par l'IA : l'objectif, c'est que vous sachiez ce que fait chaque ligne. »

Je laisse la phrase affichée, avec trois secondes de silence. Elle donne le ton de la journée.`,

"Le programme du jour": `« Quatre parties. Ce matin, les tableaux de bord : d'abord les bonnes métriques, puis deux dashboards, un pour le service, un pour la machine, puis vous notez votre travail. Cet après-midi, l'alerting, deux fois : avec Prometheus et l'Alertmanager, puis avec Grafana, pour que vous sentiez la différence dans vos mains. Avec des vrais messages : Teams, Slack, e-mail. Et on finit par un jeu : un escape game, la boutique a été sabotée, à vous de trouver les deux pannes. »

« Dans la colonne de droite, ce que vous aurez fait. Ce soir, on vérifiera ensemble. »

Pauses à 10h30 et 14h30, déjeuner 12h30-13h30. Fin à 16h00, et je tiens l'heure.`,

"Démarrer en trois minutes": `C'est la seule manipulation technique de la journée. Je la fais en même temps qu'eux, projetée.

« Un lien, une commande. Le lien ouvre un Codespace directement sur la branche jour3 : tout y est déjà configuré, l'application instrumentée, Prometheus, Grafana, l'Alertmanager, la boîte de réception, un faux serveur de messagerie. Ensuite, dans le terminal, ./jour3.sh start. Trois à cinq minutes la première fois. Quand vous voyez 10 sur 10 cibles UP, levez la main. »

Pendant que ça démarre, je passe la slide suivante.

Ceux qui bloquent : toomanyrequests → docker login avec un compte Docker Hub gratuit, puis relancer. Docker ne répond pas → attendre 30 secondes, relancer. Le script est rejouable : en cas de doute, on relance.`,

"Casser la boutique : vos commandes du jour": `« Ces commandes vont servir toute la journée. Elles cassent la boutique de façon contrôlée : lenteur, erreurs, CPU, afflux de clients, une instance qui tombe. Pourquoi casser ? Parce qu'un tableau de bord ou une alerte qu'on n'a jamais vus réagir à une panne, on ne sait pas s'ils marchent. Les pompiers font des exercices d'incendie ; nous, on fait du chaos. »

« Et quand vous êtes perdus : ./jour3.sh repare. Tout revient à la normale. »`,

"PARTIE 1 · Les bonnes métriques": `« Première question du matin : qu'est-ce qu'on met dans un tableau de bord ? La mauvaise réponse : "toutes les métriques qu'on a". La bonne : on part d'une méthode. Et la méthode la plus connue vient de Google. »`,

"Quatre signaux, quatre questions": `La version texte du schéma précédent, pour qu'ils aient les définitions sous les yeux pendant le TP A.

« Je vous laisse cette slide au tableau pendant le TP : ce sont vos quatre cases du haut. Retenez surtout deux choses. Le trafic n'est jamais rouge : un afflux de clients, c'est une bonne nouvelle. Et la saturation est le seul des quatre signaux qui prévient : les trois autres constatent, la saturation annonce. »`,

"PromQL : demander, comprendre, vérifier": `« Trois étapes. Demander : avec le contexte et les vraies métriques, sinon l'IA invente des noms plausibles qui n'existent pas. Comprendre : l'IA doit expliquer sa requête, ligne par ligne, et vous devez pouvoir la redire en une phrase. Vérifier : quatre contrôles, dont le plus important, je casse et je regarde la courbe bouger. Et si c'est faux, on redonne l'erreur à l'IA : travailler avec une IA, c'est une conversation, pas un distributeur. »

La règle de sécurité, lentement : « Chez un assureur, on ne colle jamais de données de production dans une IA publique. Demandez à votre RSSI quel outil est autorisé. »`,

"Le modèle de demande": `Je fais la démonstration en direct juste après cette slide (cf. guide formateur) : je copie les lignes # HELP et # TYPE de http_requests_total depuis /metrics, je colle le modèle, je demande le taux d'erreur 5xx en pourcentage.

« Regardez les deux dernières lignes : je demande la requête, puis l'explication ligne par ligne. Ce n'est pas de la politesse : c'est l'objectif. Si vous ne comprenez pas la requête, vous ne saurez pas la réparer le jour où elle sera fausse, et vous ne saurez pas l'expliquer à votre collègue. »

« Les chevrons, c'est ce que vous changez à chaque fois. Le reste, vous le gardez. Il est dans votre guide, copiez-le dans un bloc-notes. »`,

"Comprendre, puis vérifier": `« À gauche, comprendre. Lisez l'explication. Le test : pouvez-vous redire la requête en une phrase à votre voisin ? "Elle calcule, pour toute la boutique, la part des requêtes en erreur sur les cinq dernières minutes." Si vous n'y arrivez pas, demandez à l'IA de réexpliquer plus simplement.

À droite, vérifier. Un : ça s'exécute. Deux : l'ordre de grandeur ; si l'IA vous donne 60 000 requêtes par seconde sur notre petite boutique, elle a oublié un rate. Trois : un compteur est toujours dans un rate ou un increase. Quatre, le plus important : je casse et je regarde. Une requête qui n'a jamais vu une panne n'est pas vérifiée. »`,

"EXPLORE · Échauffement : les quatre signaux": `« Sept minutes. Une requête par signal doré, pour toute la boutique, dans Explore. L'IA l'écrit et l'explique, vous la vérifiez, et vous écrivez dans votre guide, avec vos mots, ce qu'elle fait. »

Je circule. Je fais lire deux explications à voix haute à la fin. Les pièges sont sur la slide : je les commente à la correction.

Valeurs attendues : trafic 6 à 7 req/s ; erreurs 0 ; p95 0,15 à 0,25 s ; CPU quelques %.`,

"PARTIE 2 · Des tableaux de bord qui parlent": `« Un tableau de bord, c'est une réponse à une question, pour un public. Pas une collection de graphiques. Ce matin, deux dashboards : un pour le service, vu par ses utilisateurs ; un pour la machine, vu par l'infra. Et un lien entre les deux. »`,

"TP A · La boutique en quatre signaux dorés": `« Votre dashboard a trois étages, comme un immeuble. Au rez-de-chaussée, en haut de l'écran, la réponse à "ça va ?" : quatre cases de couleur, une par signal doré. Au premier, les mêmes signaux dans le temps, pour l'équipe technique. Au deuxième, le métier, pour le directeur commercial. Chaque panel a une question en français dans votre guide : vous la posez à l'IA, elle l'explique, vous vérifiez, vous réglez l'affichage. Bloqués plus de cinq minutes sur une requête ? L'annexe de secours, à la fin du guide. Personne ne reste bloqué sur du PromQL aujourd'hui : le sujet, c'est Grafana. »

Je montre la variable et le premier Stat en direct (cf. guide formateur), puis je les laisse travailler.`,

"Un exemple de résultat": `« Un exemple, construit pendant une autre session. Le vôtre sera organisé en signaux dorés : quatre cases en haut. Je le laisse affiché pendant le TP. »`,

"TP B · Le serveur en méthode USE": `« Même exercice pour la machine. Pour chaque ressource, trois questions : est-elle occupée ? Est-ce que du travail attend ? Y a-t-il des erreurs ? La méthode de Brendan Gregg a un avantage énorme : elle vous empêche d'oublier une ressource. »

« Le panel 2 est un piège volontaire. L'IA va probablement vous proposer une requête qui renvoie "No data". Ne la corrigez pas vous-mêmes : donnez le résultat à l'IA et demandez-lui d'expliquer pourquoi. C'est le meilleur exercice de la journée. »

Puis la chaîne : chaos cpu 120, la case Saturation de la boutique rougit, un clic, le dashboard serveur. « Un diagnostic en deux clics. »`,

"Auto-audit : notez votre dashboard sur 10": `« Dix critères, tirés de la documentation de Grafana et du chapitre 6 de Google SRE. Notez votre dashboard Boutique, honnêtement. Puis échangez d'ordinateur avec votre voisin et notez le sien. Huit minutes. »

Au débrief, je fais lever les mains : qui a 8 ou plus ? Puis les deux critères les plus souvent ratés, en général 8 (annotations) et 9 (lien vers le niveau suivant). « Ce sont les deux qui font gagner le plus de temps pendant un incident. »`,

"PARTIE 3 · Des alertes qui servent": `« Cet après-midi, on fait sonner des alarmes. Et on va faire la même famille de choses deux fois, avec deux outils, pour que vous sentiez la différence. Avec de vrais canaux : Teams, Slack, e-mail. »`,

"Le cycle de vie d'une alerte": `« Trois états. Inactive : la condition est fausse. Pending : la condition est vraie, mais pas encore assez longtemps ; c'est le for. Firing : la condition a tenu toute la durée du for, l'alerte part à l'Alertmanager. Puis l'Alertmanager attend le group_wait pour regrouper, et envoie. »

« Le for, c'est l'anti-faux positif. Comparaison : le détecteur de fumée qui sonnerait au premier grille-pain. Tout le monde finirait par enlever la pile. »`,

"Deux chemins vers les mêmes canaux": `« En haut, le chemin Prometheus : la règle dans un fichier, l'Alertmanager qui route. En bas, le chemin Grafana : la règle dans l'interface, les contact points. Les deux arrivent aux mêmes canaux : Teams, Slack, e-mail. La seule règle : jamais la même alerte des deux côtés, sinon vous recevez tout en double, et le jour où l'une des deux est fausse, personne ne sait laquelle croire. »`,

"Alertmanager ↔ Grafana : les mêmes concepts": `« Le tableau de correspondance. Les concepts sont les mêmes, seuls les noms changent : un receiver devient un contact point, une route une notification policy, un time_interval un mute timing. Ce qui n'a pas d'équivalent direct côté Grafana : l'inhibition. Gardez ce tableau, vous allez le vivre dans les deux TP. »`,

"L'arbre de routage": `« L'alerte entre par la racine et descend. Elle s'arrête à la première branche dont les labels correspondent, sauf si la branche dit continue: true : elle continue alors de descendre. C'est un aiguillage de gare. Le continue, c'est la photocopie : l'astreinte reçoit l'original, l'équipe reçoit une copie. »

« Et on teste le routage avant la panne, pas pendant : amtool config routes test. »`,

"TP C · Prometheus, Alertmanager, Teams, Slack et e-mail": `« Les fichiers sont fournis, dans jour3/alerting. Vous les copiez, vous les lisez, vous les modifiez un peu. Personne n'écrit 80 lignes de YAML aujourd'hui. Si une expression vous échappe, collez-la dans l'IA et demandez l'explication. »

« Partie 2 : vous prédisez avant de vérifier. C'est un jeu : qui a tout bon ? »

« Partie 3 : vous cassez, et vous chronométrez. Une carte Teams et un message Slack dans l'Inbox, un e-mail dans Mailpit. Ouvrez l'e-mail : c'est exactement ce que recevrait l'équipe. »

La partie 6, je la fais en démonstration : ./jour3.sh teams avec l'URL du workflow de la salle, chaos errors, et le message arrive dans le Teams projeté.`,

"Teams en 2026 : un workflow, une adresse": `« Point important pour vous, puisque vous utilisez Teams. Pendant des années, on créait un "connecteur Incoming Webhook" dans un canal. Microsoft l'a remplacé par les workflows. Dans Teams : le canal, les trois points, Workflows, et le modèle "Send webhook alerts to a channel", qui s'appelle aussi "Post to a channel when a webhook request is received". Vous vérifiez l'équipe et le canal, Enregistrer, puis "Copier le lien du webhook" : c'est l'adresse. »

« Cette adresse est un secret : quiconque l'a peut écrire dans votre canal. Donc dans Grafana, on la colle dans un contact point Microsoft Teams. Dans l'Alertmanager, on la met dans un fichier à part, webhook_url_file, qui ne part pas dans Git. Au lab, la commande ./jour3.sh teams fait exactement ça. »

Si la politique de l'entreprise bloque les workflows : un webhook vers un service intermédiaire, ou l'e-mail vers l'adresse du canal Teams (chaque canal a une adresse e-mail).`,

"L'e-mail, sans surprise": `« L'e-mail, c'est le canal le plus ancien et le plus fiable. Au lab, Mailpit joue le serveur de messagerie : il accepte tout et montre les e-mails dans une page web, comme une vraie boîte. En production, c'est le relais SMTP de l'entreprise, avec TLS et un compte de service. »

« Une règle d'usage : l'e-mail pour ce qui n'est pas urgent, le rapport du matin, les warnings. Le critique va dans Teams ou dans l'outil d'astreinte : personne ne lit ses e-mails à 3 h du matin. Et des listes de diffusion par équipe, jamais des adresses nominatives : les gens partent en vacances, les équipes restent. »`,

"TP D · L'alerting de Grafana, Teams en vrai": `« Le directeur commercial ne lira jamais un fichier YAML, et il veut pouvoir changer son seuil lui-même. On lui fait son alerte dans Grafana. Et on ne refait pas les alertes techniques du TP C. »

« Le moment que j'attends depuis ce matin : chacun crée un contact point Microsoft Teams avec l'adresse du canal de la salle, et clique sur Test. Regardez l'écran. » Les messages arrivent les uns après les autres dans le Teams projeté. Effet garanti.

La règle métier se déclenche avec ./lab.sh traffic 1 : le chiffre d'affaires tombe d'environ 180 000 € par heure à moins de 40 000 en deux à trois minutes.`,

"Le niveau suivant : alerter sur un budget d'erreur": `Je le présente pour qu'ils sachent que ça existe, on ne le pratique pas.

« Le deuxième livre de Google, le Site Reliability Workbook, propose d'alerter non pas sur "plus de 5 % d'erreurs", mais sur la vitesse à laquelle on consomme son budget d'erreur. Si on promet 99,9 % sur 30 jours, on a le droit à 43 minutes de panne par mois. Brûler ce budget 14,4 fois trop vite pendant une heure, c'est 2 % du mois parti : on réveille quelqu'un. Une fois la normale pendant trois jours : un ticket. C'est comme ça qu'on parle aux métiers : "au rythme actuel, on ne tiendra pas notre promesse". »`,

"PARTIE 4 · Bonnes pratiques, jeu, et après": `« Dernière partie. Deux slides de bonnes pratiques, que vous retrouverez en checklists à la fin de votre guide. Puis on joue. »`,

"ESCAPE GAME · La boutique sabotée": `Je le lance avec énergie, c'est le moment le plus attendu.

« Cette nuit, quelqu'un a saboté la boutique. Deux incidents se cachent. Vous êtes l'astreinte. Tapez ./jour3.sh mystere, puis fermez le terminal : à partir de là, interdit le terminal, docker, les logs. Vous avez vos dashboards, Explore, les alertes, l'Inbox, Mailpit, et l'IA pour vous aider à écrire une requête. Douze minutes. Remplissez le rapport d'enquête : quoi, où, quel signal, quel outil, quelle alerte. »

Je chronomètre au tableau. À 12 minutes : « Stop. ./jour3.sh solution. » Chacun découvre sa solution, compte ses points. Puis les questions éclair.

Chaque Codespace tire deux sabotages au hasard parmi sept : les voisins n'ont pas les mêmes, inutile de copier.`,

"Le barème de l'escape game": `« Le barème. 3 points par incident trouvé et localisé. 1 point pour le bon signal, 1 pour l'outil, 1 pour l'alerte. Et 2 points de bonus si vous avez trouvé un incident qui n'a déclenché aucune alerte, en disant quelle alerte aurait dû exister : c'est exactement le travail d'une revue post-incident. »

Les questions éclair (réponses dans le guide formateur), à voix haute, premier qui lève la main.`,

"Thanos en cinq minutes": `Démonstration sur mon Codespace de démo, où Thanos tourne depuis 13h25 (./jour3.sh thanos on).

« Un Prometheus garde quelques semaines, sur un seul serveur. Thanos ajoute, sans toucher aux Prometheus : une vue globale sur plusieurs Prometheus, la déduplication de deux jumeaux, et des années d'historique sur du stockage objet. » Puis : port 10902, Stores, up{job="shop-api"} : 2 séries ; je décoche Use Deduplication : 4. « Les alternatives : Mimir, VictoriaMetrics. Même API : Grafana ne voit pas la différence. À essayer chez vous : ./jour3.sh thanos on. »`,

"Lundi matin jour 3": `« Lundi matin, ne faites pas tout. Choisissez un service. Un seul. Ses quatre signaux dorés en haut d'un dashboard. Une alerte sur un symptôme, avec un responsable, un runbook, et le bon canal Teams. C'est tout. Dans un mois, vous aurez dix services, parce que vos collègues viendront vous demander le même. »

« À la fin de votre guide : une synthèse de toute la formation, quatre checklists de mise en production, un déroulé type, et toutes les ressources. Gardez-le. »

Tour de table éclair : un service chacun, à voix haute. Puis : « Mardi matin, vous ne saviez pas ce qu'était une série temporelle. Aujourd'hui, vous avez construit deux tableaux de bord selon les méthodes de Google, envoyé des alertes dans Teams et par e-mail, et retrouvé deux pannes sans toucher au terminal. Merci à tous. »`,

};

// Jour 3 : pas d'audit de fichier, les règles se retrouvent dans les checklists du guide
module.exports["Configurer Prometheus proprement"] = base["Configurer Prometheus proprement"]
  .replace("Six règles de configuration, que vous allez chercher dans un fichier réel dans dix minutes.", "Six règles de configuration. Vous les retrouverez en checklist à la fin de votre guide, à cocher avant chaque mise en production.");
module.exports["Ce qui rend un dashboard lisible"] = base["Ce qui rend un dashboard lisible"].replace("je les applique dans les deux TP de l'après-midi", "je les applique dans les deux TP de ce matin");
module.exports["Configurer Prometheus proprement"] = module.exports["Configurer Prometheus proprement"].replace("c'est ce qui a permis à Thanos de dédupliquer", "c'est ce qui permettra à Thanos de dédupliquer, tout à l'heure");
