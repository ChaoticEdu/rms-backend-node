const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderschema = new Schema({
    menu_id : { type : mongoose.Schema.Types.ObjectId, ref:'restaurant' },
    user_id : { type : mongoose.Schema.Types.ObjectId, ref:'user'},
    table_name:{tyep: String},
    item_name : {type : String},
    item_quantity : { type : Number},
    order_date: {type : Date},
    order_status : {type : Boolean},
    bill_id: {type : mongoose.Schema.Types.ObjectId, ref:'bill'},
    restaurant_id : { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name : { type : String}
},{collection : 'order'});

const Order = mongoose.model('order',orderschema);

module.exports = Order;
