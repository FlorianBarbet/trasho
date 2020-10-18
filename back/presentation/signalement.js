'user strict';
const imp = require('../import.js');

const Router = imp.router();
const domain = imp.domain();

const router = new Router();


module.exports = router;

router.get('/',async (req,res) => {
  let rows = {state : "TODO", where:"report"};
  res
    .status(200)
    .json(rows);
});


/* Add report when new trash was added*/
router.post('/newTrash', async (req, res) => {
  const {mail, id_poubelle} = req.body;
  await domain.addReportNewTrash([mail, id_poubelle]).then(async () => {
    await domain.addNewTrashXP([mail]).then(() => {
      res.status(201).send(true);
    });
  });  
})

/* Add report when new trash was reported */
router.post('/addSignalementDelete',async(req, res) => {
  const {idPoubelle, mail } = req.body;
  await domain.insertSignalementDelete([mail, idPoubelle]).then(async () => {
    await domain.reportTrashXP([mail]).then(() => {
      res.status(200).json();
    })
  })
});

/* COunt nb signalement suppression poubelle*/
router.get('/countSignalements',async (req,res) => {
  await domain.getCountSignalement().then((rows) => {
    res.status(200).json(rows);
  }).catch((err) => {
    res.status(500);
  })
});

