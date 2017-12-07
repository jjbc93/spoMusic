/**
 * Created by Juanjo on 23/09/2017.
 */
'use strict'

var express = require('express');
var UserController = require("../controller/user");
var md_auth = require("../middleware/authenticated");
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './medias/users'})
var api = express.Router();

api.get("/probando-controlador", md_auth.ensureAuth, UserController.pruebas);
api.post("/register", UserController.saveUser);
api.post("/login", UserController.loginUser);
api.put("/update-user/:id", md_auth.ensureAuth, UserController.updateUser);
api.post("/upload-media/:id", [md_auth.ensureAuth, md_upload], UserController.uploadMedia);

module.exports = api;