/**
 * Created by Juanjo on 24/09/2017.
 */
'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "Clave_secreta_curso";

exports.createToken = function (user) {
    var payload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      image: user.image,
      iat: moment().unix(),
      exp: moment().add(30, "day").unix
    };

    return jwt.encode(payload, secret);
}