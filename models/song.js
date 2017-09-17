/**
 * Created by Juanjo on 17/09/2017.
 */
'use strict'
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: {type: Schema.ObjectId, ref: 'Album'}

});

module.exports = mongoose.model('Song', SongSchema);