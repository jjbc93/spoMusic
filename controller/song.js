'use strict'
var path = require('path');
var fs = require ('fs')
var moongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function addSong (req, res){
    var song = new Song();
    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((error, songStored) => {
        if(error){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!songStored){
                res.status(404).send({message : "No se ha guardado la canción"});
            }else{
                res.status(200).send({song: songStored});
            }
        }
    })
}

function getSongs(req, res){
    var albumId = req.params.id;
    var page = req.query.page ? req.query.page : 1;
    var itemsPerpage = req.query.perPage;
    var itemsOrderField = req.query.orderSort;
    var itemsOrderValue = req.query.orderBy
    var options = {};
    if(itemsOrderField && itemsOrderValue){
        options[itemsOrderField] = itemsOrderValue;
    }else{
        options = 'number'
    }

    var find;
    if(!albumId){
        find = Song.find({}).sort(options).paginate(parseInt(page, 10), parseInt(itemsPerpage, 10));
    }else{
        find = Song.find({album: albumId}).sort(options).paginate(parseInt(page, 10), parseInt(itemsPerpage, 10));
    }

    find.populate({
        path: 'album',
        populate:{
            path: 'artist',
            model: 'Artist'
        }
    }).exec((error, songs) => {
        if(error){
            res.status(500).send({message : "Error del servidor"})
        }else{
            if(!songs){
                res.status(404).send({message: "No existen canciones"});
            }else{
                res.status(200).send({
                    totalItems: songs.length,
                    songs: songs
                })
            }
        }
    })
}

function getSong(req, res){
    var songId = req.params.id;
    Song.findById(songId).populate({path: 'album'}).exec((error, song) => {
        if(error){
            res.status(500).send({message : "Error del servidor"});
        }else{
            if(!song){
                res.status(404).send({message: "No existe la canción"});
            }else{
                res.status(200).send({song: song});
            }
        }
    })
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, {new:true}, (error, songUpdated) => {
        if(error){
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!songUpdated){
                res.status(404).send({message: "No existe la canción con id " + songId})
            }else{
                res.status(200).send({song: songUpdated});
            }
        }
    })
}

function deleteSong(req, res){
    var songId = req.params.id;

    Song.findOneAndRemove(songId, (error, songRemoved) => {
        if(error){
            res.status(500).send({message: "Error del servidor"})
        }else{
            if(!songRemoved){
                res.status(404).send({message: "No existe la canción con id " + songId});
            }else{
                res.status(200).send({song: songRemoved});
            }
        }
    })
};

function uploadMedia(req, res)
{
    var songId = req.params.id;
    if(req.files){
        var file_path = req.files.file.path;
        var file_ext = path.extname(file_path);
        var file_name = path.basename(file_path, file_ext) + file_ext;

        if(file_ext == ".mp3" || file_ext == ".ogg"){
            //en el json el parámetro new se indica para que actualize directamente los datos
            Song.findByIdAndUpdate(songId, {file: file_name}, {new:true}, (err, songUpdated) =>{
                if(!songUpdated){
                    res.status(500).send({message: "Error al actualizar la canción"});
                }else{
                    res.status(200).send({album: songUpdated});
                }
            });

        }else{
            res.status(400).send({message: "El formato no es valido"});
        }
    }else{
        res.status(400).send({message: 'No se ha podido subir el audio'});
    }
}

function getSongFile (req, res){
    var songFile = req.params.songFile;
    var pathFile = "./medias/songs/" + songFile;
    if(fs.existsSync(pathFile)){
        res.sendFile(path.resolve(pathFile));
    }else{
        res.status(404).send({message: "Recurso no encontrado"});
    }
}

module.exports = {
    addSong,
    getSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadMedia,
    getSongFile
}