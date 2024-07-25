const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderschema = new Schema({
    menu_id : { type : mongoose.Schema.Types.ObjectId, ref:'menu', required: true },
    user_id : { type : mongoose.Schema.Types.ObjectId, ref:'user',required: true},
    table_name:{type: String,required: true},
    item_name : {type : String,required: true},
    item_quantity : { type : Number, required: true, min:1},
    order_date: {type : Date,required: true},
    order_status : {type : String, required: true ,enum:['Pending','AcceptOrder','Done','Cancle','Served','Waiting']},
    bill_id: {type : mongoose.Schema.Types.ObjectId, ref:'bill', allowNull: true},
    restaurant_id : { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name : { type : String}
},{collection : 'order'});

const Order = mongoose.model('order',orderschema);

module.exports = Order;
