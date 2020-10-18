'use-strict';
/* Import from module */
const imp = require('../import.js');

const domain = imp.domain();
const property = imp.prop();
const poubelle = imp.routePoubelle();
const signalement = imp.routeSignalement();
const utilisateur = imp.routeUtilisateur();
const type = imp.routeType();

module.exports = (app) => {
  app.use(property.url_poubelle , poubelle);
  app.use(property.url_utilisateur , utilisateur);
  app.use(property.url_signalement , signalement);
  app.use(property.url_type, type);
}

module.exports.init = function (){
  console.log("Server runs on port ",property.server_port);
  return 0;
};
