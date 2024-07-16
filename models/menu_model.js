const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuschema = new Schema({
    item_name:{type: String},
    item_price:{type: Number},
    item_category:{type: mongoose.Schema.Types.ObjectId, ref: 'category'},
    item_pic:{type: String},
    item_description:{type: String},
    restaurant_id :{type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name: {type : String},
},{ collection: 'menu' });

const Menu = mongoose.model('menu',menuschema);

module.exports = Menu;