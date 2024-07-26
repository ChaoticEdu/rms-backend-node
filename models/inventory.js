var mongoose = require('mongoose')
var Schema = mongoose.Schema;

const inventoryschema = new Schema({
    item_name:{type:String},
    quantity:{type: Number, scale:2},
    description:{type:String},
    supplires_name:{type:String},
    rate:{type: Number, scale:2},
    restaurant_id: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant'},
    restaurant_name: {type: String}
},{collection: "inventory"});

const Inventory = mongoose.model('inventory',inventoryschema);

module.exports = Inventory;