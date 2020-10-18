'use strict';
/* Import from module */
const imp = require('./import.js');

const express = imp.express();
const bodyParser = imp.bodyParser();
const cors = imp.cors();
const property = imp.prop();
const mountRoutes = imp.route();
const security = imp.security();
const CustomServerError = imp.serverError();
/* Constante server */
const PORT = property.server_port;
const BASE_URL = property.url_base;
/* Launch the engine*/
var app = express();

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors())

// Configure ejs
app.set('views', './views');
app.set('view engine', 'ejs');

app.use('*',(req,res,next) => {
  try{
    auth(req);
    next();
  }catch(error){
    let code = 500;
    if(error instanceof CustomServerError)
      code = error.code;
    res
    .status(code)
    .json({
      message : error.message
    });
  }
});

app.use('*'+property.url_base_admin+'*',async (req,res,next) => {
  try{
    auth(req);
    await security.administrateur(req);
    next();
  }catch(error){
    let code = 500;
    if(error instanceof CustomServerError)
      code = error.code;
    res
    .status(code)
    .json({
      message : error.message
    });
  }
});
app.listen(PORT, () => {
 mountRoutes.init();
});

mountRoutes(app);

function auth(req){
  if(!security.tokenApplication(req))
    throw new CustomServerError("Access Forbidden",401);
}
