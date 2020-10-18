'user strict';
const imp = require('../import.js');

const Router = imp.router();
const domain = imp.domain();
const cst = imp.cst();
const property = imp.prop();
const sendConfirmMail = imp.sendConfirmMail();
const uuid = imp.uuid();

const router = new Router();


module.exports = router;


/**
 * Get all users
 */
router.get('/', async (req, res) => {
  let rows = await domain.users();
  res
    .status(200)
    .json(rows);
});


/**
 * Register a new user with email sending
 */
router.post('/', async (req, res) => {
  const {mail, password} = req.body;
  const token = uuid.v4();
  sendConfirmMail.sendMail(mail, token).then(async () => {
    await domain.insertUser([mail, password, token]).then((newRow) => {
      res.status(201).json(newRow);
    }).catch((error) => {
      console.error(error);
      res.status(500);
    });
  }).catch((error) => {
    console.error(error);
    res.status(500);
  });
});


/**
 * Confirm new user by token
 */
router.get('/confirmMail/:token', async (req, res) => {
  const {token} = req.params;
  res.render('confirmMail', {
    token: JSON.stringify(token),
    api_user : JSON.stringify(cst.URL + property.url_utilisateur),
  });
});


/**
 * Get user by token
 */
router.get('/token/:token', async (req, res) => {
  const {token} = req.params;
  await domain.findUserByToken(token).then((user) => {
    res.status(200).json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500);
  });
});


/**
 * Get user by no expired token
 */
router.get('/noExpiredToken/:token', async (req, res) => {
  const {token} = req.params;
  await domain.checkExpiredToken(token).then((user) => {
    res.status(200).json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500);
  });
});


/**
 * Update new active user
 */
router.post('/validMail/:token', async (req, res) => {
  const {token} = req.params;
  await domain.becomeActif(token).then((user) => {
    res.status(200).json(user);
  }).catch((err) => {
    console.error(err);
    res.status(500);
  });
});


/**
 * Generate new token for unactive user and send mail
 */
router.post('/newToken/:token', async (req, res) => {
  const {token} = req.params;
  await domain.findUserByToken(token).then((user) => {
    const newToken = uuid.v4();
    const email = Object.keys(user)[0];
    sendConfirmMail.sendMail(email, newToken).then(async () => {
      await domain.generateNewToken([newToken, token]).then((newRow) => {
        res.status(200).json(newRow);
      }).catch((err) => {
        console.error(err);
        res.status(500);
      });
    }).catch((err) => {
      console.error(err);
      res.status(500);
    });
  }).catch((err) => {
    console.error(err);
    res.status(500);
  });
});

/*
*Récupération de l'utilisateur en fonction de son adresse mail
*/
router.get('/email/:mail', async (req, res) => {
  const {mail} = req.params;
  await domain.userByMail(mail).then((rows) => {
    res.status(200).json(rows);
  }).catch((err) => {
    res.status(500);
  });
});


/*
*Requête de connexion de l'utilisateur
*Vérification de l'email et du mot de passe
*/
router.post('/connexion', async (req, res) => {
  const { mail, password } = req.body;
  let row = await domain.userByMail(mail);
  let ret = false;
  let taille = Object.keys(row['utilisateur']).length;
  if (taille > 0) {
    if (password === row['utilisateur'][mail].password && row['utilisateur'][mail].actif == true) {
      ret = true;
      res
        .status(200)
        .json({
          "resp": ret,
          "user": row['utilisateur']
        });
    }
    else if (password !== row['utilisateur'][mail].password) {
      res
        .status(400)
        .json()
    }
    else if (row['utilisateur'][mail].actif == false) {
      res
        .status(403)
        .json()
    }
  }
  else {
    res
      .status(400)
      .json()
  }
});



/**
 * Récupération de tous les utilisateurs
 */
router.get('/'+property.url_base_admin+'/users', async (req, res) => {
  let rows = await domain.users();
  res
    .status(200)
    .json(rows);
});

/**
 * Mise à jour de l'utilisateur correspondant au mail
 */
router.post('/'+property.url_base_admin+'/update', async (req, res) => {
  const { mail, admin } = req.body;
  let rows = await domain.updateUtilisateur(
    [mail, admin]
  );

  res
    .status(201)
    .json(rows);
});

/**
 * Suppression du compte utilisateur correspondant au mail
 */
router.post('/'+property.url_base_admin+'/delete', async (req, res) => {
  const { mail, admin } = req.body;
  let rows = await domain.deleteUserByMail(
    [mail]
  );

  res
    .status(201)
    .json(rows);
});

/**
 * Suppression du compte utilisateur correspondant au mail (non admin)
 */
router.post('/delete', async (req, res) => {
  const { mail } = req.body;
  let rows = await domain.deleteUserByMail(
    [mail]
  );
  res
    .status(201)
    .json(rows);
});

/**
 * Mise à jour du mot de passe de l'utilisateur correspondant au mail
 */
router.post('/updatePassword', async (req, res) => {
  const { mail, oldPassword, newPassword } = req.body;

  let rows = await domain.updatePassword(
    [mail, oldPassword, newPassword]
  );

  if (rows == false) {
    res
      .status(400)
      .json();
  }
  else {
    res
      .status(201)
      .json(rows);
  }
});

/**
 * Send mail for retrieve user data
 */
router.get('/retrieve/:mail', async (req, res) => {
  const {mail} = req.params
  await domain.userByMail(mail).then(async (response) => {
    let user = Object.values(response.utilisateur)[0];
    user.password = "******"
    await sendConfirmMail.sendMailDataUser(mail, JSON.stringify(user)) .then(() => {
      res.status(200).send(true);
      return;
    })
  })
});