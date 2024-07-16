var express = require('express');
var router =express.Router();
var db = require('../../db_con/conn');
var Category = require('../../models/category');

router.get('/',async(req, res)=>{
    try{
        const search_query=[{
            restaurant_id: req.body.restaurant_id
        }];

        for(const key in req.body){
            if(key !== 'restaurant_id' && req.body.hasownproperty(key)){

                const value = typeof req.body[key] === 'string' ? {$regex : new RegExp(req.body[key],'key')}:req.body[key];
                search_query.push({[key]:value});
            }
        const category = await Category.find({$and:search_query});

        res.json(category);
        }

    }catch(err){
        res.status(500).json({message: err.message});
    }

});