/**
 * Created by Juanjo on 17/09/2017.
 */
'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

//Cargar rutas

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras Http

//Rutas base

app.get("/status", function (req, res) {
    res.status(200).send({message: "Status spoMusic"});
});

//Exportación del módulo
module.exports = app;