const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderschema = new Schema({

    menu_id : { type : mongoose.Schema.Types.ObjectId, ref:'restaurant' },
    user_id : { type : mongoose.Schema.Types.ObjectId, ref:'user'},
    item_name : {type : String},
    item_quantity : { type : Number},
    order_date: {type : Date},
    order_status : {type : Boolean},
    bill_id: {type : mongoose.Schema.Types.ObjectId, ref:'bill'}
},{collection : 'order'});

const Order = mongoose.model('order',orderschmema);

mongoose.exports = Order;
