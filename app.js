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
var song_routes = require("./routes/song");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Configurar cabeceras Http TODO REVISAR
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, ' +
        'X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
})

//Rutas base

app.use('/api', [user_routes, artist_routes, album_routes, song_routes]);

app.get("/status", function (req, res) {
    res.status(200).send({message: "Status spoMusic"});
});

//Exportación del módulo
module.exports = app;