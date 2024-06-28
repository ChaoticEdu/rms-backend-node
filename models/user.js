const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userschema =new Schema({
    user_name : {type : String, required : true},
    user_phone_no : {type : Number},
    user_pic : {type : String},
    user_role : {type : String, required : true},
},{collection : 'user'});

const User = mongoose.model('user',userschema);

module.exports = User;