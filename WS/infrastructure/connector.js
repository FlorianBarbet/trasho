'use strict';


/*
system_trasho
'TECH'
ON
trash_finder
*/

const { Pool, Client } = require('pg');
const GET_USERS = 'SELECT * FROM USERS';
/*prepared stmt*/
const GET_USERS_ID = {
  // give the query a unique name
  name: 'fetch-user',
  text: 'SELECT * FROM USERS WHERE login = $1',
  values: [12],
}
/*
Ceci est un POC nous pourrons
grace a la POOL mettre en place un
systeme de variable d'environnement
 a la place ( ou properties )
 */


const client = new Client({
  user: 'system_trasho',
  host: 'localhost',
  database: 'trash_finder',
  password: 'TECH',
  port: 5432,
  connectionTimeoutMillis : 2000,
});

module.exports.getUsers = () =>  {
  client.connect();
  return client.query(GET_USERS)
};

module.exports.close = () => {
  client.end();
}
