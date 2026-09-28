// Texte à dire, slide par slide. Clé = titre de la slide (ou "LABEL · titre" pour les
// sections, "[statement] début du texte" pour les slides plein écran, "TP n · titre" pour les TP).
// Rédigé à la première personne : c'est ce que je dis, pas un résumé.
module.exports = {

"[titre]": `Slide projetée à l'arrivée. Ma stack tourne depuis 30 minutes dans une seconde copie du dépôt, Grafana ouvert sur le dashboard Boutique dans un autre onglet.

À dire quand tout le monde est assis : « Bonjour à tous, et bienvenue. Pendant trois jours on va parler de Prometheus et de Grafana, mais surtout d'une question : comment on sait ce qui se passe dans un système sans être dessus. Le sous-titre, "de l'écran noir à la vision rayon X", c'est le programme : lundi vous êtes devant un écran noir quand ça tombe, mercredi soir vous voyez à travers. »

Logistique en une minute : horaires, pauses, déjeuner, wifi, toilettes. Puis je passe à la slide suivante.`,

"Votre formateur": `Deux minutes, pas plus. Je ne lis pas la slide.

« Je m'appelle Yohan Parent. Je suis architecte cloud, une quinzaine d'années d'infrastructure, beaucoup de Kubernetes, en banque, en santé, dans l'industrie, sur des périmètres où on n'a pas le droit à l'erreur : SecNumCloud, OIV, HDS. J'enseigne aussi au CESI et à l'Université de Lorraine, et je suis certifié CKS, la sécurité Kubernetes. »

Ce qui compte pour la suite : « Si je fais de l'observabilité aujourd'hui, ce n'est pas par goût des graphiques. C'est parce que j'ai passé beaucoup trop de nuits devant des écrans noirs à chercher pourquoi ça ne marchait plus, et que chaque fois la réponse était la même : parce qu'on ne mesurait pas la bonne chose. Tout ce que je vais vous montrer vient de là. »

Anecdote possible, si le groupe est réceptif : la première astreinte où j'ai dû redémarrer un serveur "au hasard" parce qu'aucun outil ne disait lequel souffrait. Ça a marché. Ça m'a hanté.`,

"Faisons connaissance": `Tour de table, deux minutes par personne, je note au paperboard : prénom, ce qu'ils surveillent, avec quoi, et leur pire panne.

Les pannes vont me servir toute la semaine : je les rappellerai quand on verra l'outil qui aurait aidé. « Vous vous souvenez de la panne de Marc lundi ? Voilà l'alerte qui l'aurait vue venir. » C'est le meilleur fil conducteur qui existe, parce que c'est le leur.

Trois questions de positionnement à la fin du tour, à main levée, sans corriger : Prometheus fait du push ou du pull ? Qu'est-ce qu'une série temporelle ? Quand un site est lent, c'est plutôt l'infra ou plutôt l'applicatif ? Je note mentalement le niveau du groupe : ça décide de la vitesse du module 2.`,

"Ce que je vous promets pour mercredi soir": `« Une formation, ça se juge sur ce que vous savez faire à la fin, pas sur ce que vous avez entendu. Voilà mon contrat. »

Voir : « Vous aurez assemblé vous-même une stack complète. Pas installée par moi, pas livrée toute faite : chaque brique, c'est vous qui l'aurez posée, en sachant pourquoi elle est là. »

Comprendre : « PromQL, le langage de requête, sera un réflexe. Vous saurez répondre à "combien d'erreurs par seconde sur cette route" sans réfléchir. Et vos tableaux de bord seront dans Git, pas cliqués à la souris un vendredi soir. »

Réagir : « Mercredi à 17h, je casse la boutique d'une façon que vous ne connaissez pas. Vous aurez cinq minutes pour dire quoi, où, depuis quand. Et vous aurez été prévenus par Teams avant le client. C'est ça, le test. »

La promesse est mesurable : le war game la vérifie, et je le dis.`,

"Comment bien suivre ces trois jours": `Je passe une minute dessus, sur un ton léger mais je le dis vraiment.

« Quatre règles, et ce sont les seules. Un : posez vos questions tout de suite. Si vous attendez la pause, vous aurez décroché pendant vingt minutes, et la personne à côté de vous se posait la même question. Il n'y a pas de question bête, il y a des choses que je n'ai pas encore expliquées, ou mal expliquées.

Deux : soyez là. Je vous demande le téléphone dans la poche et les notifications coupées, Teams fermé sur le portable. Pas par principe : parce que trois jours c'est court, que tout s'enchaîne, et que ce qu'on rate à 10h manque à 15h. En échange, je vous garantis une pause toutes les 90 minutes, et je ne déborde pas.

Trois : cherchez avant de copier. Les corrigés viennent après un temps de recherche, jamais avant. Dans ce lab, se tromper est le but, ça ne casse rien, et c'est comme ça qu'on retient.

Quatre : dites-moi quand ça va trop vite, ou trop lentement. Vous levez la main, je refais. Le rythme, c'est le vôtre. »

Anecdote si besoin : la session où personne n'a rien dit pendant deux jours, et où j'ai découvert le troisième matin que la moitié de la salle était perdue depuis le module 4. Depuis, je préfère être interrompu.`,

"Trois jours, un fil rouge": `Je lis le tableau ligne par ligne, en une phrase par case.

« Jour 1, Voir : on commence par le pourquoi, puis l'architecture, et dès la fin de matinée vous installez Prometheus et Grafana à la main, en binaires. L'après-midi on passe en conteneurs et on collecte : la machine, l'application, les services tiers.

Jour 2, Comprendre : PromQL toute la matinée, 22 exercices, puis Grafana l'après-midi avec deux vrais tableaux de bord, un serveur Linux et la boutique, versionnés dans Git.

Jour 3, Réagir : des alertes qui ne réveillent que pour de bonnes raisons, Alertmanager, Teams, Slack, l'alerting Grafana, puis l'exploitation, Thanos pour le long terme, et le war game. »

Rythme : 9h-17h30, déjeuner 12h30-14h, deux pauses. Ma règle : jamais plus de 20 minutes sans que vous touchiez au clavier. Si je dépasse, dites-le.`,

"Le lab : une boutique en ligne qu'on va casser": `Le schéma représente ce qu'on aura construit mercredi soir. Ce matin, rien ne tourne : c'est voulu.

« Le fil rouge, c'est une boutique en ligne, shop-api. Deux instances, un catalogue, un panier, un paiement, et un générateur de trafic qui joue les clients en continu. Elle est instrumentée pour de vrai avec la bibliothèque officielle, elle a des métriques techniques et des métriques métier, et je peux la casser à la demande : latence, erreurs, CPU, fuite mémoire. Tout ce qu'on apprend s'applique immédiatement à quelque chose qui tourne sous vos yeux.

Autour : un Redis avec son exporter, le Node Exporter pour la machine, le Blackbox pour sonder de l'extérieur, une Pushgateway pour les batchs. Prometheus au centre, qui va chercher tout ça. Grafana pour regarder, Alertmanager pour prévenir, et l'Inbox, une petite boîte de réception qui joue Teams et Slack pour qu'on voie les notifications sans tenant. Jeudi, Thanos par-dessus. »

Démo : j'ouvre mon dashboard Boutique, tout vert. Je lance ./lab.sh chaos errors on. « À la pause, il sera rouge. Voilà ce que vous saurez construire. »`,

"Une brique à la fois": `« La règle des trois jours : personne ne reçoit une stack toute faite. Le docker-compose.yml du dépôt ne contient qu'une liste de lignes commentées, une par brique. À chaque exercice, on en décommente une, on relance, on regarde ce qu'elle apporte. Et ce matin, avant même les conteneurs, vous lancerez Prometheus et Grafana en binaires, à la main, parce que c'est là qu'on comprend ce qu'il y a dedans. »

Je suis la frise : 1.1 Prometheus en binaire, 1.4 Grafana en binaire, 1.7 les deux en conteneurs, TP 1 la machine, TP 2 l'application et les exporters, mercredi matin l'Alertmanager, mercredi après-midi Thanos.

« À 17h30 ce soir, vous aurez cinq briques et six jobs dans votre prometheus.yml, et chaque ligne, c'est vous qui l'aurez écrite. »`,

"JOUR 1 · Voir": `Transition, dix secondes. « Jour 1 : voir. L'objectif de la journée tient en une phrase : ce soir, votre Prometheus collecte la machine, l'application et les services tiers, et vous savez lire un prometheus.yml sans trembler. »`,

"MODULE 1 · Pourquoi l'observabilité": `« Avant de parler outils, une demi-heure sur le pourquoi. Si vous repartez avec une seule idée de ce module, c'est celle-ci : surveiller la machine ne suffit jamais. »`,

"Les deux pilotes": `Mon analogie fondatrice, je la joue un peu.

« Deux pilotes, même avion, même panne moteur. Le pilote A a un voyant rouge "MOTEUR". Il sait que c'est grave. Il ne sait pas quoi, ni lequel, ni quoi faire. Il panique. Le pilote B a un écran : pression d'huile moteur 2 à moins 40 %, vibration axe Z. Il coupe le moteur 2, il compense, il se pose. La différence n'est pas la compétence du pilote, c'est l'instrument.

Le monitoring, c'est le voyant : ça va ou ça ne va pas. L'observabilité, c'est l'écran : je peux poser une question que je n'avais pas prévue, et obtenir une réponse. Notre métier pendant trois jours, c'est de fabriquer l'écran. »

Définition utilisable que je fais noter : un système est observable quand la question "pourquoi c'est lent ?" a une réponse en moins de cinq minutes, sans se connecter à la machine.`,

"Les trois signaux": `« Trois signaux, trois natures de données.

Les métriques : des nombres horodatés. Le nombre de requêtes, la mémoire utilisée, le stock d'un produit. Quelques octets par point, on peut les agréger, les comparer dans le temps, et surtout alerter dessus. C'est notre sujet pendant trois jours.

Les logs : des événements texte. Riches, on y trouve le détail après coup, mais chers à stocker et à chercher : une ligne de log coûte cent fois une métrique. Loki, côté Grafana.

Les traces : le parcours d'une requête à travers les services, avec le temps passé dans chacun. Indispensables dès qu'on a des microservices. Tempo, OpenTelemetry.

Pourquoi les métriques d'abord ? Parce qu'elles coûtent presque rien, qu'elles tiennent des mois, et que c'est sur elles qu'on alerte. On commence par elles, et Grafana corrèle les trois : d'un pic de latence sur une courbe, vers les traces, vers les logs. »`,

"[statement] Black Friday. Tous les voyants": `Anecdote fondatrice, je la raconte sans lire.

« Black Friday, un site marchand, une équipe infra fière de son monitoring : CPU, mémoire, disque, réseau, tout vert, toute la journée. Le soir, le directeur commercial appelle : chiffre d'affaires de la journée, zéro. Un bug JavaScript sur le bouton "Payer", déployé la veille. Le serveur allait parfaitement bien : il ne recevait simplement plus aucune commande.

Personne n'avait de métrique "commandes par minute". Personne ne surveillait ce qui comptait vraiment. C'est pour ça que notre boutique expose shop_orders_total et shop_revenue_euros_total, et que la première alerte métier qu'on écrira mercredi, c'est "plus de commandes alors qu'il y a du trafic". »

Je laisse deux secondes de silence. Cette histoire revient trois fois dans la formation.`,

"Pull contre push": `Le schéma dessiné, je le commente de gauche à droite.

« Push, l'ancien monde : un agent sur chaque serveur envoie ses données au serveur central. C'est le livreur de pizza. Ça marche très bien... jusqu'au jour où mille serveurs tombent en même temps et que mille livreurs sonnent à la porte du monitoring en même temps. Le monitoring tombe précisément quand on en a besoin. Et un serveur qui ne parle plus, c'est un silence : on ne sait pas s'il est mort ou s'il n'a rien à dire.

Pull, Prometheus : Prometheus va chercher lui-même les métriques, en HTTP, sur chaque cible, à intervalle fixe, toutes les 15 secondes. C'est le buffet à volonté : il se sert à son rythme, il décide de la charge. Et une cible qui ne répond pas, ce n'est pas un silence, c'est une information : up vaut 0. On débogue avec un curl : si je vois la page, Prometheus la voit.

Le push garde un cas d'usage : les jobs trop courts pour être scrapés, les batchs. On verra la Pushgateway cet après-midi. »`,

"Un peu d'histoire, vite": `Trente secondes par carte.

« 2012, SoundCloud : deux ingénieurs venus de Google recréent en open source ce qu'ils avaient chez Google, Borgmon. Open source en 2015.

2016 : la CNCF, la fondation qui héberge Kubernetes, accueille Prometheus comme deuxième projet, juste après Kubernetes. Gradué en 2018. Depuis, c'est le standard de fait : Kubernetes, Docker, la plupart des bases de données et des middlewares exposent nativement le format Prometheus.

Fin 2024, Prometheus 3 : nouvelle interface, UTF-8 dans les noms, OpenTelemetry natif, remote write 2.0. On travaille sur la 3.13, la version LTS, j'explique pourquoi au module 3.

Grafana est né en 2014 comme un fork de Kibana 3, avec une idée : afficher n'importe quelle source de données sans rien stocker. Grafana 13 est sorti en avril 2026, on utilise la 13.2. »`,

"Nagios, Zabbix, Datadog… et Prometheus": `C'est la slide où je réponds à la question que tout le monde a en tête : "on a déjà un outil, pourquoi Prometheus ?". Je prends le temps, en m'appuyant sur ce qu'ils ont dit au tour de table.

« Nagios, et ses héritiers Centreon et Icinga : le serveur lance des checks qui répondent OK, WARNING ou CRITICAL. Vingt-cinq ans de plugins, robuste, très répandu en France grâce à Centreon. Mais ce sont des états, pas des séries : on sait que le disque est à 90 %, on ne sait pas depuis quand ni à quelle vitesse il se remplit. Pas de "pourquoi", pas de tendance, et une configuration lourde par hôte.

Zabbix : un agent, une base SQL, des templates, l'alerting et l'interface intégrés. Un vrai tout-en-un, excellent en SNMP et sur le matériel : baies, switches, onduleurs. Sa limite : le modèle est "un hôte a des items", pas "une série a des labels", et la base SQL souffre au-delà de quelques millions de valeurs. Pour un parc de serveurs classiques, c'est très bien, et je ne remplace jamais un Zabbix qui marche.

Datadog, Dynatrace, New Relic : du SaaS, un agent, tout intégré, métriques, logs, traces, APM, avec de l'analyse automatique. Zéro opération. Le prix se compte par hôte et par volume, il monte vite, les données sont chez un tiers, et on ne sort plus.

Prometheus avec Grafana : le pull, les labels, PromQL, la découverte de services. Né pour les conteneurs, où les cibles apparaissent et disparaissent toutes les minutes : là, Nagios et Zabbix ne suivent pas. Ses limites, il faut les connaître : seul, il n'a pas d'interface riche, c'est Grafana ; pas de long terme, c'est Thanos ou Mimir ; pas d'authentification, c'est un reverse proxy ; et il faut l'opérer.

Ma règle : Kubernetes, conteneurs, microservices, une équipe DevOps, une exigence de souveraineté : Prometheus. Un parc de serveurs et de réseau stable, une équipe système : Zabbix ou Centreon font le travail, et Prometheus peut venir à côté pour les applications. Pas de monde, pas de compétence, un budget : le SaaS. Ce n'est pas mieux dans l'absolu, c'est mieux dans son contexte, et son contexte est devenu la norme. »

Anecdote : le client qui avait Centreon pour l'infra et Prometheus pour Kubernetes, et qui a mis six mois à accepter que ce n'était pas un doublon mais deux outils pour deux mondes. Aujourd'hui les deux tournent, et les alertes des deux arrivent dans le même Alertmanager.`,

"Où se place Prometheus dans l'écosystème CNCF": `« La CNCF, Cloud Native Computing Foundation, c'est la fondation créée en 2015 autour de Kubernetes. Elle héberge aujourd'hui des centaines de projets, et le pari est toujours le même : des briques ouvertes, interchangeables, qui parlent le même format. On ne choisit pas un fournisseur, on assemble.

Orchestrer : Kubernetes, premier projet gradué, Helm pour packager, Argo CD et Flux pour déployer depuis Git. Dans ce monde, les cibles bougent tout le temps : un pod vit quelques heures. C'est pour ça que Prometheus a la découverte de services au cœur, et pas en option.

Observer, métriques : Prometheus, deuxième projet, gradué 2018. Thanos et Cortex, devenu Mimir chez Grafana, pour le long terme et la haute disponibilité. OpenMetrics pour standardiser le format texte.

Observer, logs et traces : Fluentd et Fluent Bit pour collecter les logs, Loki pour les stocker à la Prometheus, Jaeger et Tempo pour les traces. Et OpenTelemetry, le projet le plus actif de la fondation après Kubernetes : une seule façon d'instrumenter les trois signaux, que Prometheus 3 reçoit nativement.

Ce qu'il faut retenir : Prometheus n'est pas un outil isolé, c'est le modèle de données autour duquel tout l'écosystème s'est aligné. Quand vous instrumentez au format Prometheus, tout le reste s'emboîte. »

Si on me demande "et Grafana ?" : Grafana n'est pas un projet CNCF, c'est une entreprise, mais Grafana Labs contribue à la plupart de ces projets et son produit les affiche tous. C'est la maquette, on y revient dans une minute.`,

"MODULE 2 · Architecture de Prometheus": `« Module 2 : comment c'est fait. Les composants, le modèle de données, et les quatre types de métriques. C'est le module le plus important de la journée : tout le PromQL de demain repose sur le modèle de données. »`,

"Les composants": `Je dessine au tableau dans cet ordre, le schéma projeté sert de vérification.

« À gauche, les cibles : n'importe quoi qui expose une page /metrics en HTTP. Une application, un exporter, Prometheus lui-même.

Au centre, Prometheus, qui fait trois choses. Il scrape : c'est le journaliste qui fait sa tournée toutes les 15 secondes et note ce qu'il voit. Il stocke : une base de séries temporelles, la TSDB, les archives. Il évalue des règles : c'est le rédacteur en chef qui décide ce qui mérite un titre, les alertes, et ce qui mérite d'être pré-calculé, les recording rules.

À droite, deux clients. Grafana, la maquette : il interroge Prometheus en PromQL et dessine. Il ne voit jamais les cibles, il ne stocke jamais une métrique. Alertmanager : il reçoit les alertes, il décide qui prévenir, quand, combien de fois, et il parle à Teams, Slack, PagerDuty.

Et en bas à gauche, la découverte de services : qui dit à Prometheus qui scraper, parce que lister les cibles à la main ne tient pas au-delà de dix serveurs. »`,

"Le modèle de données": `Le concept le plus important de la journée. Je le fais reformuler par un stagiaire à la fin.

« Une ligne : http_requests_total, accolade, method égale GET, route égale /api/products, status égale 200, accolade, 51. Le nom de la métrique, un jeu de labels, une valeur. Et un timestamp, implicite, celui du scrape.

Une série, c'est un nom plus une combinaison de valeurs de labels. Changez une seule valeur de label, POST au lieu de GET, c'est une autre série. Chaque combinaison possible crée une série distincte. C'est d'une puissance énorme : je peux découper par n'importe quelle dimension, par route, par code, par instance, sans avoir prévu la question. Et c'est dangereux : si je mets l'identifiant de l'utilisateur en label, un million d'utilisateurs, un million de séries. On appelle ça la cardinalité, et c'est le seul vrai moyen de tuer un Prometheus. On y revient au module 6.

Deux labels réservés : job, le nom du groupe de cibles, et instance, l'adresse de la cible. Prometheus les ajoute lui-même. Tout ce qui commence par deux underscores est interne. »`,

"Les quatre types": `« Quatre types, et une analogie pour les deux premiers : le compteur kilométrique de la voiture.

Counter : ne fait que monter. 150 000 km au compteur, est-ce que je roule vite ? Aucune idée. Un counter ne se lit jamais brut : on regarde sa vitesse, rate(), ou son augmentation sur une période, increase(). Requêtes, erreurs, commandes.

Gauge : monte et descend. La jauge d'essence. Mémoire utilisée, stock, connexions ouvertes. Elle se lit brute, on peut regarder son max ou sa moyenne dans le temps.

Histogram : compte par tranches, les buckets. Combien de requêtes ont pris moins de 100 ms, moins de 250 ms, moins d'une seconde. C'est ce qui permet de calculer un p95 après coup, avec histogram_quantile, et de l'agréger entre plusieurs instances. Latences, tailles.

Summary : les quantiles calculés côté client, dans le processus. Précis, mais impossible à agréger entre instances : la moyenne de deux p95 ne veut rien dire. Ancienne école. En 2026, on prend Histogram, et les native histograms, stables depuis la 3.9, rendent les buckets automatiques. »`,

"Le format d'exposition : du texte, lisible": `Je montre la vraie page dans le navigateur juste après, celle de Prometheus lui-même sur le port 9090, puisque la boutique n'est pas encore là.

« Le format d'exposition est du texte. Une ligne HELP, une ligne TYPE, puis une ligne par série avec sa valeur. N'importe quel langage peut produire ça avec un printf. C'est pour ça que tout le monde l'a adopté : c'est trivial à implémenter et lisible par un humain avec un curl.

Regardez l'histogramme : les buckets sont cumulatifs. le égale 0.25 compte tout ce qui est sous 250 ms, y compris ce qui était sous 100 ms. Le dernier bucket, +Inf, compte tout. La somme et le compte suivent. Retenez la forme, on la retrouve demain dans histogram_quantile. »

Démo : localhost:9090/metrics, Ctrl+F sur TYPE, je montre un counter, une gauge, l'histogramme des requêtes HTTP de Prometheus.`,

"Le chemin d'un échantillon : la TSDB": `Je suis le schéma de gauche à droite.

« Un échantillon arrive par le scrape. Il va d'abord dans le head, en mémoire, qui garde les deux dernières heures. Et en même temps il est écrit dans le WAL, le journal sur disque : si Prometheus crashe, au redémarrage il rejoue le journal et ne perd rien.

Toutes les deux heures, le head est écrit sur disque sous forme d'un bloc, immuable, avec son index et ses chunks compressés : un à deux octets par échantillon. Les blocs sont ensuite compactés en blocs plus gros, et la rétention, 15 jours par défaut, supprime les plus anciens.

Un snapshot, on le verra mercredi, c'est des liens durs vers les blocs plus une copie du head : instantané. Et Thanos, mercredi aussi, c'est un sidecar qui envoie ces blocs dans un stockage objet.

Grafana ne voit rien de tout ça : il pose une question en PromQL, Prometheus lit le head puis les blocs, et répond. Donc quand Grafana affiche "No data", la première chose à faire est de tester la requête dans Prometheus. »`,

"MODULE 3 · Installer à la main": `« Module 3 : on installe. Pas en cliquant sur "créer le Codespace et tout démarre", en binaire, à la main, un fichier après l'autre. Une heure, exercices compris, et à la fin vous aurez vu les tripes de la bête. »`,

"Cinq façons d'installer Prometheus": `« Cinq façons, par ordre de fréquence en 2026.

Kubernetes avec l'opérateur, kube-prometheus-stack en Helm : le cas majoritaire en production. Les cibles sont découvertes toutes seules, la configuration passe par des objets Kubernetes, ServiceMonitor, PrometheusRule.

Conteneur Docker : une image, un YAML monté. Labs, petits sites, notre cas dès cet après-midi.

Binaire : une archive sur GitHub, un exécutable Go sans dépendance, un YAML, un dossier data. C'est ce qu'on fait maintenant, parce que c'est là qu'on comprend.

Paquet de la distribution : apt, dnf. Souvent plusieurs versions de retard, je déconseille.

Managé : Grafana Cloud, Amazon, Google, ou un stockage compatible. Quand on ne veut pas opérer. On en parle mercredi.

Même chose pour Grafana : Helm, Docker, les dépôts deb et rpm de Grafana Labs, qui eux sont à jour, le binaire, ou Grafana Cloud. »`,

"Quelle version ? La question qu'on oublie": `Question à la salle avant de parler : « Qui sait quelle version de Prometheus tourne chez vous, et depuis quand elle n'a pas été mise à jour ? » Le silence est la réponse habituelle.

« Prometheus sort une version mineure toutes les six semaines : 3.12 en mai, 3.13 en juillet, 3.14 en août, 3.15 la semaine dernière. Et une mineure cesse de recevoir des correctifs dès que la suivante sort. Celui qui installe la 3.14 aujourd'hui installe une version que plus personne ne corrige.

Une fois par an, une mineure est déclarée LTS, Long Term Support : elle reçoit pendant un an les correctifs de sécurité et de bugs graves, avec un mois de recouvrement avec la LTS suivante. En ce moment, c'est la 3.13, sortie le 1er juillet, supportée jusqu'au 31 juillet 2027, déjà trois patchs. C'est celle du lab, et c'est ce que je recommande en production : suivre la LTS, appliquer ses patchs dans le mois, ne passer sur une mineure hors LTS que pour une fonctionnalité dont on a vraiment besoin. Et jamais une version qui a moins d'un mois : on laisse les autres essuyer les plâtres.

Grafana n'a pas de LTS : une majeure par an en avril, une mineure tous les deux mois, des patchs mensuels. Le bon rythme : suivre les mineures avec un mois de retard, en lisant le changelog, et surtout lire le guide de migration à chaque majeure. »

Anecdote : chez un client, un Prometheus 2.37 tournait depuis trois ans "parce que ça marche". Le jour où il a fallu brancher un exporter récent, ses native histograms ont fait tomber le scrape. Mise à jour vers la 3 dans l'urgence, un vendredi, avec les changements de PromQL et d'interface d'un coup. Une LTS suivie, c'est deux mises à jour par an, prévues, ennuyeuses. L'ennui, c'est le but.`,

"Les fichiers et dossiers qui comptent": `« Ce qu'il y a dans une installation, et c'est tout.

Prometheus : prometheus.yml, la configuration ; un dossier data, la base, qu'on pointe avec --storage.tsdb.path ; la rétention, 15 jours par défaut ; et un flag à connaître, --web.enable-lifecycle, qui autorise le rechargement de la configuration par HTTP. Port 9090. Pas d'authentification : je le répète parce que ça surprend. Prometheus part du principe qu'il est derrière un reverse proxy.

Grafana : conf/defaults.ini qu'on ne modifie jamais, custom.ini ou des variables d'environnement GF_ pour surcharger ; un dossier data avec sa base SQLite, grafana.db ; et le dossier provisioning, où on décrit en YAML les sources de données, les dashboards, l'alerting. Port 3000, compte admin, et le flag --homepath pour lui dire où sont ses fichiers.

Il n'y a rien d'autre. Pas de base de données à installer, pas de service tiers. »

Je ne montre rien avant les exercices : je fais avec eux, terminal projeté.`,

"Exercices 1.1 à 1.4 — installer à la main (50 min)": `Je projette mon terminal et j'avance au même rythme qu'eux, en commentant.

1.1 : « Ouvrez la page des releases de Prometheus sur GitHub. Dernière version, LTS, celle que prend le script. Puis ./install/download.sh. Regardez ce qu'il y a dans l'archive : deux exécutables, prometheus et promtool. Écrivez un prometheus.yml à un seul job, prometheus lui-même, et lancez. Lisez les logs : version, port, où il écrit. Target health : une cible, UP. Et regardez le dossier data : wal, chunks_head, un lock. » Pièges : Gatekeeper sur Mac, le chemin ..\\..\\ sous Windows, l'onglet Ports sur Codespaces.

1.2 : « Prometheus se surveille lui-même. Ouvrez sa page /metrics et trouvez un exemple de chaque type. Comptez les lignes : 700 séries pour une seule cible, ça donne l'échelle. »

1.3 : « L'interface : Status, Configuration, TSDB status, la requête up, les filtres par label, et l'onglet Explain qui décompose une requête. C'est tout le PromQL dont on a besoin aujourd'hui. »

1.4 : « Grafana en binaire, avec --homepath, sinon il cherche dans /usr/share/grafana et refuse. Datasource cliquée à la main, URL localhost:9090, Save & test. Explore, la requête up. Et regardez data/grafana.db : Grafana ne stocke que sa configuration. Cet après-midi, cette datasource sera provisionnée par fichier, et on comparera. »`,

"MODULE 4 · Configuration de Prometheus": `« Module 4 : le fichier prometheus.yml. Le lire, le modifier sans casser, le recharger à chaud, et deux idées qui changent tout, la découverte de services et le relabeling. »`,

"Anatomie de prometheus.yml": `« Quatre blocs, et vous les connaissez déjà en partie.

global : les réglages par défaut. scrape_interval, le pouls, 15 secondes. evaluation_interval, le rythme des règles. Et external_labels, des labels ajoutés quand Prometheus parle à l'extérieur : à l'Alertmanager, à Thanos. On y revient mercredi, c'est la clé de Thanos.

rule_files : où sont les règles d'enregistrement et d'alerte. Demain et mercredi.

alerting : où sont les Alertmanager. Dans le dépôt, ce bloc est commenté, on n'a pas encore d'Alertmanager. On le décommentera mercredi matin.

scrape_configs : la liste des jobs. Un job regroupe des cibles de même nature, et chaque cible reçoit automatiquement les labels job et instance. Les labels qu'on écrit sous static_configs s'appliquent à toutes les cibles du bloc.

Le rythme : trop court, on charge les cibles et le disque ; trop long, on rate les pics. 15 secondes est le standard, 30 ou 60 pour les gros parcs, 5 pour un besoin précis. Et une règle pour demain : la fenêtre de rate() doit faire au moins quatre fois le scrape_interval.

Recharger sans redémarrer : kill -HUP, ou un POST sur /-/reload si le lifecycle est activé. Fichier invalide ? Prometheus garde l'ancienne configuration, le dit dans ses logs, et la métrique prometheus_config_last_reload_successful passe à 0. On alertera dessus mercredi. »`,

"Valider, recharger, découvrir": `Démo sur mon binaire : je casse l'indentation d'une ligne, promtool check config refuse avec la ligne et la colonne, je répare, kill -HUP, la ligne "Completed loading of configuration file" dans le terminal.

« Valider avant, toujours. promtool check config, c'est le nginx -t de Prometheus. En conteneur, cet après-midi : ./lab.sh check.

Recharger à chaud : on vient de le voir. Une config cassée qui traîne, personne ne s'en rend compte sans alerte.

La découverte de services : lister les cibles à la main ne tient pas au-delà de dix serveurs. Prometheus sait interroger Kubernetes, le plus utilisé, Consul, DNS, EC2, Azure, GCE, Docker, et le plus simple de tous, un fichier, file_sd, que n'importe quel script peut écrire. Le fichier est relu automatiquement, sans reload. C'est le pont idéal avec ce que vous avez déjà : une CMDB, Ansible, Terraform. On s'en sert au TP 2.

Le relabeling : entre la découverte d'une cible et son scrape, Prometheus passe la cible dans une chaîne de règles qui peuvent renommer, filtrer, réécrire. C'est le videur à l'entrée de la boîte de nuit : il regarde les labels et décide qui entre, et sous quel nom. Et metric_relabel_configs fait la même chose après le scrape, sur chaque série : c'est là qu'on jette les métriques inutiles avant qu'elles ne coûtent du disque. L'exemple concret, c'est le Blackbox, cet après-midi. »`,

"Exercices 1.5 et 1.6 — configuration (25 min)": `Toujours sur le binaire.

1.5 : « Passez le scrape_interval du job prometheus à 5 secondes, au niveau du job, pas dans global. promtool check config. Rechargez avec kill -HUP ; sous Windows il n'y a pas de signal, redémarrez avec --web.enable-lifecycle et faites un POST sur /-/reload, c'est ce qu'on fera systématiquement en conteneur. Vérifiez dans Target health, colonne Last scrape, et avec prometheus_target_interval_length_seconds. Puis remettez 15 secondes. »

1.6 : « Cassez le fichier, un deux-points en trop. Rechargez sans valider. Regardez le terminal, et la métrique prometheus_config_last_reload_successful : 0. Réparez, rechargez, elle repasse à 1. Puis arrêtez Prometheus et relancez-le avec le fichier cassé : là, il refuse de démarrer. »

Le message : Prometheus est conservateur en marche, intraitable au démarrage. Tout le monde répare avant le déjeuner, et on laisse les deux binaires tourner : on les arrêtera à 14h.`,

"Exercice 1.7 — Des binaires aux conteneurs": `Vingt minutes après le déjeuner.

« Ce matin, à gauche : un binaire, son YAML, son dossier data, un reload par signal, une datasource cliquée. Cet après-midi, à droite : exactement la même chose, en boîte. L'image contient le binaire, le YAML est monté depuis le dossier prometheus du dépôt, les données vont dans un volume nommé, et le reload passe par HTTP parce qu'on n'envoie pas de kill dans un conteneur qu'on ne veut pas ouvrir.

Étape 1, la plus importante : arrêtez les deux binaires, Ctrl+C dans chaque terminal. Sinon : port already allocated. Étape 2 : ouvrez compose/01-prometheus.yml et lisez-le. Où est le prometheus.yml ? Le dossier de données ? Quels flags en plus ? Étape 3 : dans docker-compose.yml, décommentez 01 et 02, ./lab.sh up, ./lab.sh status. Puis dans Prometheus, Status, Configuration : ce n'est plus votre fichier de ce matin, c'est celui du dépôt, avec un seul job. Dans Grafana, admin / formation : la datasource est déjà là, avec un cadenas. Elle vient de grafana/provisioning/datasources. Son URL n'est plus localhost mais prometheus:9090 : dans un conteneur, localhost c'est le conteneur lui-même ; entre conteneurs on utilise le nom du service, résolu par le DNS de Docker. Et un dashboard "Bienvenue" est apparu tout seul : même mécanisme, le provisioning, on y revient demain. »

À partir d'ici, le fichier à modifier est prometheus/prometheus.yml, monté dans /etc/prometheus.`,

"MODULE 5 · Les exporters": `« Module 5, les exporters. Une image à retenir : l'adaptateur de prise universel. »`,

"Les incontournables": `« Le problème : Prometheus parle HTTP et ne comprend que son format texte. Le noyau Linux parle /proc et /sys. PostgreSQL parle SQL. Un switch parle SNMP. Un exporter est un adaptateur : un petit programme qui interroge le système d'un côté et expose une page /metrics de l'autre.

Les incontournables : node_exporter pour Linux, windows_exporter pour Windows, CPU, mémoire, disque, réseau. blackbox_exporter pour sonder de l'extérieur : HTTP, TCP, ICMP, DNS, certificats. cAdvisor et kube-state-metrics pour les conteneurs et Kubernetes. Un exporter par base de données : postgres, mysqld, redis, mongodb. snmp_exporter pour le réseau. Et la Pushgateway, qui n'est pas un exporter mais un relais pour les batchs.

Le catalogue officiel en liste des centaines. Avant d'en écrire un, on vérifie. Et de plus en plus de logiciels exposent nativement le format, sans exporter : Kubernetes, Traefik, Envoy, HAProxy, Vault, GitLab. »`,

"Node Exporter et le piège Docker": `Démo : localhost:9100/metrics n'existe pas encore chez eux ; je montre le mien. node_cpu_seconds_total, node_memory_MemAvailable_bytes, node_filesystem_avail_bytes.

« Le Node Exporter, c'est une soixantaine de collectors, une trentaine actifs par défaut, qu'on active ou désactive avec --collector.x et --no-collector.x. Et un collector à part, textfile : il lit des fichiers .prom déposés dans un dossier par n'importe quel script. C'est la Pushgateway du pauvre, et elle est souvent préférable : pas de composant en plus, et le fichier disparaît avec la machine.

Le piège Docker : dans un conteneur nu, le Node Exporter voit le conteneur. Un CPU, quelques mégas, un overlay. Pour qu'il voie la machine, on lui monte /proc, /sys et / en lecture seule et on lui dit où avec --path. C'est fait dans la brique 04, vous le lirez. Et sur Docker Desktop, sur Mac ou Windows, "l'hôte" est la machine virtuelle Linux de Docker : les chiffres sont ceux de la VM. Je le redis pendant le TP, c'est un bon prétexte pour expliquer comment Docker Desktop fonctionne. En production Linux, le Node Exporter s'installe en binaire ou en paquet sur l'hôte, pas en conteneur. »`,

"Blackbox et Pushgateway": `« Blackbox : tous les autres exporters disent "je vais bien" de l'intérieur. Le Blackbox teste de l'extérieur, comme un client : est-ce que le site répond 200 ? En combien de temps ? Le certificat expire quand ? Le port est ouvert ? Prometheus l'appelle sur /probe avec deux paramètres, le module et la cible. Et ça pose un problème : comment Prometheus sait-il que la cible à scraper, c'est l'exporter, mais que le résultat concerne le site ? C'est le relabeling, slide suivante.

Pushgateway : pour les jobs trop courts pour être scrapés. Un batch qui tourne trois secondes à 3h du matin, Prometheus ne le verra jamais. Alors le batch pousse ses métriques, la Pushgateway les garde, et Prometheus scrape la Pushgateway. Attention : elle n'oublie jamais. Pas de TTL. Si le batch ne tourne plus, la métrique reste là, figée, avec son timestamp qui vieillit. C'est exactement ce qu'on veut pour alerter "pas de sauvegarde depuis 24 h". Et c'est uniquement pour des batchs, jamais pour des services : un service, on le scrape. »

Démo : localhost:9115/probe?module=http_2xx&target=http://shop-api-1:5000/health sur ma stack, probe_success 1.`,

"Comment Prometheus parle au Blackbox": `Le meilleur exemple de relabeling qui existe, je le décortique règle par règle, en suivant le schéma.

« Au départ, Prometheus a une liste de cibles : http://shop-api-1:5000/health, et les autres. Sans relabeling, il essaierait de scraper cette URL directement, et ça ne donnerait rien. Trois règles.

Un : l'adresse de la cible, __address__, ce que Prometheus s'apprête à scraper, est copiée dans __param_target. Tout label qui commence par __param_ devient un paramètre d'URL : ça ajoute ?target=http://shop-api-1... à la requête.

Deux : cette même valeur devient le label instance. Sinon, toutes les sondes auraient instance égale blackbox-exporter:9115 et on ne saurait pas de quel site on parle.

Trois : __address__ est remplacée par l'adresse de l'exporter. C'est lui qu'on scrape vraiment.

Résultat : Prometheus appelle http://blackbox-exporter:9115/probe?module=http_2xx&target=http://shop-api-1:5000/health, et étiquette le résultat instance égale l'URL du site.

Conséquence à bien comprendre : quand le site tombe, up reste à 1, parce que l'exporter, lui, répond très bien. C'est probe_success qui passe à 0. Avec le Blackbox, up ne veut plus dire ce qu'on croit. Vous le verrez au TP 2, et c'est une question du quiz de ce soir. »`,

"TP 1 · Node Exporter : de la machine à Prometheus": `Le cas pratique du programme. 55 minutes.

« Mise en situation : vous venez de recevoir un serveur. Avant d'y déployer quoi que ce soit, vous voulez ses signes vitaux dans Prometheus : CPU, mémoire, disque, réseau, uptime. Et vous voulez pouvoir y ajouter vos propres indicateurs avec un simple script.

Partie 1 : lisez compose/04-node-exporter.yml, les trois montages, activez la brique, ajoutez le job node, validez, rechargez, node_uname_info.

Partie 2 : cinq indicateurs, les métriques et fonctions sont données. La formule CPU, je vous la donne à recopier et à comprendre : c'est la requête la plus recopiée de l'histoire de Prometheus, et peu de gens la comprennent la première fois. On y passe cinq minutes ensemble à la correction. Puis chaos cpu 120 pour voir la courbe monter.

Partie 3 : les collectors, dans le fichier de la brique, pas ailleurs. Piège : le double dollar dans compose.

Partie 4 : le textfile collector. Une gauge backup_last_run_timestamp_seconds déposée par un script. Sous Windows, Set-Content écrit du CRLF que le collector refuse : la commande est dans le guide.

Partie 5 : topk, réseau, Explore dans Grafana, et le dashboard communautaire 1860 pour voir ce que vous saurez construire demain. »

Anecdote de la partie 4, les sauvegardes fantômes : un script de sauvegarde écrivait "OK" dans un log depuis dix-huit mois. Personne ne lisait le log. Le jour de la restauration, la dernière sauvegarde valide datait de dix-huit mois : le montage NFS avait disparu, le script écrivait dans le vide. Une gauge et une alerte "plus de 24 h" auraient coûté dix minutes. On l'écrit mercredi.

Bonus 1.8, relabeling, pour les rapides.`,

"MODULE 6 · Instrumenter son application": `« Module 6 : le Node Exporter et le Blackbox regardent l'application de l'extérieur. Instrumenter, c'est mettre les sondes à l'intérieur. C'est la seule façon d'avoir des métriques métier, et c'est ce que vous faites au TP 2. »`,

"Une bibliothèque cliente, quatre objets": `J'ouvre apps/shop-api/app.py à côté : les déclarations existantes, le middleware _observe, la route checkout, et les cinq TODO que le TP 2 va combler, sans les faire.

« Une bibliothèque cliente existe pour chaque langage : Go, Java avec Micrometer, Python, Ruby, Rust officiels ; .NET, Node, PHP par la communauté. Quatre objets, les quatre types du module 2.

On déclare une métrique une fois, au chargement, avec son nom, sa description et ses labels. Puis dans le code, on l'alimente : inc() sur un counter, set() sur une gauge, observe() sur un histogramme, en passant les valeurs de labels. La bibliothèque tient tout en mémoire dans le processus et expose /metrics toute seule. Deux conséquences : un compteur repart à zéro au redémarrage, ce n'est pas grave, rate() gère les remises à zéro ; et si le processus tombe, ses métriques tombent avec, d'où l'intérêt du scrape régulier.

Le nommage : snake_case, un préfixe de domaine, l'unité de base en suffixe, _seconds, _bytes, jamais _ms, et _total pour les counters. Grafana convertit les unités, pas la peine de le faire dans le code. »`,

"Ce que la boutique doit exposer": `« Pour un service, la méthode RED : Rate, le débit ; Errors, la part qui échoue ; Duration, la latence. Trois métriques, et vous savez si un service va bien. Pour une ressource, machine, disque, file d'attente, c'est USE : Utilisation, Saturation, Erreurs. Ce sont les golden signals de Google SRE.

La boutique est livrée avec le Rate, http_requests_total, et donc les Errors, puisque le code HTTP est un label. Il manque la Duration, l'histogramme, et tout le métier : commandes, chiffre d'affaires, stock, version déployée, vues produit. Cinq TODO, c'est le TP 2.

Et le post-it à droite, le seul vrai danger : les labels. method, status, route : bornés, quelques valeurs, stables. user_id, email, adresse IP, URL brute avec ses paramètres, terme de recherche : non bornés. Un million d'utilisateurs, un million de séries. Les données à forte cardinalité vont dans les logs et les traces, jamais dans les labels. »`,

"Nommer, découper, ne pas se tuer": `Anecdote du label customer_id, que je raconte à chaque session parce qu'elle est vraie et qu'elle marque.

« Un développeur bien intentionné ajoute customer_id sur http_requests_total, "pour pouvoir filtrer par client". Quinze millions de clients. Quinze millions de séries. Prometheus est passé de 2 Go à 60 Go de RAM en une semaine, et redémarrait toutes les heures. On l'a trouvé avec la page TSDB status, qui liste les labels avec le plus de valeurs. La correction a pris une ligne : un metric_relabel_configs qui jette le label. La leçon a pris une semaine d'astreinte.

Les quatre cartes : nommage, RED et USE, labels autorisés, labels interdits. Je fais lire la dernière à voix haute. »`,

"TP 2 · Application, instrumentation et services tiers": `60 minutes, le gros TP de la journée.

« Mise en situation : l'équipe boutique livre son API à moitié instrumentée. Le directeur commercial veut son chiffre d'affaires en temps réel et les fiches produit les plus vues. L'infra veut surveiller Redis. Le support veut savoir si le site répond de l'extérieur. Et il y a ce batch de sauvegarde nocturne.

Partie 1 : la brique 03, lisez-la : deux instances de la même image, pourquoi, et un générateur de trafic. Le job shop-api. Regardez /metrics : ce qui existe, ce qui manque.

Partie 2 : les cinq TODO dans app.py, chacun en deux temps, déclarer puis alimenter. Rebuild avec --build, sinon l'ancienne image repart et rien ne change, c'est l'erreur numéro un. Les autres : oublier .labels() avant .inc(), et mettre l'incrément de PRODUCT_VIEWS avant la vérification du catalogue, ce qui permettrait à n'importe qui de créer des séries à l'infini en appelant une URL au hasard.

Partie 3 : brique 05, le job redis, la commande Redis la plus utilisée.

Partie 4 : le Blackbox, quatre sondes, les trois règles de relabeling. Arrêtez shop-api-2 et regardez up et probe_success : c'est le moment où tout le monde comprend.

Partie 5 : le batch, la Pushgateway avec honor_labels, et le job par fichier, file_sd. Modifiez le fichier de cibles sans reload : au bout de 30 secondes, la cible change.

Bonus : la cardinalité. 200 routes fois 50 instances fois 12 buckets, combien de séries ? »

Question à poser en corrigeant : « quel type pour le stock ? » Une gauge, et on la set() depuis la valeur réelle plutôt que de la dec() : si le code et la métrique divergent, c'est la valeur réelle qui a raison.`,

"Récap du jour 1": `Quiz à l'oral, réponses au tableau, huit questions, cinq minutes. Puis je projette les corrigés de prometheus.yml et d'app.py et chacun compare avec le sien.

« Ce que vous emportez ce soir : un binaire, un YAML, un dossier data, et en conteneur la même chose plus le provisioning. Le pull, up égale 0, le débogage au curl. Un counter ne se lit jamais brut. Une série, c'est un nom plus des labels, et la cardinalité est le seul vrai danger. promtool check avant chaque reload. Un exporter est un adaptateur, et avec le Blackbox c'est probe_success qui compte. honor_labels pour la Pushgateway, file_sd relu sans reload.

État attendu : cinq briques, six jobs UP, cinq TODO faits. Ne faites pas ./lab.sh reset ce soir : on veut de l'historique pour demain. Sur Codespaces, le Codespace peut s'arrêter tout seul, les données restent. »`,

"JOUR 2 · Comprendre": `« Jour 2 : comprendre. Ce matin, PromQL devient un réflexe. Cet après-midi, deux tableaux de bord complets, paramétrables, versionnés dans Git. »

Avant de commencer : ./lab.sh up chez tout le monde, six jobs UP, et shop_orders_total visible sur /metrics. Tout le PromQL du matin s'appuie sur les métriques qu'ils ont écrites hier. Cinq minutes maximum.`,

"MODULE 7 · PromQL, les fondations": `« PromQL n'est pas SQL. Il n'y a pas de SELECT, pas de FROM. On nomme une métrique, on filtre par labels, on applique des fonctions. Ça se lit de l'intérieur vers l'extérieur, et une fois qu'on a compris quatre types de résultats, tout le reste suit. »`,

"Quatre types de résultats": `« Instant vector : une valeur par série, à un instant donné. up, http_requests_total filtré sur un job. C'est ce que Grafana dessine : pour chaque point du graphique, il évalue la requête à cet instant.

Range vector : pour chaque série, toutes les valeurs sur une fenêtre de temps. http_requests_total entre crochets 5m. Ça ne se dessine pas, Grafana refuse, ça nourrit une fonction, rate() par exemple, qui en fait un instant vector.

Scalar : un nombre. 42, time(), ou scalar() appliqué à un vecteur d'une seule série.

String : rarissime, on l'oublie.

L'erreur classique du débutant : mettre un range vector dans Grafana et avoir "invalid expression type". La règle : les crochets vont toujours dans une fonction. »`,

"Sélecteurs et décalages": `Démo dans l'onglet Query, Table puis Graph, et l'onglet Explain.

« Quatre matchers : égal, différent, tilde pour une regex, point d'exclamation tilde pour une regex négative. Les regex sont ancrées : status égale tilde "5.." matche exactement trois caractères commençant par 5, pas "n'importe quoi contenant un 5".

Le nom de la métrique est un label comme les autres, __name__ : on peut sélectionner toutes les métriques qui commencent par shop_.

offset décale dans le temps : la valeur d'il y a une heure. Utile pour comparer aujourd'hui à hier, ou à la semaine dernière. Et @ fige la requête sur un instant précis, la fin de la plage par exemple. »`,

"Opérateurs et agrégations": `« L'arithmétique entre deux métriques marche si elles ont exactement les mêmes labels : Prometheus apparie les séries une à une. node_memory_MemAvailable divisé par MemTotal : même instance, même job, ça marche. Si les labels diffèrent, on verra demain matin on, ignoring et group_left.

Une comparaison filtre : shop_stock_units inférieur à 20 ne renvoie que les séries sous 20. C'est la base des alertes : une alerte se déclenche quand l'expression renvoie au moins une série. Avec bool, on obtient 0 ou 1 pour toutes.

Les agrégations : sum by (route) donne une série par route, en additionnant tout le reste. sum without (instance) jette instance et garde tous les autres labels. sum tout court : un seul nombre. C'est le tableau croisé dynamique de PromQL. topk, count, avg, min, max, quantile : même syntaxe. »`,

"Série A — sélection et agrégation (40 min)": `Seuls, dans Prometheus, pas dans Grafana. Je projette le corrigé de deux exercices toutes les cinq minutes, pour que personne ne reste bloqué plus de dix minutes sur un exercice.

Les pièges attendus : 2.3, ils essaient de dessiner un range vector ; 2.6, un total brut n'est pas un débit, c'est justement l'objet du module suivant ; 2.8, topk sur le stock renvoie une série par instance, il faut agréger d'abord ; 2.10, count(count by (route)(...)) : deux agrégations imbriquées, je l'explique au tableau.

Pour les rapides : les codes HTTP distincts par route.

Dans le déroulé Apicil, série réduite : 2.1, 2.2, 2.4, 2.6, 2.8, 2.10.`,

"MODULE 8 · PromQL avancé": `« Module 8 : rate et ses cousins, les histogrammes, les jointures, les recording rules. C'est la moitié de PromQL que les gens ne prennent jamais le temps d'apprendre, et c'est celle qui fait la différence entre un dashboard qui ment et un dashboard qui dit vrai. »`,

"rate, irate, increase": `Démo : rate contre irate sur le débit de la boutique, après ./lab.sh traffic 30 : rate lisse, irate est nerveux.

« rate(x[5m]) : la pente moyenne par seconde sur les 5 dernières minutes. Lisse, robuste, gère les remises à zéro du compteur. C'est LA fonction, pour les graphiques et pour les alertes.

irate : la pente entre les deux derniers points seulement. Très réactif, très nerveux. Pour un graphique haute résolution, jamais pour une alerte : une alerte sur irate sonne à chaque pic d'une seconde.

increase(x[1h]) : de combien le compteur a augmenté sur une heure. C'est rate fois la durée, donc ça peut donner 5,53 commandes, parce que Prometheus extrapole sur les bords de la fenêtre. round() si ça gêne.

La fenêtre : au moins quatre fois le scrape_interval, sinon il n'y a pas assez de points pour une pente fiable. Avec 15 secondes de scrape, [1m] est le minimum, [5m] est la pratique, et dans Grafana on écrit $__rate_interval, qui calcule la bonne fenêtre selon le zoom. »`,

"Le taux d'erreur et le p95": `« Le ratio le plus écrit au monde : la somme des rate des 5xx divisée par la somme des rate de tout. Un piège vicieux : si aucune erreur 5xx n'a jamais été vue, le numérateur n'est pas zéro, il est vide, et une division par un vecteur vide renvoie... vide. Pas zéro. Une alerte qui compare à 5 % ne se déclenchera jamais, et un panneau Grafana affichera "No data" au lieu de 0 %. La parade : or vector(0).

Le p95 : rate sur chaque bucket de l'histogramme, sum en gardant le label le, et histogram_quantile par-dessus. Le by (le) est obligatoire : sans lui, la fonction n'a plus les tranches et renvoie NaN. C'est l'erreur numéro un de la série B, et je le dis avant.

Le p95 est borné par la précision des buckets : si vos buckets sont 100 ms et 250 ms, un p95 à 180 ms est une interpolation. D'où l'importance de bien choisir ses buckets à l'instrumentation. Les native histograms, stables depuis Prometheus 3.9, règlent ça avec des buckets exponentiels automatiques, un seul échantillon par série.

La latence moyenne, sum divisé par count : elle est vraie, et elle n'est jamais utile pour un SLO. Une moyenne à 200 ms peut cacher 5 % de clients à 3 secondes. »`,

"Dans le temps, entre séries": `« Les fonctions _over_time : les gauges dans le temps. max_over_time des paniers sur une heure, le pic. avg_over_time, min_over_time. Et predict_linear : une régression linéaire sur la fenêtre, projetée dans le futur. Le disque sera plein dans 24 h ? predict_linear(node_filesystem_avail_bytes[6h], 86400) inférieur à 0. C'est l'alerte disque intelligente, on l'écrit mercredi.

Les sous-requêtes : rate calculé toutes les minutes sur une heure, puis le max. Puissant, coûteux, avec parcimonie.

Les jointures : quand les labels diffèrent, on dit sur quoi apparier, on (instance), et de quel côté prendre les labels supplémentaires, group_left(version). L'usage classique : accrocher la version déployée, qui vit dans une info metric à 1, à n'importe quelle autre série. Dans Grafana, ça donne une colonne "version" dans une table.

label_replace : fabriquer un label à partir d'un autre avec une regex.

absent() : renvoie 1 si la série n'existe pas. C'est la seule façon d'alerter sur une disparition : une cible qu'on a oublié de configurer ne sera jamais up égale 0, elle n'existera simplement pas. »

Démo : histogram_quantile avec et sans by (le) ; la jointure en mode Table pour voir arriver le label version.`,

"Recording rules et requêtes lentes": `« Une recording rule : une requête coûteuse ou réutilisée partout, pré-calculée toutes les 15 secondes et stockée comme une nouvelle série. Le dashboard ne recalcule plus des histogrammes sur un an à chaque rafraîchissement, il lit une série. Convention de nommage : niveau, deux-points, métrique, deux-points, opération. job:http_requests:rate5m. On la lit "au niveau du job, les requêtes HTTP, en rate sur 5 minutes".

Trois bénéfices : dashboards instantanés, alertes simples à lire, et de l'agrégé prêt à envoyer au loin pour le long terme.

Ce qui rend une requête lente : le nombre de séries touchées fois le nombre de points par série. rate sur un an sans filtre, ce sont des milliards de points. Filtrer par job avant d'agréger, éviter les regex larges, les fenêtres courtes, les sous-requêtes avec parcimonie. Pour diagnostiquer : prometheus_engine_query_duration_seconds, le paramètre ?stats=all sur l'API, et le Query inspector de Grafana. »`,

"Série B — taux, quantiles, jointures (40 min)": `L'erreur numéro un : oublier by (le) en 2.15. Je le redis avant de lancer.

2.14 se fait avec ./lab.sh chaos errors on, et je vérifie que tout le monde remet off à la fin, sinon les dashboards de l'après-midi sont rouges et le TP 6 de demain commence avec une alerte déjà firing.

2.20, la jointure : je fais afficher le résultat en mode Table pour qu'ils voient le label version apparaître.

2.21 : absent sur un job qui n'existe pas. Puis absent sur un job qui existe : rien. C'est la subtilité.

Dans le déroulé Apicil, série réduite : 2.11, 2.14, 2.15, 2.17, 2.20, 2.21.`,

"TP 3 · Recording rules et tests unitaires": `« Mise en situation : les panneaux débit, erreurs, p95 et chiffre d'affaires par heure vont tourner sur un écran mural 24 h sur 24. On ne veut pas que Prometheus recalcule les histogrammes en permanence.

Partie 1 : sept règles dans recording.yml. Ratios entre 0 et 1, pas des pourcentages : la conversion, c'est le travail de Grafana. promtool check rules, reload, et vérifiez que les nouvelles séries apparaissent.

Partie 2 : promtool test rules. On écrit un fichier de test avec une série simulée, 0 plus 10 fois 40, c'est-à-dire un compteur qui monte de 10 à chaque intervalle, et on affirme ce que doit valoir job:http_requests:rate5m à la cinquième minute. Ça se met en CI. Une règle non testée sonnera un dimanche pour rien.

Partie 3, bonus : le Query inspector de Grafana, requête brute contre recording rule, le temps de réponse. »

20 minutes, ça déborde souvent sur 14h, c'est prévu.`,

"MODULE 9 · Grafana": `« Module 9, Grafana. Sous le capot, quatre concepts, et ce qui rend un tableau de bord lisible par quelqu'un qui n'est pas vous. »`,

"Grafana, sous le capot": `« Un serveur en Go, une base SQLite par défaut ou PostgreSQL en production. Il ne stocke que sa configuration : les utilisateurs, les sources de données, les dashboards en JSON, les règles d'alerte. Pas une seule métrique. Chaque fois que vous ouvrez un dashboard, Grafana envoie les requêtes PromQL à Prometheus et dessine la réponse.

Quatre concepts. Une data source : une connexion. La nôtre est provisionnée par YAML, personne ne l'a cliquée. Un panel : une requête, une visualisation, des options. Un panel répond à une question. Un dashboard : des panels, des variables, des annotations, des liens. Un dashboard répond à un besoin. Un dossier : range, et porte les droits.

Réflexe à prendre : Explore avant de construire. On ne fait jamais un panel à l'aveugle, on valide la requête dans Explore, puis on la met dans un panel. »`,

"Grafana 13 : dynamic dashboards": `Visite guidée de cinq minutes sur ma stack : Connections, Explore, New dashboard, un panel, Save, Exit edit, le cadenas du dashboard provisionné.

« Grafana 13, avril 2026, a refait l'édition des dashboards. La barre latérale Add : Panel, Add row, Add tab, Variable, Annotation query, Link. Deux modes de grille : Custom grid, où on place tout à la main, et Auto grid, qui range tout seul. Les rows et les tabs pour organiser. L'éditeur de variables refait. La restauration des dashboards supprimés. Git Sync passé en version communautaire. Et le plugin de rendu d'images retiré : les exports PNG passent maintenant par le navigateur ou par Grafana Cloud.

Ce qui n'a pas changé : un panel, c'est toujours une requête, une visualisation, des options. »`,

"L'éditeur de panel": `« L'éditeur de panel, de gauche à droite et de haut en bas : la visualisation au centre, les requêtes et les transformations en bas, et à droite, d'abord Suggestions, qui propose une visualisation adaptée aux données, puis All visualizations, puis toutes les options : titre, unités, seuils, légende, overrides.

Le réflexe : la requête d'abord, on vérifie qu'elle renvoie quelque chose, puis la visualisation, puis les options. Dans cet ordre. »`,

"Choisir la visualisation": `« Une visualisation par question, pas par envie.

Ça évolue comment ? Time series. Ça vaut combien, là, maintenant ? Stat, avec une sparkline pour la tendance. À quel niveau sur une échelle bornée, 0 à 100 % ? Gauge. Comparer quelques valeurs entre elles ? Bar gauge. Une liste à plusieurs colonnes ? Table. Une répartition, cinq parts maximum sinon c'est illisible ? Pie chart. Un état dans le temps, up, down, up ? State timeline ou Status history. Une distribution qui évolue, les latences ? Heatmap.

Onze types pratiqués pendant la formation. Ce qu'on ne fera pas : Logs et Traces, il faudrait Loki et Tempo ; Geomap, Node graph, il faudrait d'autres données. »`,

"Ce qui rend un dashboard lisible": `« Quatre règles, et je les applique dans les deux TP de l'après-midi.

Les unités. Jamais un 38491023 brut. bytes devient 36,7 MiB, percentunit devient 73 %, reqps, currencyEUR. Grafana convertit, le code n'a pas à le faire.

Seuils et couleurs, cohérents sur tout le dashboard. Vert, orange, rouge veulent dire la même chose partout. Visibles sur Stat, Gauge, Table, et même Time series.

Value mappings : 1 devient UP en vert, 0 devient DOWN en rouge. Un dashboard lisible par quelqu'un qui ne connaît pas Prometheus, un chef de service, le support.

Légende et ordre : {{route}} dans la légende plutôt qu'un bloc de labels. En haut du dashboard, "ça va ?" ; en bas, le détail. Dix à douze panels maximum : au-delà, personne ne les lit. Le dashboard communautaire 1860, avec ses cinquante panels, en est la démonstration. »`,

"Variables, transformations, annotations": `« Une variable, c'est un menu déroulant qui filtre tous les panels d'un coup. Une variable de type Query avec label_values(node_uname_info, instance) liste les instances. Multi-valeur avec All : dans les requêtes, on écrit alors instance égale tilde $instance, jamais égal, sinon "All" ne matche rien. Les variables se chaînent : $route dépend de $instance. Et les variables intégrées : $__rate_interval pour la fenêtre de rate, $__range pour la plage affichée.

Les transformations : Merge, Organize fields, Sort by, Reduce, Filter, des calculs. Indispensables pour les tables : on prend plusieurs requêtes, on les joint par un champ, on renomme les colonnes, on trie. Sans transformation, une table Grafana est illisible.

Les annotations : un trait vertical sur tous les graphiques quand quelque chose se passe. Un déploiement, une bascule chaos. Depuis une requête, changes(shop_chaos_mode[1m]) supérieur à 0, ou depuis la CI par un POST sur l'API. C'est ce qui permet de dire "la latence a monté à 14h32, et à 14h31 on a déployé". »`,

"TP 4 · Un dashboard paramétrable pour un serveur Linux": `Je projette le résultat attendu au début du TP et je le laisse visible. 55 à 60 minutes.

« Mise en situation : l'équipe d'exploitation veut un écran par serveur. D'un coup d'œil, savoir s'il va bien ; en dessous, le détail. Le même dashboard pour tous les serveurs, avec une liste déroulante.

Étape 0 : la variable $instance, multi-valeur avec All, utilisée dans toutes les requêtes avec égale tilde.

Étape 1 : la vue d'ensemble, cinq indicateurs. Uptime en Stat avec l'unité durée, CPU et mémoire en Gauge avec seuils, charge, nombre de cœurs. Le piège : diviser par count() sans scalar() : Prometheus refuse d'apparier un vecteur avec un vecteur sans labels communs.

Étape 2 : CPU empilé par mode, mémoire avec un override de couleur.

Étape 3 : disque en Bar gauge, une Table avec Join by field, Organize fields et Sort by, le réseau rx et tx.

Étape 4, optionnelle si le temps manque : State timeline avec value mappings, un Stat coloré avec or vector(0).

Le dashboard doit finir dans le dossier Formation : le TP 5 y fait un lien. »`,

"TP 4 — le résultat attendu": `« Voilà la cible. Douze panels, huit types de visualisation, une variable, des rows. Ça tient sur un écran sans scroller, et n'importe qui dans l'équipe sait en dix secondes si le serveur va bien. »

Je laisse cette slide projetée pendant tout le TP.`,

"TP 5 · La boutique, puis dashboards as code": `« Mise en situation : le directeur commercial veut le chiffre d'affaires, les commandes, les paniers, les stocks. La technique veut débit, erreurs et latence filtrables par instance et par route. Tout le monde veut voir quand on a cassé quelque chose.

Étape 0 : deux variables chaînées, instance et route.

Étape 1, métier : chiffre d'affaires par heure en Stat avec currencyEUR, commandes par minute, paniers, un pie chart des moyens de paiement, le stock en Bar gauge LCD avec un seuil à 15.

Étape 2, RED : débit empilé par route, taux d'erreur avec seuil rouge à 5 %, p50, p95, p99 sur le même graphique, et une heatmap des latences.

Étape 3, détail : une Table "top routes" colorée, un bar chart par code HTTP, la version déployée grâce à la jointure d'hier.

Étape 4 : les bascules chaos annotées, un lien vers le TP 4 et un vers Prometheus.

Étape 5 : Export as code. Model Classic, format JSON, pour le provisioning par fichier. Le fichier va dans grafana/dashboards, on redémarre Grafana, et le dashboard revient avec un cadenas : il vient d'un fichier, il vit dans Git, on ne l'édite plus à la souris. Le modèle V2 Resource sert à Git Sync et à la nouvelle API ; pour le provisioning classique, on reste en Classic. »

Dans le déroulé Apicil, ce TP est le palier 1 du TP final du jeudi.`,

"TP 5 — le résultat attendu": `« Métier en haut, RED au milieu, détail en bas, et les deux bascules chaos annotées en traits verticaux. C'est le dashboard que l'astreinte regarde. »

Projetée pendant le TP.`,

"MODULE 10 · Provisioning, utilisateurs, droits": `« Module 10 : tout en fichiers, un modèle de droits propre, et la question qu'on me pose à chaque session : est-ce qu'il faut acheter Enterprise ? »`,

"Le modèle de droits": `« L'organisation : un cloisonnement total. Une par client chez un hébergeur ; sinon, une seule. Ce n'est pas fait pour séparer des équipes, c'est fait pour séparer des entreprises.

Les utilisateurs : locaux, ou par OAuth, LDAP, SAML. Trois rôles par organisation : Admin, Editor, Viewer, plus None. Et le Server Admin, à part, qui administre l'instance.

Les teams et les dossiers : les droits vont aux teams, jamais aux personnes. View, Edit ou Admin, par dossier ou par dashboard. La bonne pratique : un dossier par équipe, une team par équipe, la team Editor sur son dossier, et les dashboards provisionnés en lecture seule dans un dossier Officiel.

Les service accounts : des comptes techniques avec un token, pour les scripts et la CI. Ils remplacent les API keys, retirées depuis Grafana 11. »

Les exercices 2.30 à 2.33 les font pratiquer : une utilisatrice Viewer, une team Editor sur son dossier, une organisation, un service account avec un curl.`,

"OSS, Enterprise, Cloud": `« Ma réponse honnête : 90 % des entreprises n'ont pas besoin d'Enterprise.

Ce que la version open source, sous licence AGPL, fait : dashboards, alerting, Explore, provisioning, Git Sync, toutes les sources de données open source, OAuth, LDAP, proxy, les rôles fixes et les permissions par dossier.

Ce qu'Enterprise ajoute : les connecteurs commerciaux, Splunk, Datadog, ServiceNow, Oracle, SAP ; SAML et SCIM, la synchronisation des teams avec l'annuaire ; un RBAC fin, des permissions par source de données ; les rapports PDF, le white-label, l'audit, le cache de requêtes ; et un support avec contrat. La licence se paie par utilisateur actif, ou à l'usage en Cloud.

On y va pour trois raisons : SAML et SCIM parce que la DSI l'exige, un connecteur commercial, ou les rapports PDF pour la direction. Pas pour les dashboards. »`,

"Exercices 2.30 à 2.33 — droits (20 min)": `Vingt minutes, en autonomie, dans Grafana.

2.30 : créez une utilisatrice avec le rôle Viewer, connectez-vous avec, et listez ce qu'elle peut et ne peut pas faire. Pas d'édition, pas d'Explore par défaut.

2.31 : un dossier Boutique, une team, des permissions Edit sur ce dossier seulement, et vérifiez qu'un membre de la team ne peut pas éditer le dossier Formation.

2.32 : une organisation : que voit-on dedans ? Rien. Pas de source de données, pas de dashboard. C'est un cloisonnement total.

2.33, bonus : un service account, un token, et un curl qui crée une annotation par l'API. C'est ce que ferait une CI après un déploiement.

Dans le déroulé Apicil, ces exercices sont en autonomie : le module est exposé seulement.`,

"Récap du jour 2": `Quiz à l'oral, cinq minutes.

« rate() sur un counter, jamais brut, fenêtre d'au moins quatre scrapes. histogram_quantile a besoin de by (le). $__rate_interval partout dans Grafana, égale tilde pour les variables multi-valeurs. Unités, seuils, value mappings : un dashboard lisible par le chef de service. Join by field, Organize, Sort : la table. Un dashboard vit dans Git, provisionné, avec un uid fixe. Les droits par team et par dossier.

Ce soir : recording.yml en place, TP 4 et TP 5 sauvegardés dans le dossier Formation, le fichier tp5-boutique.json provisionné. Les alertes de demain s'appuient dessus. »`,

"JOUR 3 · Réagir": `« Jour 3 : réagir. Ce matin, des alertes qui ne réveillent que pour de bonnes raisons, et le routage vers Teams, Slack, une boîte de réception. Cet après-midi, l'alerting Grafana, l'exploitation, Thanos, et le war game. »`,

"Exercice 3.0 — Brancher l'Alertmanager (10 min)": `« Depuis le jour 1, Prometheus évalue une règle d'alerte, TargetDown, dans rules/alerts.yml. Mais il n'a personne à qui l'envoyer. On ajoute la brique.

Décommentez compose/06-alerting.yml, lisez-le : deux services, l'Alertmanager et l'Inbox, une petite application du dépôt qui joue Teams, Slack et PagerDuty pour qu'on voie les notifications sans tenant. ./lab.sh up. Puis dans prometheus.yml, décommentez le bloc alerting, validez, rechargez. Status, Alertmanager discovery : une cible active. Et ouvrez alertmanager.yml : un seul receiver, vers l'Inbox. C'est lui qu'on enrichit au TP 6. »

Ce que je vérifie : la page Alertmanager discovery chez tout le monde. Ceux qui ont oublié le reload voient la page vide. Sans le bloc alerting, une alerte passe firing dans Prometheus et ne va nulle part : prometheus_notifications_sent_total reste à zéro.`,

"MODULE 11 · Philosophie de l'alerting": `« Avant d'écrire une seule règle, une demi-heure sur ce qui mérite une alerte. Parce qu'une alerte mal pensée coûte plus cher qu'une absence d'alerte : elle use les gens. »`,

"Mauvaise alerte, bonne alerte": `« La règle de Google SRE : on alerte sur les symptômes, pas sur les causes. "CPU à 90 %" est une cause possible d'un problème, ou le signe que le serveur fait son travail. "Les clients attendent plus de 3 secondes", "5 % des paiements échouent" : ce sont des symptômes. Quelqu'un souffre, il faut agir.

Corollaire : une alerte doit être actionnable. Si la réponse à "qu'est-ce que je fais quand ça sonne ?" est "rien, je regarde", ce n'est pas une alerte, c'est un panel de dashboard.

Trois niveaux, pas plus. critical : on réveille quelqu'un. warning : on regarde demain matin. info : un ticket, un tableau de bord. La sévérité est un label, on routera dessus. »`,

"[statement] 400 notifications par jour.": `Anecdote, je la raconte.

« Une équipe d'astreinte recevait 400 notifications par jour. Disques à 80 %, CPU à 85 %, un ping raté, un job en retard de deux minutes. Au bout d'un mois, plus personne ne les lisait ; le téléphone était en silencieux. La nuit où la base de données est tombée pour de bon, l'alerte est passée avec les 399 autres, et le site est resté hors ligne quatre heures.

Après nettoyage : 12 alertes. Toutes sur des symptômes clients, chacune avec un runbook, une sévérité et un responsable. Le téléphone a repris du volume. La fatigue d'alerte tue plus de systèmes que les pannes. »`,

"Anatomie d'une règle": `« Une règle, ligne par ligne.

alert : le nom, en CamelCase, unique. expr : l'expression PromQL. L'alerte se déclenche quand l'expression renvoie au moins une série. Et elle se déclenche par série renvoyée : avec by (instance), deux instances en erreur, c'est deux alertes ; sans by, une seule alerte globale. C'est un choix, pas un accident.

for : la condition doit être vraie pendant deux minutes avant de passer firing. Ça évite les alertes sur un pic d'une seconde. keep_firing_for : elle reste firing trois minutes après le retour à la normale, ce qui évite le clignotement quand la valeur oscille autour du seuil.

Les labels servent à router et à grouper, l'Alertmanager les lit. Les annotations servent aux humains : un summary court, une description avec la valeur, formatée avec les templates Go, $labels, $value, humanizePercentage, humanizeDuration. Et runbook_url : ce n'est pas un mot-clé, c'est une convention, reprise par Alertmanager et Grafana dans leurs messages.

Tester : promtool check rules, puis promtool test rules avec des séries simulées, comme au TP 3. Et en conditions réelles avec le chaos. »`,

"Le cycle de vie d'une alerte": `Je suis le schéma.

« inactive : l'expression ne renvoie rien. pending : elle renvoie des séries, mais for n'est pas écoulé. firing : for est écoulé, Prometheus envoie l'alerte à l'Alertmanager, et la renvoie toutes les minutes tant qu'elle est active. Retour : plus de séries, on attend keep_firing_for, puis resolved.

Puis, côté Alertmanager, trois délais de plus. group_wait, 30 secondes : on attend un peu avant la première notification d'un groupe, pour rassembler les alertes qui arrivent ensemble. group_interval, 5 minutes : avant d'envoyer les nouveautés d'un groupe déjà notifié. repeat_interval, 4 heures : si l'alerte est toujours active, on le redit.

Chaque paramètre a un coût en réactivité, et ils s'additionnent : la fenêtre de rate, plus for, plus group_wait avant la première notification ; la fenêtre, plus keep_firing_for, plus group_interval avant le resolved. Au TP 6, on chronomètre tout ça avec le chaos. »`,

"MODULE 12 · Alertmanager": `« Prometheus évalue et envoie ; l'Alertmanager décide qui prévenir, quand, et combien de fois. »`,

"L'arbre de routage": `Démo : localhost:9093, amtool config routes show pour l'arbre en ASCII, amtool config routes test severity=critical pour "vers quel receiver ?".

« Son rôle : il déduplique, deux Prometheus en haute disponibilité envoient la même alerte, une seule notification. Il regroupe : cinquante instances down, c'est une notification, pas cinquante. Il route : critical vers l'astreinte, boutique vers le canal boutique. Il inhibe : si la base de données est down, inutile de dire que les services qui en dépendent sont lents. Il respecte les silences et les plages horaires.

L'arbre : la racine reçoit tout. Chaque route enfant a des matchers sur les labels, un receiver, et trois réglages de temps. La première route qui matche gagne, sauf si elle dit continue: true, auquel cas on continue à évaluer les suivantes. C'est comme ça qu'une alerte critical de la boutique part à la fois à l'astreinte et dans le canal boutique.

L'inhibition : une règle source, une règle cible, et equal, les labels qui doivent être identiques. TargetDown sur une instance inhibe les erreurs et la latence sur la même instance. »`,

"L'arbre de routage, en image": `« En image : la racine, trois branches, trois destinations. critical vers Teams, avec continue pour que la boutique reçoive aussi. team égale boutique vers Slack. team égale infra vers l'Inbox, avec un mute le week-end. C'est exactement l'arbre qu'on construit au TP 6. Et le post-it résume les trois autres fonctions : regroupement, inhibition, silences. »`,

"Alertmanager en action": `Démo en direct : j'arrête shop-api-2 sur ma stack. Dans Prometheus, Alerts : pending, puis firing au bout d'une minute. Dans l'Alertmanager : l'alerte groupée par receiver. Dans l'Inbox : la notification. Je redémarre : resolved.

« Voilà le cycle complet, en vrai. Retenez le temps que ça a pris : c'est ce qu'on va mesurer au TP 6. »

L'interface : les alertes actives, les groupes, le bouton Silence, Status avec la configuration chargée.`,

"TP 6 · Alertes Prometheus et routage Alertmanager": `55 minutes, cinq parties.

« Mise en situation : l'équipe boutique veut être prévenue dans son canal quand le site souffre. L'astreinte veut recevoir uniquement le critique, tout de suite. L'infra ne veut rien recevoir le week-end sauf le critique. Et personne ne veut recevoir "erreurs sur shop-api-2" quand shop-api-2 est éteint.

Partie 1 : cinq alertes. ShopHighErrorRate, ShopCheckoutSlow, ShopNoOrders avec un and, aucune commande alors qu'il y a du trafic, sinon elle sonnerait la nuit quand il n'y a simplement personne, ShopStockLow, BlackboxProbeFailed. ./lab.sh test doit toujours passer.

Partie 2 : casser et chronométrer. chaos errors on : au bout de combien de temps pending, firing, la notification ? Puis off : combien de temps avant resolved ? Expliquez chaque délai. Total, huit à dix minutes, et chaque paramètre y contribue.

Partie 3 : l'arbre, quatre receivers, quatre routes, continue, amtool routes test.

Partie 4 : l'inhibition. Partie 5 : un silence par l'interface et par amtool, et un time_interval nuit et week-end. Piège garanti : un intervalle de 20h à 8h est refusé, il faut le couper à minuit, deux intervalles. Même règle dans Grafana cet après-midi. »

Dans le déroulé Apicil, seules les parties 1 à 3, réduites ; les parties 3 à 5 complètes sont le palier 2 du TP final.`,

"MODULE 13 · Notifications tierces et ChatOps": `« Module 13 : où vont les notifications. Slack, PagerDuty, Teams, et pourquoi Teams est un sujet en soi en 2026. »`,

"Slack et PagerDuty": `« Slack : soit un incoming webhook, une URL secrète par canal, soit une application avec un token. Dans l'Alertmanager, slack_configs avec api_url_file : le secret dans un fichier monté, jamais dans le YAML commité. Le canal, le titre, le texte sont templatables.

PagerDuty : l'Events API v2, une integration key par service. routing_key_file, une sévérité, une description. L'escalade, les plannings, l'acquittement se font côté PagerDuty. Le trigger et le resolve utilisent la même clé de déduplication : quand l'alerte se résout, l'incident PagerDuty se ferme tout seul.

Le principe est le même partout : un receiver, un secret dans un fichier, des champs templatables. »`,

"Microsoft Teams, la méthode 2026": `Le pas à pas complet est en annexe E du guide. Si j'ai un tenant de démo, je crée le flux en direct ; sinon l'Inbox du lab l'imite.

« Les connecteurs Office 365, la méthode historique, sont morts : création bloquée depuis 2024, coupure définitive en mai 2026. msteams_configs dans l'Alertmanager est déprécié. Si vous avez encore un connecteur qui marche chez vous, il ne marchera plus longtemps.

La méthode 2026 : Workflows, c'est-à-dire Power Automate intégré à Teams. Dans le canal, les trois points, Workflows, "Publier dans un canal lorsqu'une demande de webhook est reçue". On copie l'URL, elle n'est affichée qu'une fois.

Côté Alertmanager : msteamsv2_configs avec webhook_url_file. Côté Grafana : le contact point Microsoft Teams, champ URL. La carte adaptative est générée toute seule.

Les pièges : canal privé, il faut passer le flux en "Post as User" dans Power Automate. Rien n'arrive ? L'historique d'exécution du flux dans Power Automate dit pourquoi. Et un flux appartient à un utilisateur : quand il quitte l'entreprise, le flux meurt avec lui. Prévoir un compte de service. »`,

"GitHub et templates": `« ChatOps avec GitHub : une alerte qui ouvre une issue, la commente à chaque répétition, et la ferme quand c'est résolu. Mécanique : un webhook de l'Alertmanager vers l'API GitHub, un repository_dispatch, un workflow Actions qui fait le travail. Le fichier est dans le dépôt, .github/workflows/alert-to-issue.yml. Côté Grafana, un contact point Webhook avec un payload personnalisé et un en-tête Authorization.

Les templates Alertmanager : des templates Go, dans des fichiers .tmpl chargés par templates. On définit formation.title et formation.text, et on les appelle dans un receiver. Les variables : .Status, .Alerts, .CommonLabels, .CommonAnnotations. Un bon message : le statut, le résumé, la sévérité, l'instance, le lien vers le runbook, le lien vers le dashboard. Pas un dump de tous les labels : personne ne lit un dump à 3h du matin. C'est le TP 7, partie 4. »`,

"TP 7 · Cas pratique : alerte CPU élevé → Teams": `45 minutes. Pour tester sans attendre le chaos : un POST sur /api/v2/alerts de l'Alertmanager injecte une alerte à la main.

« Mise en situation : l'équipe infra veut être prévenue dans son canal Teams quand un serveur dépasse 80 % de CPU pendant plus de deux minutes, avec un message lisible : le serveur, la valeur, un lien vers le dashboard.

Partie 1 : la règle HostHighCpuLoad, rate sur 2 minutes, for 2 minutes, la valeur formatée avec printf. Un test unitaire avec une série idle constante.

Partie 2 : le routage. Une route alertname égale HostHighCpuLoad vers astreinte-teams, placée avant team égale infra, sinon c'est la route infra qui gagne. Vraie URL Workflows si vous en avez une, sinon l'Inbox.

Partie 3 : ./lab.sh chaos cpu 300. Chronomètre. Ouvrez la carte : qu'est-ce qui manque ?

Partie 4 : les templates formation.title et formation.text, le lien vers le dashboard du TP 4 avec var-instance dans l'URL, et amtool template render pour tester sans attendre une alerte. »`,

"MODULE 14 · Alerting Grafana": `« Module 14 : l'alerting de Grafana. Les mêmes concepts sous d'autres noms, et la vraie question : quand utiliser l'un ou l'autre. »`,

"Alertmanager ↔ Grafana": `« Le tableau de correspondance, et c'est tout ce qu'il y a à apprendre.

Un receiver devient un contact point. Une route devient une notification policy. Un silence reste un silence. Un time_interval devient un mute timing. Un template devient un notification template, dans le même langage Go. Et la règle : une alert rule avec une pending period, le for, et keep firing for ; la différence, c'est que la condition se construit en trois étapes, une requête, un Reduce, un Threshold, plutôt qu'en une expression.

Deux modes : Grafana-managed, évalué par Grafana, ce qu'on fait ; et Data source-managed, où la règle est écrite dans Mimir ou Loki. On reste sur Grafana-managed. »`,

"Quand utiliser quoi": `« Prometheus plus Alertmanager : pour les alertes pures métriques. Versionnées dans Git, testées avec promtool, évaluées là où sont les données, sans dépendre de Grafana. Si Grafana tombe, les alertes continuent. La haute disponibilité est triviale.

L'alerting Grafana : quand la condition mélange plusieurs sources, un log Loki et une métrique. Pour les alertes sur SQL. Pour les équipes qui vivent dans Grafana et n'ouvriront jamais un YAML. Et pour le lien direct entre une règle et un panel : la notification arrive avec le graphique.

Les deux coexistent très bien. Ce qu'il ne faut pas faire : dupliquer la même alerte des deux côtés. Deux notifications, deux vérités, et un jour l'une des deux est fausse. »`,

"Une règle Grafana 13": `« Le formulaire en six étapes : le nom ; la requête et la condition, WHEN QUERY IS ABOVE ; le dossier et les labels ; l'évaluation, le groupe et la pending period ; les notifications, contact point ou politique ; et le message, avec les annotations. L'ordre est celui du formulaire, on le suit au TP 8. »`,

"TP 8 · Alerting Grafana, de l'interface au code": `45 minutes. Un fichier de provisioning invalide empêche Grafana de démarrer : docker compose logs grafana dit pourquoi.

« Partie 1 : deux contact points, inbox-grafana en Webhook et teams-astreinte en Microsoft Teams. Le bouton Test.

Partie 2 : les politiques. La racine vers l'Inbox ; severity égale critical vers Teams, avec un group wait de 10 secondes.

Partie 3 : une règle multi-dimensionnelle dans l'interface : le taux d'erreur par instance, en Instant, WHEN A IS ABOVE 5, pending 2 minutes, et le lien vers le dashboard et le panel.

Partie 4 : tout en code. Export YAML de la règle et des contact points, formation.yml dans provisioning/alerting, restart, et le cadenas apparaît. L'intervalle nuit se coupe à minuit, en deux morceaux, comme dans l'Alertmanager. »

Dans le déroulé Apicil, parties 1 à 3 le jeudi matin, partie 4 dans le palier 3 du TP final.`,

"MODULE 15 · Performances, limites, bonnes pratiques": `« Module 15 : dimensionner, diagnostiquer un Prometheus qui souffre, et déployer proprement. »`,

"Ce qui coûte": `« Trois choses coûtent.

Les séries actives coûtent de la mémoire : 2 à 4 Ko par série dans le head. Un Prometheus tient un à deux millions de séries confortablement sur une machine normale. Au-delà, on découpe.

Les échantillons coûtent du CPU et du disque : 1 à 2 octets chacun grâce à la compression. Un million de séries à 15 secondes, c'est 8,5 Go par jour.

Les requêtes coûtent en proportion des séries touchées fois les points. rate sur un an sans filtre, ce sont des milliards de points.

Le second tueur, après la cardinalité : le churn. Des séries qui changent de labels sans arrêt, des pods qui redémarrent, un label avec un timestamp dedans. Chaque nouvelle combinaison est une nouvelle série, et l'ancienne reste en mémoire deux heures. »`,

"Diagnostiquer et limiter": `« Diagnostiquer : la page Status, TSDB status, donne les dix métriques et les dix labels les plus lourds. C'est le premier endroit où aller. Puis les métriques de Prometheus sur lui-même : prometheus_tsdb_head_series, samples_appended_total, process_resident_memory_bytes, scrape_duration_seconds pour trouver la cible lente, prometheus_engine_query_duration_seconds pour la requête lente. promtool tsdb analyze sur un bloc pour l'analyse fine.

Limiter la casse : sample_limit et label_limit par job. Si une cible dépasse, le scrape est refusé en entier et up passe à 0 : brutal, mais Prometheus survit. metric_relabel_configs pour jeter ce qu'on n'utilise pas. --query.max-samples et --query.timeout pour qu'une requête folle ne mette pas tout le monde à genoux. Des recording rules pour tout ce qui est affiché en boucle. Et pas d'auto-refresh à 5 secondes sur un dashboard qui affiche 24 heures. »`,

"Déployer proprement": `« Sécurité : pas d'authentification par défaut. Soit web.config.file, TLS et basic auth avec un hash bcrypt, soit un reverse proxy avec le SSO de l'entreprise. Les secrets dans des fichiers _file, jamais dans le YAML.

Haute disponibilité : deux Prometheus identiques qui scrapent les mêmes cibles, distingués par un external_label replica, et un Alertmanager en cluster qui déduplique. Grafana sur PostgreSQL derrière un load balancer. C'est exactement ce qu'on monte au TP 10 avec Thanos.

Mode agent : --agent. Prometheus scrape et envoie en remote write, sans stocker ni répondre aux requêtes. Pour les sites distants, l'edge. Grafana Alloy fait pareil, et les logs, les traces, l'OTLP en plus.

Conventions : le nommage, les labels env, team, service partout, un runbook par alerte, les tests de règles en CI, et tout provisionné. Un git clone doit suffire à reconstruire la surveillance. »`,

"Exercices 3.1 à 3.5 — diagnostic (10 min)": `Dix minutes, dans Prometheus.

3.1 : combien de séries actives ? Quelle métrique en a le plus ? Quel label a le plus de valeurs ? TSDB status et prometheus_tsdb_head_series. Chez nous, environ 4 000 séries, et ce sont les buckets d'histogramme qui dominent.

3.2 : échantillons par seconde, mémoire de Prometheus.

3.3 : le job le plus cher en séries, le plus lent en scrape_duration_seconds.

3.4 : mettez sample_limit: 100 sur le job redis. Que devient up ? 0. Le scrape est refusé en entier. Retirez-le.

3.5 : ?stats=all sur l'API, requête brute contre recording rule, les compteurs de samples.`,

"TP 9 · Sauvegarde, restauration, sécurité": `30 minutes.

« Mise en situation : un audit demande : si le serveur de monitoring brûle, en combien de temps le remettez-vous ? Et qui peut lire vos métriques ? La troisième question de l'audit, 13 mois d'historique, c'est le TP 10.

Partie 1 : ./lab.sh snapshot, qui appelle l'API admin. Un snapshot, c'est un dossier avec des liens durs vers les blocs existants plus une copie du head : quasi instantané, et ça ne coûte que le head en espace. Puis la catastrophe simulée : on efface les données, on restaure depuis le snapshot, on redémarre. Qu'a-t-on perdu ? Ce qui a été ingéré entre le snapshot et la restauration. Ne jamais copier data/ à chaud sans snapshot : le WAL bouge.

Partie 2 : Grafana. grafana.db, et un script qui exporte tous les dashboards par l'API. Puis la question : qu'est-ce qui n'est pas dans les JSON ? Les utilisateurs, les teams, les sources de données et leurs secrets, l'alerting. D'où la vraie réponse : tout est provisionné, et la sauvegarde, c'est Git.

Partie 3 : un mot de passe sur Prometheus. web.yml avec un hash bcrypt, le flag dans la brique 01. Qu'est-ce qui casse ? Grafana, le reload, et le sidecar Thanos si on le laissait. Leçon : la sécurité se fait au début, pas à la fin. On retire l'option à la fin du TP. »`,

"MODULE 16 · Mise à l'échelle et écosystème": `« Module 16, court : quand un Prometheus ne suffit plus, et ce qu'il y a autour. Dix minutes, parce que la suite est un TP. »`,

"Les options, dans l'ordre": `« Dans cet ordre, et pas autrement : agrandir avant d'avoir réduit, c'est payer plus cher le même problème.

Un, réduire : la cardinalité, le drop, les recording rules. La plupart des Prometheus qui souffrent ont dix métriques inutiles qui pèsent la moitié des séries.

Deux, sharder : un Prometheus par équipe, par cluster, par type. Simple, robuste, mais des vues séparées.

Trois, fédérer : un Prometheus central qui scrape /federate des régionaux, sur des recording rules agrégées. Ancien, limité, suffisant pour une vue globale légère.

Quatre, longue durée : Thanos, qui complète les Prometheus avec un sidecar et un stockage objet ; Mimir et VictoriaMetrics, qui les remplacent comme stockage via remote write. Les trois exposent l'API Prometheus : Grafana ne voit pas la différence.

Cinq, managé : Grafana Cloud, Amazon, Google, Azure. Quand on ne veut pas opérer.

Les signaux : des OOM et des compactions sans fin, c'est trop de séries. Plus de 30 à 60 jours de rétention demandés, c'est la longue durée. Plusieurs sites, c'est la vue globale. Une HA "vraie", c'est deux Prometheus plus la déduplication. »`,

"Thanos : ce qu'on monte dans cinquante minutes": `« Voilà ce qu'on va construire.

À gauche, deux sites, deux Prometheus, chacun avec son sidecar. Le sidecar fait deux choses : il sert la TSDB du Prometheus au Querier par gRPC, et il envoie chaque bloc terminé dans un stockage objet.

Au milieu, le stockage objet : S3, GCS, Azure en production ; dans le lab, un simple dossier partagé, et le fichier de configuration est le même à un mot près.

Le Store Gateway relit les blocs du bucket et les sert comme un sidecar. Le Querier interroge tout le monde, sidecars et store, fusionne, et déduplique les réplicas : deux Prometheus qui scrapent la même chose, un seul résultat. Grafana ne voit qu'une source de données de plus.

Le Compactor fusionne les blocs, applique la rétention, et calcule des résolutions dégradées, 5 minutes et 1 heure, pour que treize mois se lisent en une seconde. Un seul compactor par bucket, jamais deux.

La clé de tout ça : les external_labels de chaque Prometheus. Ils identifient l'origine des blocs, et replica est le label que le Querier ignore pour dédupliquer. »`,

"TP 10 · Thanos : historique long et vue globale": `50 minutes, cinq parties. Le piège : oublier les flags block-duration ; sans eux le sidecar refuse de démarrer, il exige que min et max soient égaux, et docker compose logs thanos-sidecar-a le dit en clair.

« Mise en situation : la boutique ouvre un second site. Chaque site a son Prometheus, rétention 15 jours. L'audit veut 13 mois d'historique et une vue globale, sans toucher aux Prometheus existants.

Partie 1 : lisez compose/07-thanos.yml, qui parle à qui, quel volume est partagé par qui. Une seule modification sur le Prometheus existant, et elle est obligatoire : un sidecar exige que la compaction locale soit désactivée, min-block-duration égal à max-block-duration. En production 2 heures ; dans le lab 10 minutes, pour voir les envois pendant le TP. Brique 07, ./lab.sh up, notez l'heure.

Partie 2 : le Querier sur le port 10902. La page Stores. up sur shop-api avec déduplication, deux séries ; sans, quatre, chacune avec son replica. Arrêtez prometheus-b : le Querier sert quand même. C'est la HA selon Thanos.

Partie 3 : la datasource Thanos dans Grafana, type Prometheus, Prometheus type Thanos. Le dashboard TP 5 dessus. Pourquoi cluster reste et replica disparaît : cluster distingue des données différentes, replica distingue deux copies de la même.

Partie 4, quinze minutes après le lancement : ls /bucket, le meta.json d'un bloc, le Store Gateway qui annonce sa fenêtre, les logs du compactor, les rétentions.

Partie 5 : ranger, recommenter la brique et les flags, ./lab.sh up. Le war game se joue sur la stack du matin. »

Dans le déroulé Apicil, les parties 1 et 2 sont l'étape bonus du TP final.`,

"Et autour": `« Trois mots sur la suite.

OpenTelemetry : le standard d'instrumentation des trois signaux. Prometheus 3 reçoit l'OTLP nativement, avec des noms à points et de l'UTF-8. Le Collector, ou Grafana Alloy, scrape, reçoit, envoie. En 2026, instrumenter en OpenTelemetry et stocker dans Prometheus ou Mimir est la combinaison la plus courante pour du neuf.

Loki et Tempo : les mêmes idées appliquées aux logs et aux traces. Grafana les corrèle : d'un pic de latence sur une courbe, vers les traces avec les exemplars, vers les logs, en trois clics. C'est la suite logique de cette formation.

Kubernetes : kube-prometheus-stack. L'opérateur, les ServiceMonitor, les PrometheusRule, kube-state-metrics, le Node Exporter, Grafana avec des dizaines de dashboards, le tout en un helm install. Tout ce qu'on a vu s'applique ; la découverte de services fait le reste. »`,

"WAR GAME · Diagnostiquer en moins de cinq minutes": `Je casse une seule instance, jamais les deux : latence sur shop-api-2 seulement, CPU depuis shop-api-1, ou docker compose stop redis-exporter. Les commandes sont dans le guide. Si chacun a sa stack en Codespaces, je donne la commande à l'un des deux du binôme, l'autre diagnostique.

« Vous ne touchez plus à la configuration. Je casse la boutique d'une façon que vous ne connaissez pas. Vous avez Grafana, Prometheus, l'Alertmanager, l'Inbox. En moins de cinq minutes, par écrit : quoi, où, depuis quand, quelle alerte a sonné et laquelle aurait dû, et la première action. »

Débrief : qui a trouvé quoi, avec quel outil, et surtout ce qui manquait. Presque toujours : une alerte sur redis_up, un panneau par instance, un lien du dashboard vers les logs. Variante pour un groupe fort : ils écrivent l'alerte manquante avant de partir.`,

"Lundi matin": `« Ce que je vous conseille de faire lundi : choisissez un service chez vous. Un seul. Instrumentez-le en RED, un dashboard, deux alertes symptômes, un runbook. Pas plus. Le reste viendra, et il viendra parce que ce premier service aura montré ce que ça change.

Vous emportez le dépôt, votre stack, les trois guides, les liens. Les corrigés sont projetés, pas distribués : c'est volontaire, refaites-les.

Merci pour ces trois jours. Le questionnaire d'évaluation, puis je reste pour vos questions. »

Questionnaire de fin, annexe A, correction à l'oral tout de suite. Rappel du questionnaire de satisfaction Sparks.`,

};
