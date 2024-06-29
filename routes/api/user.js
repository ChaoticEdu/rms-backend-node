var express = require('express');
var router = express.Router();
var db= require('../../db_con/conn');
var User = require('../../models/user');

router.get('/',async(req, res)=>{
    try{
        const  variable_name = req.query.var_name;
        const value = req.query.value;
        if(!variable_name || !value){
            return res.status(400).json({message: 'variable name and vlaue are required'});
        }
        const search_query={};
        search_query[variable_name]={$regex: new RegExp(value, 'i')};

        const users= await User.find(search_query);

        res.json(users);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/upload', async(req, res) => {
    try{
        const newuser = new User({
            user_name: req.body.name,
            user_phone_no: req.body.phone_no,
            user_pic: req.body.pic,
            user_role: req.body.position,
            pan_no: req.body.pan_no,
            address: req.body.address,
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const saveduser = await newuser.save();

        res.status(201).json(saveduser);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;