const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tableschema = new Schema({
    table_name: {type : String},
    table_status: {type : String}
}, {collection : 'table'});

const Table = mongoose.model('table',tableschema);

module.exports = Table;