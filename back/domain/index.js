'user strict'
const imp = require('../import.js');
const con = imp.db();
const qry = imp.qry();
const Poubelle = imp.poubelle();
const Utilisateur = imp.utilisateur();
const Type = imp.type();
const property = imp.prop();
const arrondi = imp.arrondi();

/*
DOMAIN :  terme metiers : comprehensible

*/


/**
 * Get all trash informations
 */
module.exports.sendAllPoubellesInfo = async () => {
  let res = await con.select(
    qry.GET_ALL_POUBELLES_INFO,
    (rows) => (Poubelle.loadList(rows))
  );
  return res;
}

/**
 * Get all trash
 */
module.exports.sendAllPoubelles = async () => {
  let res = await con.select(
    qry.GET_ALL_POUBELLES,
    (rows) => (Poubelle.loadList(rows))
  );
  return res;
}

/**
 * Get count signalement
 */
module.exports.getCountSignalement = async () => {
  let res = await con.select(
    qry.GET_COUNT_NB_SIGNALEMENT,
    (rows) => (rows)
  );
  return res;
}

/**
 * Get trash informations by id
 */
module.exports.sendPoubellesInfoById = async (id_poubelle) => {
  let res = await con.select(
    qry.GET_ALL_POUBELLES_INFO_BY_ID,
    (rows) => (Poubelle.loadList(rows)),
    [id_poubelle]
  );
  return res;
}

/**
 * Get trash by id
 */
module.exports.sendPoubellesById = async (id_poubelle) => {
  let res = await con.select(
    qry.GET_ALL_POUBELLES_BY_ID,
    (rows) => (Poubelle.loadList(rows)),
    [id_poubelle]
  );
  return res;
}

/**
 * Get trash type by id
 */
module.exports.getTypePoubellesByIdPoubelle = async (id_poubelle) => {
  let res = await con.select(
    qry.GET_TYPE_POUBELLES_BY_ID_POUBELLE,
    (rows) => (Poubelle.loadList(rows)),
    [id_poubelle]
  );
  return res;
}

/**
 * Get trash picture by id
 */
module.exports.getUrlPoubelleByIdPoubelle = async (id_poubelle) => {
  let res = await con.select(
    qry.GET_URL_POUBELLE,
    (rows) => (Poubelle.loadList(rows)),
    [id_poubelle]
  );
  return res;
}

/**
 * Insert a new trash 
 */
module.exports.insererPoubelle = async (dataPoubelle) => {
  let res = await transaction(qry.INSERT_POUBELLE, dataPoubelle)
    .then((resp) => {
      let ret = resp.rows[0].id_poubelle;
      return ret;
    }).catch((err) => { console.error(err); res = "failed" })
  return { id_poubelle: res };
}

/**
 * Get all users
 */
module.exports.sendAllUsers = async () => {
  let res = await con.select(
    qry.GET_ALL_USERS,
    (rows) => (Utilisateur.loadList(rows))
  );
  return res;
}

/* Insert a new user */
module.exports.insertUser = async (dataUser) => {
  let res = await transaction(qry.INSERT_USER, dataUser).then((resp) => {
    let ret = resp.rows[0];
    return ret;
  }).catch((err) => {
    console.error(err);
    res = "failed";
  });
  return { user: res };
}

/* Return the user by token */
module.exports.findUserByToken = async (token) => {
  let res = await con.select(
    qry.GET_USER_BY_TOKEN,
    (rows) => (Utilisateur.loadList(rows)),
    [token]
  );
  return res.utilisateur;
}

/* Return the user by token (the token need to be no expired) */
module.exports.checkExpiredToken = async (token) => {
  let res = await con.select(
    qry.GET_USER_BY_UNEXPRIRED_TOKEN,
    (rows) => (Utilisateur.loadList(rows)),
    [token]
  );
  return res.utilisateur;
}

/* The selected user become active */
module.exports.becomeActif = async (token) => {
  let res = await transaction(qry.BECOME_ACTIF, [token]).then((resp) => {
    return resp.rows[0];
  }).catch((err) => {
    console.error(err);
    res = "failed";
  });
  return res;
}

/* Generate a new token */
module.exports.generateNewToken = async (dataNewToken) => {
  let res = await transaction(qry.NEW_TOKEN, dataNewToken).then((resp) => {
    return resp.rows[0];
  }).catch((err) => {
    console.error(err);
    res = "failed";
  });
  return res;
}

/* Get all users by mail */
module.exports.userByMail = async (mail) => {
  let res = await con.select(
    qry.GET_USER_BY_EMAIL,
    (rows) => (Utilisateur.loadList(rows)),
    [mail]
  );
  return res;
}

/*
* Récupération des poubelles ajoutées avant une date
*/
module.exports.poubellesAjoutAvantDate = async (date) => {
  let res = await con.select(
    qry.GET_POUBELLES_DATE,
    (rows) => (Poubelle.loadList(rows)),
    [date]
  );
  return res;
}

