'use strict'
var path = require('path');
var fs = require ('fs')
var moongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbums(req, res)
{
    var artistId = req.params.artist;
    var page = req.query.page ? req.query.page : 1;
    var itemsPerpage = req.query.perPage;
    var itemsOrderField = req.query.orderSort;
    var itemsOrderValue = req.query.orderBy
    var options = {};
    options[itemsOrderField] = itemsOrderValue;
    var find;
    if(!artistId){
        //Devolver todos los albums de la BD
        find = Album.find().sort(options).paginate(parseInt(page, 10), parseInt(itemsPerpage, 10));
    }else{
        //Devolver los albums de un artista
        find = Album.find({artist: artistId}).sort(options).paginate(parseInt(page, 10), parseInt(itemsPerpage, 10));
    }
    find.populate({path: 'artist'}).exec((error, albums) =>{
        if(error){
            res.status(500).send({"message" : "Error interno del servidor"})
        }else{
            if(!albums){
                res.status(404).send({"message" : "No hay albums del artista"})
            }else{
                res.status(200).send({
                    totalItems: albums.length,
                    albums: albums
                })
            }
        }
    })
}

function addAlbum(req, res)
{
    var album = new Album();
    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = null;
    album.artist = params.artist;
    album.save((error, albumStored) => {
        if(error){
            res.status(500).send({"message" : "Error en la creación del album "})
        }else{
            if(!albumStored){
                res.status(400).send({message: "El album no ha podido ser creado"})
            }else{
                res.status(200).send({"album" : albumStored});
            }
        }
    })
}

function getAlbum(req, res)
{
    var albumId = req.params.id;
    Album.findById(albumId).populate({path: 'artist'}).exec((error, album) =>{
        if(error){
            res.status(500).send({"message" : "Error al devolver un artista"});
        }else{
            if(!album){
                res.status(400).send({"message" : "Album no encontrado"})
            }else{
                res.status(200).send({album : album})
            }
        }
    })
}
module.exports = {
    addAlbum,
    getAlbum,
    getAlbums
};