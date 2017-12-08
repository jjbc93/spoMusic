'use strict'
var express = require('express');
var ArtistController = require('../controller/artist');
var api = express.Router();
var md_auth = require('../middleware/authenticated');

api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get("/artists", md_auth.ensureAuth, ArtistController.getArtists);
api.post("/artist", md_auth.ensureAuth, ArtistController.addArtist);
api.patch("/artist/:id", md_auth.ensureAuth, ArtistController.updateArtist);
module.exports = api;

