const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billschema = new Schema({
    item_list : {type : [String]},
    total : {type : Number},
    tips : {type : Number},
    discount : { type: Number},
    bill_channel : { type: String},
    bill_status : { type : String},
    restaurant_id : { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name : { type : String}
},{collection : 'bill'});

const Bill = mongoose.model('bill', billschema);

module.exports = Bill;