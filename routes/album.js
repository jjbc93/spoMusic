'use strict'
var express = require('express');
var AlbumController = require('../controller/album');
var api = express.Router();
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './medias/albums'})

api.get("/albums/:artist?", md_auth.ensureAuth, AlbumController.getAlbums);
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.addAlbum);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post("/upload-media-album/:id", [md_auth.ensureAuth, md_upload], AlbumController.uploadMedia);
api.get("/get-media-album/:imageFile", AlbumController.getImageAlbum);
module.exports = api;

