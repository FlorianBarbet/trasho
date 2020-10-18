'user strict'
const imp = require('../import.js');
const con = imp.db();
const qry = imp.qry();
const Utilisateur = imp.utilisateur();

module.exports.sendUserByToken = async (token) => {
  let res =await  con.select(
      qry.GET_USER_BY_TOKEN,
      (rows)=>(Utilisateur.loadUnic(rows)),
      [token]
    );
    return res;
}
