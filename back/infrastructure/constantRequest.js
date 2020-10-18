'use strict';
const imp = require('../import.js');
const property = imp.prop();

const GET_ALL_POUBELLES_INFO = ' SELECT * FROM poubelle  ' +
  'JOIN poubelle_type_poubelle ptp ON ptp.id_poubelle = poubelle.id_poubelle ' +
  'JOIN type_poubelle ON ptp.id_type_poubelle = type_poubelle.id_type_poubelle ';

const GET_ALL_POUBELLES_INFO_BY_ID = GET_ALL_POUBELLES_INFO + ' WHERE poubelle.id_poubelle = $1';

const GET_ALL_POUBELLES = ' SELECT * FROM poubelle  ';
const GET_ALL_POUBELLES_BY_ID = GET_ALL_POUBELLES + ' WHERE id_poubelle = $1';

const GET_TYPE_POUBELLES_BY_ID_POUBELLE = 'select type from type_poubelle t NATURAL JOIN poubelle_type_poubelle p where p.id_poubelle= $1'

const GET_USER_BY_EMAIL = 'select * from utilisateur where mail = $1';

const GET_ALL_USERS = 'select * from utilisateur';

const UPDATE_USER = 'UPDATE utilisateur SET flag_admin = $2 where mail = $1';

const DELETE_USER_BY_MAIL = 'DELETE FROM utilisateur where mail = $1';

const UPDATE_PASSWORD = 'UPDATE utilisateur SET password = $2 where mail = $1';

const GET_URL_POUBELLE = 'select url_photo from poubelle where id_poubelle = $1';

const INSERT_SIGNALEMENT_DELETE = 'insert into signalement (mail, id_poubelle, id_type_signalement, date_signalement) VALUES ($1, $2, (select id_type_signalement from type_signalement where type = \'Suppression\'), now())';

const PURGE_SIGNALEMENT = 'delete from signalement where date_signalement < (CURRENT_DATE - ' + property.time_before_delete_signalement + ')';

const GET_POUBELLES_DATE = 'select * from poubelle where date_ajout >= $1';

const GET_POUBELLE_AND_TYPE_BETWEEN_DATE = 'SELECT * FROM poubelle_type_poubelle pt JOIN poubelle p ON pt.id_poubelle = p.id_poubelle WHERE date_ajout BETWEEN $1 AND $2';

const GET_COUNT_NB_SIGNALEMENT = 'SELECT COUNT(*) FROM signalement where id_type_signalement = 1';

module.exports = {
  GET_ALL_POUBELLES,
  GET_ALL_POUBELLES_BY_ID,

  GET_ALL_POUBELLES_INFO,
  GET_ALL_POUBELLES_INFO_BY_ID,

  GET_TYPE_POUBELLES_BY_ID_POUBELLE,
  GET_USER_BY_EMAIL,
  GET_ALL_USERS,
  UPDATE_USER,
  DELETE_USER_BY_MAIL,
  UPDATE_PASSWORD,
  GET_COUNT_NB_SIGNALEMENT,
  GET_ALL_POUBELLES_BY_TYPE: 'select distinct p.* from poubelle p NATURAL JOIN poubelle_type_poubelle pt NATURAL JOIN type_poubelle t where t.type in ',

  GET_URL_POUBELLE,

  INSERT_SIGNALEMENT_DELETE,

  INSERT_POUBELLE: ' INSERT INTO poubelle(longitude, latitude, url_photo) VALUES ($1, $2, $3) returning id_poubelle',
  INSERT_TYPE_POUBELLE: ' INSERT INTO poubelle_type_poubelle(id_poubelle, id_type_poubelle) ' +
    'VALUES ($1,' +
    '(select id_type_poubelle from type_poubelle t where t.type=$2)' +
    ');',
  DELETE_POUBELLE_BY_ID: 'DELETE FROM poubelle WHERE id_poubelle = $1 RETURNING id_poubelle',

  GET_ALL_USERS: 'SELECT * FROM utilisateur',
  INSERT_USER: 'INSERT INTO utilisateur(mail, password, flag_admin, token, date_expire, experience, actif) ' +
    'VALUES ($1, $2, false, $3, current_date + interval \'1 month\', 0, false) returning *',

  GET_USER_BY_TOKEN: 'SELECT * FROM utilisateur WHERE token = $1',
  GET_USER_BY_UNEXPRIRED_TOKEN: 'SELECT * FROM utilisateur WHERE token = $1 and now() < date_expire',
  NEW_TOKEN: 'UPDATE utilisateur SET token = $1, date_expire = current_date + interval \'1 month\' WHERE token = $2 returning *',
  BECOME_ACTIF: 'UPDATE utilisateur SET actif = true, date_expire = null WHERE token = $1 returning *',
  EXPERIENCE_ADD_TRASH: 'UPDATE utilisateur SET experience = experience + 25 WHERE mail = $1 returning *',
  EXPERIENCE_REPORT_TRASH: 'UPDATE utilisateur SET experience = experience + 10 WHERE mail = $1 returning *',

  GET_ALL_TYPES: 'SELECT * FROM type_poubelle',

  ADD_REPORT_NEW_TRASH: 'insert into signalement (mail, id_poubelle, id_type_signalement, date_signalement) VALUES ($1, $2, (select id_type_signalement from type_signalement where type = \'Ajout\'), now()) returning *',

  PURGE_SIGNALEMENT,

  GET_POUBELLES_DATE,
  GET_POUBELLE_AND_TYPE_BETWEEN_DATE,
  BATCH_DELETE_POUBELLE : 'call delete_poubelle()',

  DELETE_REPORT_BY_USER_ID : 'delete from signalement where mail = $1',
};
