'user strict'

module.exports = {
  fs : () => require("fs"),
  pg : () => require('pg'),
  cors : () => require('cors'),
  express    : () => require("express"),
  bodyParser : () => require("body-parser"),
  router : () => require('express-promise-router'),
  nodemailer: () => require('nodemailer'),
  uuid : () => require("uuid"),

  prop : () => require('./utils/propertyReader'),
  cst   : () => require('./utils/constantes'),
  sendConfirmMail: () => require('./utils/sendConfirmMail'),

  route : () => require('./presentation'),
  routePoubelle : () => require('./presentation/poubelle'),
  routeSignalement : () => require('./presentation/signalement'),
  routeUtilisateur : () => require('./presentation/utilisateur'),
  routeType : () => require('./presentation/type'),

  db  : () => require('./infrastructure'),
  qry : () => require('./infrastructure/constantRequest'),

  domain : () => require('./domain'),
  poubelle : () => require('./domain/poubelle'),
  utilisateur : () => require('./domain/utilisateur'),
  signalement : () => require('./domain/signalement'),
  type : () => require('./domain/type'),
  jsonable : () => require('./domain/JSONable'),
  domainSecurity : () => require('./domain/security.js'),

  security : () => require('./utils/security.js'),

  serverError: () => require('./error/CustomServerError.js'),

  arrondi: () => require('./utils/Arrondi.js'),
}
