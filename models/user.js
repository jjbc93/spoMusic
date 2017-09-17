/**
 * Created by Juanjo on 17/09/2017.
 */
'use strict'
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: String,
    image: String

});

module.exports = mongoose.model('User', UserSchema);