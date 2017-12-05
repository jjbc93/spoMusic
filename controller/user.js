/**
 * Created by Juanjo on 23/09/2017.
 */
'use strict'

var User = require('../models/user');
var bcrypt = require("bcrypt-nodejs");
var jwt = require("../service/jwt");

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


function loginUser (req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: "Problema interno del servidor"})
        }else{
            if(!user){
                res.status.send({message: "Usuario no encontrado"})
            }else{
                //Comprobar la pass
                bcrypt.compare(password, user.password, function (err, check) {
                   if(check){
                       //Devolver datos del user logueado
                       if(params.getHash){
                           //devolver un token de jwt
                           res.status(200).send({
                               token: jwt.createToken(user)
                           })
                       }else{
                           res.status(200).send({user});
                       }
                   }else{
                       res.status(404).send({message: "Usuario o contraseña no validos"})
                   }
                });
            }
        }
    })
}

function updateUser (req, res)
{
    var userId = req.params.id;
    var update = req.body;
    User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
        if(err){
            res.status(500).send({message: "Error al actualiar el usuario"});
        }else{
            if(!userUpdated){
                res.status(404).send({message: "No se ha encontrado el usuario"})
            }else{
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
};