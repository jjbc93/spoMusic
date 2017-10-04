/**
 * Created by Juanjo on 01/10/2017.
 */
'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "Clave_secreta_curso";

exports.ensureAuth = function (req, res, next) {
    if(!req.headers.authorization){
        return res.status(403).send({message: "La petición no es seguro, no tiene la cabezera authorization"})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp <= moment().unix()) {
            return res.status(401).send({message: "Token expirado"})
        }

    }catch(e){
        // console.log(e)
        return res.status(404).send({message: "Token no valido"})
    }

    req.user = payload;
    next();
};