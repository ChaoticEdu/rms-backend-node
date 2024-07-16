const express = require('express');
const router = express.Router();
var db = require('../../db_con/conn');
var Table = require('../../models/table');

router.get('/:restaurant_id/:table_name?', async(req , res)=>{
    try{
    const restaurantId = req.params.restaurant_id;
    const tablename = req.params.table_name;
    const search_query = {
        restaurant_id: restaurantId
    };

    if(req.params.table_name){
        search_query.table_name = tablename;
    }

    let tables = await Table.find(search_query);

    res.json(tables);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
});

router.post('/upload',async(req , res)=>{
    try{
        const newtable = new Table({
            table_name: req.body.table_name,
            table_status: req.body.table_status,
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        })
    const savedtable = await newtable.save();
    res.status(201).json(savedtable);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

module.exports = router;