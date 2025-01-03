const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoryschema = new Schema({

    name: { type: String , required: true},
    restaurant_id : {type:mongoose.Schema.Types.ObjectId, ref: 'restaurant'},
    restaurant_name:{type: String}

},{collection:'category'});

const Category = mongoose.model('category', categoryschema);

module.exports = Category;