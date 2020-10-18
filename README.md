# Initialisation du projet

WS :
* Cloner le repertoire
* Descendre les dépendances `$ npm update`
* Lancer le serveur : `$ node server.js`
* Lancer les tests : `$ npm run test`

# Test de communication entre BDD, Back, Front
### Démarrer le back
Dans la base de données, créer une base de données "trasho". Puis exécuter lui le code suivant :  
```
create table test(
	texte varchar not null
);

insert into test values ('Hello');
```
Dans le dossier back :
* Installer les dépendances : `npm install`
* Dans le fichier home.js modifier le morceaux de code ci-dessous par vos information de connection
```
const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'trasho',
  password: 'anthony',
  port: 5432,
})
```
* Démarrer le back : `node home.js`

### Démarrer le front
* Installer expo qui est un formidable outil pour le développement en REACT : `npm install -g expo-cli`  
* Dans le dossier front :
  * Installer les dépendances : `npm install`
  * Démarrer le front : `npm start`

# Script pour la base de données
Dans le dossier **BDD** se trouve un script pour la création de l'environnement de développement.  
Le fichier **script_creation.sql** permet la création de l'ensemble des tables avec leurs contraintes

# Anomalies

### En cas de difficultés pour faire fonctionner expo avec le projet, suivre les étapes suivantes :

* npm install dans le dossier expoMap
* Si ça ne marche pas et qu'il y a une erreur avec expo -> npm install -g expo-cli
* Changer le fichier ExpoMap -> node-modules -> metro-config -> src -> defaults -> blacklist.js par celui qui corrige le problème de syntaxe
* Dans expoMap taper la commande (si erreur sur les versions de map) : expo install react-native-maps@0.24.0 (vérifier la version demandée)
