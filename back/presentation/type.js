'user strict';
const imp = require('../import.js');

const Router = imp.router();
const domain = imp.domain();

const router = new Router();

module.exports = router;

/**
 * Get all types
 */
router.get('/', async (req, res) => {
    await domain.getAllTypes().then((rows) => {
        res.status(200).json(rows);
    }).catch((err) => {
        console.error(err);
        res.status(500);
    });
})