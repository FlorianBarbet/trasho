'use strict';
/*========================================================*/
/*========================================================*/
/*===                      WARNING                     ===*/
/*
Si il y a un probleme avec cette partie contactez imperativement
FLORIAN BARBET
Cette classe est particuliere
*/
/*========================================================*/
/*========================================================*/


/*=== IMPORT ===*/
const imp = require('../import.js');

const { Pool } = imp.pg();
const cst = imp.cst();
const fs = imp.fs();
const property = imp.prop();


/*ATTRIBUTES*/

let cacheData;
let pool = init();

function init() {
  fs.writeFileSync(cst.PATH_CACHE, JSON.stringify({ run_state: true }));
  cacheData = JSON.parse(fs.readFileSync(cst.PATH_CACHE));
  return new Pool({
    user: property.database_user,
    host: property.database_host,
    database: property.database_db,
    password: property.database_password,
    port: property.database_port,
  });
}

module.exports = {
  query: (text, params) => pool.query(text, params), /* deprecated : au cas ou dans les requete custom*/
  open: () => pool = init(),
  close: () => pool.end().then('Pool has ended'),
}


module.exports.select = async (queryCall, loaderMethod, data = null) => {
  await pool
    .query(queryCall, data)
    .then(res => {
      let rows = res.rows;
      cacheData = JSON.stringify(loaderMethod(rows));
      fs.writeFileSync(cst.PATH_CACHE, cacheData);
    })
    .catch(e => console.error(e.stack));
  return JSON.parse(fs.readFileSync(cst.PATH_CACHE));
};

module.exports.transaction = async (queryCall, data) => {
  const client = await pool.connect();
  let res;
  try {
    await client.query('BEGIN');
    res = await client.query(queryCall, data);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    throw err
  } finally {
    client.release();
  }
  return res;
}
