'use strict'
var express = require('express');
var SongController = require('../controller/song');
var api = express.Router();
var md_auth = require('../middleware/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './medias/songs'})

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:id?', md_auth.ensureAuth, SongController.getSongs);
api.post('/song', md_auth.ensureAuth, SongController.addSong)
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post("/upload-media-song/:id", [md_auth.ensureAuth, md_upload], SongController.uploadMedia);
api.get("/get-media-song/:songFile", SongController.getSongFile);
module.exports = api;