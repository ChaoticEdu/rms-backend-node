const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableschema = new Schema({
    table_name: {type : String, unique: true},
    table_status: {type : String},
    restaurant_id : { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name : { type : String}
}, {collection : 'table'});

const Table = mongoose.model('table',tableschema);

module.exports = Table;