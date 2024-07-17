const mongoose = require('mongoose');
const Table = require('./table');
const Restaurant = require('./restaurant_model');
const Menu = require('./menu_model');
const User = require('./user');
const Schema = mongoose.Schema;

const imageschema = new Schema({
    image_name: { type : String},
    image_category:{type: String},
    image_category_id: {type: mongoose.Schema.Types.ObjectId},
    image_category_type: {type: String , enum:['Menu', 'User']}

},{collection: 'image'});

const Image = mongoose.model('image', imageschema);

module.exports = Image;