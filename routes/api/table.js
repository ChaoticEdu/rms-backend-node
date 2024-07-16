const express = require('express');
const router = express.Router();
var db = require('../../db_con/conn');
var Table = require('../../models/table');

router.get('/', async(req , res)=>{
    try{
        const variable_name = req.query.var_name;
        const value = req.query.value;
    if(!variable_name || !value){
        return res.status(400).json({message: 'variable name and value are required'});
    }
    const search_query = {};
    for(const [key, value] of Object.entries(body)){
        if(key==='restaurant_id'){
          search_query[key]=value;
        }else{
          search_query[key]={ $regex: new RegExp(value, 'i') };
        }
      }
    const tables = await Table.find(search_query);
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