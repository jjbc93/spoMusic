'use strict'
var path = require('path');
var fs = require ('fs')
var moongosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res)
{
    var artistId = req.params.id;
    Artist.findById(artistId, (error, artist)=>{
       if(error){
           res.status(500).send({message: "Error del servidor"})
       }else{
           if(!artist){
               res.status(404).send({message: "Artista no encontrado"});
           }else{
               res.status(200).send({artist: artist});
           }
       }
    });
}

function getArtists(req, res)
{
    var page = req.query.page ? req.query.page : 1;
    var itemsPerpage = req.query.perPage;
    var itemsOrderField = req.query.orderSort;
    var itemsOrderValue = req.query.orderBy
    var options = {};
    options[itemsOrderField] = itemsOrderValue;
    Artist.find().sort(options).paginate(parseInt(page,10), parseInt(itemsPerpage,10), (error, artists, total) =>{
        if(error){
            console.log("error", error)
            res.status(500).send({message: "Error del servidor"});
        }else{
            if(!artists){
                res.status(404).send({message: "No hay artistas"});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                })
            }
        }
    });
}

function addArtist(req, res)
{
    var artist = new Artist();
    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = null;

    artist.save((err, artistStored) =>{
       if(err){
           res.status(500).send({message: "Error en la creación del artista"});
       }else{
           if(!artistStored){
               res.status(400).send({message: "El artista no ha podido ser creado"})
           }else{
               res.status(200).send({artist: artistStored});
           }
       }
    });
}

function updateArtist(req, res)
{
    var artistId = req.params.id;
    var update = req.body;
    Artist.findByIdAndUpdate(artistId, update, {new:true}, (err, artistUpdated)=>{
       if(err){
           res.status(500).send({message: "Error del servidor"});
       }else{
           if(!artistUpdated){
               res.status(404).send({message: "Artista no encontrado"});
           }else{
               res.status(200).send({artist: artistUpdated});
           }
       }
    });
}

function deleteArtist(req, res)
{
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (error, artistRemoved) => {
        if(error){
            res.status(500).send({"message" : "Error al eliminar el recurso"})
        }else{
            if(!artistRemoved){
                res.status(404).send({"message" : "El artista no ha podido ser eliminado"})
            }else{
                Album.find({artist : artistRemoved._id}).remove((error, albumRemoved) => {
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
                                        res.status(200).send({"artist" : artistRemoved})
                                    }
                                }
                            })
                        }
                    }
                })
            }
        }
    })
}

function uploadMedia(req, res)
{
    var artistId = req.params.id;
    if(req.files){
        var file_path = req.files.image.path;
        var file_ext = path.extname(file_path);
        var file_name = path.basename(file_path, file_ext) + file_ext;

        if(file_ext == ".png" || file_ext == ".jpg" || file_ext == ".gif"){
            //en el json el parámetro new se indica para que actualize directamente los datos
            Artist.findByIdAndUpdate(artistId, {image: file_name}, {new:true}, (err, artistUpdated) =>{
                if(!artistUpdated){
                    res.status(500).send({message: "Error al actualizar el usuario"});
                }else{
                    res.status(200).send({artist: artistUpdated});
                }
            });

        }else{
            res.status(400).send({message: "El formato no es valido"});
        }
    }else{
        res.status(400).send({message: 'No se ha podido subir la imagen'});
    }
}

function getImageArtist (req, res){
    var imageFile = req.params.imageFile;
    var pathFile = "./medias/artists/" + imageFile;
    if(fs.existsSync(pathFile)){
        res.sendFile(path.resolve(pathFile));
    }else{
        res.status(404).send({message: "Recurso no encontrado"});
    }
}
module.exports = {
  getArtist,
  getArtists,
  addArtist,
  updateArtist,
  deleteArtist,
  uploadMedia,
  getImageArtist
};