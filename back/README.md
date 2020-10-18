# installation
`npm i`

+ Veillez à modifier le fichier conf.json pour que l'application puisse prendre en compte votre environnement

# Lancement
`npm start`

# Attention
## ne pas modifier le fichier db.json au cas où

# Nouveautés 18 Mai 2020

- utils/security.js :
	+ Permet de gérer les fonctions de sécurité :
		+ tokenApplication => permet de gérer le token applicative, token_api, permet l'accès et l'utilisation de l'entierté du serveur.
		+ administrateur => permet de gérer le token utilisateur, token_user,
		permet l'accès et l'utilisation des modules d'administration du serveur.
- domain/security.js :
  + Permet de séparer les requetes utilisé que pour la securité

- conf.json :
	+ url_base_admin => permet de modulé l'url base pour la fonction utils.security.administrateur();
	+ token_api => permet de changer le token api de l'appli ( pourrait être géré dans une bdd à voir si on fait ça, ça jouterai de la securité avec une date d'expiration )

- JSONable :
	+ loadUnic : permet de récupérer un seul objet de la classe demandé ssi il n'y a qu'un résultat pour la requete.


# Nouveautés 4 Avril  2020

- Infrastructure :
	+ Refonte totale du système de communication avec la DB
		+ Mise en place d'un "cache" pour garder les données en mémoire
		+ Asynchronisation des requetes
		+ "Interfaçage" pour simplifier l'utilisation
		+ Mise en place d'un gestionnaire de constante de requete ( ajoutez les requetes dedans : constantRequest.js )
	Si problème me contacter c'est assez compliqué même si ça parait simple

- Domain :
	+ Mise en place d'une Interface pour simplifier la manipulation sur l'infrastructure
	+ ( Un peu en mode hibernate )
	+ Je vous recommande d'allez voir les classes pour comprendre
		+ Si problème sur l'interface me contacter JSONable.js
- Presentation :
	+ Mise en place de vrais systeme de route avec decoupe des routes dans des fichiers JS
	+ Decoupe par degrés d'url : /api => /trash => fonctionalité
	+ Un systeme de routage sur index.js

- Utils :
	+ Mise en place d'une gestion de constante
	+ Mise en place d'un propertyReader très basique
- Resources :
	+ Mise en place du fichier de configuration
	+ Mise en place d'un fichier de cache "db.json" ( il est préférable de ne pas le modifier même si j'ai fais en sorte qu'il n'y ait aucun problème en cas de modification de ce fichier )

- Root :
	+Il n'est plus nécessaire de modifier home.js ( il faudra modifier dans presentation/index.js )
	+Mise en place d'une centralisation des import ( require ) dans un fichier à la racine : import.js

- Test :
	+ Rien a été fait et c'est vraiment pas bien de ma part ( j'ai supprimé les anciens test obsoléte )
	+ TODO test des composant sauf infrastructure ( à cause de la bdd et l'asynchronisation c'est relou )
