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
        

        const { table_name, restaurant_id, restaurant_name, table_status } = req.body;

        

        const existingTable = await Table.findOne({ table_name, restaurant_id });

        if (existingTable) {
            // If the category exists, send an error message
            return res.status(400).json({ message: 'Category already exists for this restaurant.' });
        }
        const newtable = new Table({
            table_name,
            restaurant_id,
            restaurant_name,
            table_status
        });

    const savedtable = await newtable.save();
    res.status(201).json(savedtable);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});

router.post('/update', async(req, res)=>{
    try{
        const tableid =req.body.table_id;
        const original = await Table.findById(tableid);

        const updatetable = {
            table_name : req.body.table_name || original.table_name,
            table_status : req.body.table_status || original.table_status,
            restaurant_id: req.body.restaurant_id || original.restaurant_id,
            restaurant_name: req.body.restaurant_name || original.restaurant_name
        }

        const updatedtable = await Table.findByIdAndUpdate(tableid, updatetable, {new: true});

        res.json(updatedtable);

    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:restaurant_id/:table_id',async(req,res)=>{
    try{
        const restaurantid = req.params.restaurant_id;
        const tableid =req.params.table_id;

        const search_query= {
            restaurant_id: restaurantid,
            _id: tableid
        }

        const deltable = await Table.deleteOne(search_query);

        res.json(deltable);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/delete/:restaurant_id/:table_id', async (req, res) => { 
     // Changed to DELETE method
   
    try {
        const restaurantid = req.params.restaurant_id;
        const tableid = req.params.table_id;
        console.log(restaurantid,tableid)

        // Construct the query object
        const search_query = {
            restaurant_id: restaurantid,
            _id: tableid
        };

        // Delete the document from the Table collection
        const deltable = await Table.deleteOne(search_query);

        if (deltable.deletedCount === 0) {
            // No document was deleted, meaning no matching document was found
            return res.status(404).json({ message: 'Table not found.' });
        }

        // Successfully deleted
        res.json({ message: 'Table deleted successfully.', result: deltable });
    } catch (err) {
        // Handle any errors that occurred during the process
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;