/*
* Récupération des poubelles ajoutées entre deux dates
* Calcul des statistiques
*/
module.exports.poubellesAjoutEntreDates = async (date1, date2) => {
  let res = await con.select(
    qry.GET_POUBELLE_AND_TYPE_BETWEEN_DATE,
    (rows) => {
      console.log(rows);

      let poubelles = rows;
            let nbRecyclable = 0;
            let nbVerre = 0;
            let nbToutDechet = 0;
            let nbTotal = 0;
            let percentRecyclable = 0;
            let percentVerre = 0;
            let percentToutDechet = 0;

      for (let key in poubelles) {
        console.log("key : " + key);
        if(poubelles[key].id_type_poubelle == 1) {
            nbRecyclable += 1;
        }
        else if(poubelles[key].id_type_poubelle == 2) {
            nbVerre += 1;
        }
        else if(poubelles[key].id_type_poubelle == 3) {
            nbToutDechet += 1;
        }
        nbTotal += 1;
    }

    if(nbRecyclable > 0) {
      percentRecyclable = nbRecyclable/nbTotal*100;
    }
    
    if(nbVerre > 0) {
      percentVerre = nbVerre/nbTotal*100;
    }
    
    if(nbToutDechet > 0) {
      percentToutDechet = nbToutDechet/nbTotal*100;
    }

      return {
        nbRecyclage: nbRecyclable,
        nbVerre: nbVerre,
        nbToutDechet: nbToutDechet,
        percentRecyclable: arrondi.roundDecimal(percentRecyclable, 2),
        percentVerre: arrondi.roundDecimal(percentVerre, 2),
        percentToutDechet: arrondi.roundDecimal(percentToutDechet, 2)
      }
    }
      
    ,
    [date1, date2]
  );
  return res;
}

/*
* Modification de l'utilisateur
*/
module.exports.updateUtilisateur = async (data) => {
  let res = await transaction(qry.UPDATE_USER, data)
    .then((resp) => {
      let ret = resp.rows[0];
      return ret;
    }).catch((err) => { console.error(err); res = "failed" })
  return { user: res };
}

/*
* Suppression de l'utilisateur en fonction de l'email
*/
module.exports.deleteUserByMail = async (mail) => {
  await transaction(qry.DELETE_REPORT_BY_USER_ID, mail).then(async () => {
    let res = await transaction(qry.DELETE_USER_BY_MAIL, mail)
    .then((resp) => {
      let ret = resp.rows[0];
      return ret;
    }).catch((err) => { console.error(err); res = "failed" })
  })
  return { user: "failed" };
}

/*
* Modification du mot de passe
* Vérification de l'ancien mot de passe pour valider la modification
*/
module.exports.updatePassword = async (data) => {

  const mail = data[0];
  const oldPassword = data[1];
  const newPassword = data[2];
  dataUpdate = [mail, newPassword];
  let retour = '';

  let resUser = await transaction(qry.GET_USER_BY_EMAIL, [mail])
    .then((resp) => {
      let user = resp.rows[0];
      if (user["password"] == oldPassword) {
        let res = transaction(qry.UPDATE_PASSWORD, dataUpdate)
          .then((resp) => {
            let ret = resp.rows[0];
          }).catch((err) => { console.error(err); res = "failed" });
        retour = true;
      }
      else {
        retour = false;
      }
    });
  return retour;
}


/* Insert signalement poubelle delete */
module.exports.insertSignalementDelete = async (data) => {
  await transaction(qry.INSERT_SIGNALEMENT_DELETE, data)
}

/* Supprime poubelle admin */
module.exports.deletePoubelle = async (data) => {
  let res = await transaction(qry.DELETE_POUBELLE_BY_ID, data);
  return res
}

/* Get all types */
module.exports.getAllTypes = async () => {
  let res = await con.select(
    qry.GET_ALL_TYPES,
    (rows) => (Type.loadList(rows))
    );
  return res;
}

/* Get all users */
module.exports.users = async () => {
  let res = await con.select(
    qry.GET_ALL_USERS,
    (rows) => (Utilisateur.loadList(rows))
  );
  return res;
}

/* Add type for trash */
module.exports.addTypeForTrash = async (trashAndType) => {
  await transaction(qry.INSERT_TYPE_POUBELLE, trashAndType).then((resp) => {
    return resp.rows[0]
  }).catch((err) => {
    console.error(err);
    return "failed";
  })
}

/* Get trash by type */
module.exports.getTrashFromTypes = async (type) => {
  let res = await con.select(
    qry.GET_ALL_POUBELLES_BY_TYPE + type,
    (rows) => (Poubelle.loadList(rows)),
  );
  return res;
}

/* Add new report for new trash */
module.exports.addReportNewTrash = async (mailAndIdPoubelle) => {
  await transaction(qry.ADD_REPORT_NEW_TRASH, mailAndIdPoubelle).then((resp) => {
    return resp.rows[0];
  }).catch((err) => {
    console.error(err);
    return "failed";
  })
}

/* Add XP to user when trash was added */
module.exports.addNewTrashXP = async (mail) => {
  await transaction(qry.EXPERIENCE_ADD_TRASH, mail).then((resp) => {
    return resp.rows[0];
  }).catch((err) => {
    console.error(err);
    return "failed";
  })
}

/* Add XP to user when trash was reported */
module.exports.reportTrashXP = async (mail) => {
  await transaction(qry.EXPERIENCE_REPORT_TRASH, mail).then((resp) => {
    return resp.rows[0];
  }).catch((err) => {
    console.error(err);
    return "failed";
  })
}

function transaction(requete, donnees_colonnes) {
  let retour = true;
  try {
    retour = con.transaction(
      requete,
      donnees_colonnes
    );
  } catch (err) {
    throw err;
  }
  return retour;
}


var schedule = require('node-schedule');

schedule.scheduleJob(property.cron_purge, function () {
  console.log('Purge des signalements');
  transaction(qry.PURGE_SIGNALEMENT, []);
});

schedule.scheduleJob(property.cron_batch_delete_poubelle, function () {
  console.log('BATCH de suppression des poubelles')
  transaction(qry.BATCH_DELETE_POUBELLE, []);
});