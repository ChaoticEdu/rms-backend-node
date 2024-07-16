var express = require('express');
var mongoose = require('mongoose');
// var ObjectId = require('mongoose').ObjectId;
var router = express.Router();
var db= require('../../db_con/conn');
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var dotenv = require('dotenv');
dotenv.config();

router.get('/:restaurant_id/:name?',async(req, res)=>{
    try{

        const restaurantId = req.params.restaurant_id;
        let query = { restaurant_id: restaurantId };

        if (req.params.name) {
            query.user_name = req.params.name;
        }
        console.log(query);
        
        let users = await User.find(query);

        res.json(users);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.post('/registration', async(req, res) => {
    try{
        const newuser = new User({
            user_name: req.body.name,
            email: req.body.email,
            user_password: req.body.password,
            user_phone_no: req.body.phone_no,
            user_pic: req.body.pic,
            user_role: req.body.position,
            pan_no: req.body.pan_no,
            address: req.body.address,
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const existing = await User.findOne({$or : [{pan_no: newuser.pan_no},{email: newuser.email}]});
        if(existing){
            return res.status(400).json({message: ' registration failed as user is not unique or pan number isnt'});
        }
        const saveduser = await newuser.save();
        if(process.env.JWT_SECRET){
            const payload = {userID : saveduser._id};

            const data = {
                role : User.role,
                restaurant_id : User.restaurant_id,
                restuarant_name : User.restaurant_name,

            }

            const secrete = process.env.JWT_SECRET;
            const token = jwt.sign(payload,secrete, {expiresIn: '24h'})
            res.status(201).json({message: 'Registration sucessful',token});
        }
        else{
            res.status(201).json({message: 'Resgistration sucessful without jwt'})
        }
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.post('/login', async (req, res)=> {

    try{

        const logged = { 
            email: req.body.email,
            password: req.body.password
        };
        const  founduser = await User.findOne({email: logged.email});
        if(!founduser){
            return res.status(401).json({message: 'user not found'});
        }

        const validatepass = await bcrypt.compare(logged.password, founduser.user_password);

        if(!validatepass){
            return res.status(401).json({message: ' wrong password '});
        }
        if(process.env.JWT_SECRET){
            const payload = {userId: founduser._id};

            const data = {
                role : founduser.user_role,
                user_id : founduser._id,
                restaurant_id : founduser.restaurant_id,
                restaurant_name : founduser.restaurant_name
            }

            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret, {expiresIn: '24h'});
            res.status(201).json({message: 'logged in', token,data});
        }else{
            res.status(201).json({message: ' logged in without jwt token'});
        }

    }catch(err){

        res.status(500).json({message: err.message});

    }

});

module.exports = router;