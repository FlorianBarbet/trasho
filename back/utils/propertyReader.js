'user strict';

const imp = require('../import.js');
const fs = imp.fs();
const cst = imp.cst();

module.exports = JSON.parse(fs.readFileSync(cst.PATH_CONF_PROPS));
