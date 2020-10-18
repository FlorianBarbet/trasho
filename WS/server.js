'use strict';
/* Import from module */
const express = require("express");
const bodyParser = require("body-parser");

/* Custom import */
const route = require("./presentation/route.js");

/* Constante server */
const PORT = 4550;
const BASE_URL = "/";
/* Launch the engine*/
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.listen(PORT, () => {
 route.init(PORT);
});

app.get(BASE_URL, (req,res,next) => {
  res.json({message : "WIP Trash Finder incomming"},200);
});
