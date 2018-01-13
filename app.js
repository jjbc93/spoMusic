/**
 * Created by Juanjo on 17/09/2017.
 */
'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

//Cargar rutas

var user_routes = require("./routes/user");
var artist_routes = require("./routes/artist");
var album_routes = require("./routes/album")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras Http

//Rutas base

app.use('/api', [user_routes, artist_routes, album_routes]);

app.get("/status", function (req, res) {
    res.status(200).send({message: "Status spoMusic"});
});

//Exportación del módulo
module.exports = app;