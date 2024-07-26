var express = require('express');
var db = require('../../db_con/conn');
var Inventory = require('../../models/inventory');
var router = express.Router();

router.get('/:restaurant_id',async(req,res)=>{
    try{
        const restaurantid = req.params.restaurant_id;

        const search_query = {
            restaurant_id: restaurantid
        }

        const getinventory = await Inventory.find(search_query);

        res.status(200).json(getinventory);
    }catch(err){
        console.log({message: err.message});
    }

});

module.exports = router;