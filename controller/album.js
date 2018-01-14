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

function updateAlbum(req, res)
{
    var albumId = req.params.id;
    var update = req.body;
    Album.findByIdAndUpdate(albumId, update, {new:true}, (error, albumUpdated) => {
        if(error){
            res.status(500).send({"message" : "Error al actualizar"})
        }else{
            if(!albumUpdated){
                res.status(404).send({"message" : "No existe el album"})
            }else{
                res.status(200).send({album: albumUpdated});
            }
        }
    });
    //Otra manera de actualizar los campos
   /* Album.findOneAndUpdate({'_id' : albumId}, {$set : update}, {new: true}, (error, albumUp) =>{
        if(error){
            res.status(500)
        }else{
            if(!albumUp){
                res.status(404)
            }else{
                res.status(200).send({"album" : albumUp})
            }
        }
    })*/
}

function deleteAlbum(req, res)
{
    var albumId = req.params.id;
    Album.findByIdAndRemove(albumId, (error, albumRemoved) => {
        if(error){
            res.status(500).send({"message" : "Error al eliminar recurso"})
        }else{
            if(!albumRemoved){
                res.status(404).send({"message" : "Album no encontrado"});
            }else{
                Song.find({album: albumRemoved._id}).remove((error, songRemoved) => {
                    if(error){
                        res.status(500).send({"message" : "Error al eliminar recurso"})
                    }else{
                        if(!songRemoved){
                            res.status(404).send({"message" : "Canción no encontrada"})
                        }else{
                            res.status(200).send({album : albumRemoved})
                        }
                    }
                })
            }
        }
    })
}

function uploadMedia(req, res)
{
    var albumId = req.params.id;
    if(req.files){
        var file_path = req.files.image.path;
        var file_ext = path.extname(file_path);
        var file_name = path.basename(file_path, file_ext) + file_ext;

        if(file_ext == ".png" || file_ext == ".jpg" || file_ext == ".gif"){
            //en el json el parámetro new se indica para que actualize directamente los datos
            Album.findByIdAndUpdate(albumId, {image: file_name}, {new:true}, (err, albumUpdated) =>{
                if(!albumUpdated){
                    res.status(500).send({message: "Error al actualizar el usuario"});
                }else{
                    res.status(200).send({album: albumUpdated});
                }
            });

        }else{
            res.status(400).send({message: "El formato no es valido"});
        }
    }else{
        res.status(400).send({message: 'No se ha podido subir la imagen'});
    }
}

function getImageAlbum (req, res){
    var imageFile = req.params.imageFile;
    var pathFile = "./medias/albums/" + imageFile;
    if(fs.existsSync(pathFile)){
        res.sendFile(path.resolve(pathFile));
    }else{
        res.status(404).send({message: "Recurso no encontrado"});
    }
}

module.exports = {
    addAlbum,
    getAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadMedia,
    getImageAlbum,
};