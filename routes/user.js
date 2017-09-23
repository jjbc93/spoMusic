/**
 * Created by Juanjo on 23/09/2017.
 */
'use strict'

var express = require('express');
var UserController = require("../controller/user");

var api = express.Router();

api.get("/probando-controlador", UserController.pruebas);
api.post("/register", UserController.saveUser);

module.exports = api;