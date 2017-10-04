/**
 * Created by Juanjo on 23/09/2017.
 */
'use strict'

var express = require('express');
var UserController = require("../controller/user");
var md_auth = require("../middleware/authenticated");
var api = express.Router();

api.get("/probando-controlador", md_auth.ensureAuth, UserController.pruebas);
api.post("/register", UserController.saveUser);
api.post("/login", UserController.loginUser);

module.exports = api;