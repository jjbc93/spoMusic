/**
 * Created by Juanjo on 17/09/2017.
 */
'use strict'


var mongoose = require('mongoose');
var app = require("./app");
var port = process.env.PORT || 3333;

//Configuración BD
mongoose.Promise = global.Promise;
mongoose.connection.openUri('mongodb://localhost:27017/spomusic', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Base de datos corriendo");
        app.listen(port, function () {
            console.log("Servidor Api escuchando en http://localhost:", port);
        });
}
});