/**
 * Created by Juanjo on 23/09/2017.
 */
'use strict'

var User = require('../models/user');
var bcrypt = require("bcrypt-nodejs");

function pruebas(req, res) {
    res.status(200).send({
        message: "Controlador Usuarios SpoMusic"
    });
}

function saveUser(req, res){
    var user = new User();
    var params = req.body;

    console.log("Params", params);
    user.firstName = params.firstName;
    user.lastName = params.lastName;
    user.email = params.email;
    user.role =  params.role;
    user.image = 'null';

    if(params.password){
        //Encryptar
        bcrypt.hash(params.password, null, null, function (error, hash) {
            if(!error){
                user.password = hash;
                if(user.firstName != null && user.lastName != null && user.email != null){
                    user.save((error, userStored) => {
                       if(error){
                           res.status(500).send({
                               message: "Error al guardar el usuario"
                           })
                       }else{
                           if(!userStored){
                               res.status.send({message: "No se ha registrado el usuario"})
                           }else{
                               res.status(200).send({user: userStored});
                           }
                       }
                    });
                }else{
                    res.status(500).send({
                        message: "Introduzca todos los campos del formulario"
                    });
                }
            }
        });
    }else{
        res.status(500).send({
            message: "Introduzca una password"
        })
    }


}

module.exports = {
  pruebas,
  saveUser
};