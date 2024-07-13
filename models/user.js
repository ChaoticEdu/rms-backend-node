const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userschema =new Schema({
    user_name : {type : String, required : true},
    user_password : {type: String, required : true},
    user_phone_no : {type : Number},
    user_pic : {type : String},
    user_role : {type : String, required : true},
    pan_no:{type: Number},
    address:{type: String},
    restaurant_id : { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
    restaurant_name : { type : String},
},{collection : 'user'});

userschema.pre('save', async function(next){
    if(this.isModified('user_password')){
        const salt = await bcrypt.genSalt(10);
        this.user_password = await bcrypt.hash(this.user_password, salt);
    }
    next();
});

const User = mongoose.model('user',userschema);

module.exports = User;