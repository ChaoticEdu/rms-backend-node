const express = require('express');
const router = express.Router();
var db = require('../../db_con/conn');
var Table = require('../../models/table');

router.get('/', async(req , res)=>{
    try{
    const search_query = [{
        restaurant_id: req.body.restaurant_id
    }];

    for(const key in req.body){
        if(key!== 'restaurant_id' && req.body.hasownproperty(key)){
            const value = typeof req.body[key] === 'sting' ? {$regex :new RegExp(req.body[key], 'i')}: req.body[key];
            search_query.push({[key]:value});
        }
    }

    const tables = await Table.find({$and:search_query});
    res.json(tables);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.post('/upload',async(req , res)=>{
    try{
        const newtable = new Table({
            table_name: req.body.name,
            table_status: req.body.status,
            restaurant_id: req.body.res_id,
            restaurant_name: req.body.res_name
        })
    const savedtable = await newtable.save();
    res.status(201).json(savedtable);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;