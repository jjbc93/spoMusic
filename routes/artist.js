'use strict'
var express = require('express');
var ArtistController = require('../controller/artist');
var api = express.Router();
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './medias/artists'})

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get("/artists", md_auth.ensureAuth, ArtistController.getArtists);
api.post("/artist", md_auth.ensureAuth, ArtistController.addArtist);
api.patch("/artist/:id", md_auth.ensureAuth, ArtistController.updateArtist);
api.delete("/artist/:id", md_auth.ensureAuth, ArtistController.deleteArtist);
api.post("/upload-media-artist/:id", [md_auth.ensureAuth, md_upload], ArtistController.uploadMedia);
api.get("/get-media-artist/:imageFile", ArtistController.getImageArtist);
module.exports = api;

