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

router.post('/upload',async(req, res)=>{
    try{

        const reqInvtdata = {
            item_name : req.body.item_name,
            rate: req.body.rate,
            suppliers_name: req.body.suppliers_name,
            restaurant_id: req.body.restaurant_id
        };

        const original = await Inventory.findOne(reqInvtdata);

        if(original){
            return res.status(403).json({message:"Already exists"})
        }

        const updateInventory = new Inventory({
            item_name: req.body.item_name,
            quantity: req.body.quantity,
            description: req.body.description,
            suppliers_name: req.body.suppliers_name,
            rate: req.body.rate,
            restaurant_id: req.body.restaurant_id,
            restaruant_name: req.body.restaruant_name
        });

        const savedInventory = await updateInventory.save();

        res.status(200).json(savedInventory);
    }catch(err){
        res.status(500).json({message: err.message});
    }

});

router.post('/update',async(req, res)=>{
    try{

        const invtId = req.body.Invt_id;
        const original = await Inventory.findById(invtId);

        if(!original){
            return res.status(404).json({message: "Inventory data not found"});
        }

        const updateInvt ={
            item_name: req.body.item_name || original.item_name,
            quantity: req.body.quantity || original.quantity,
            description: req.body.description || original.description,
            suppliers_name: req.body.suppliers_name || original.supplires_name,
            rate: req.body.rate || original.rate,
            restaurant_id: req.body.restaurant_id || original.restaurant_id,
            restaruant_name: req.body.restaruant_name || original.restaruant_name
        };

        const updatedInvt = await Inventory.findByIdAndUpdate(invtId, updateInvt,{new: true});

        res.status(200).json(updatedInvt);

    }catch(err){
        res.status(500).json({message: err.message});
    }


});


router.get('/delete/:restaurant_id/:Invt_id',async(req, res)=>{
    try{
        
        const invtId = req.params.Invt_id;

        if(!invtId){
            return res.json("Inventory id missing");
        }

        const delInvt = await Inventory.findByIdAndDelete(invtId);

        if(!delInvt){
            return res.status(404).json({message: "Inventory data could be found"});
        }

        res.status(200).json(delInvt);

    }catch(err){
        res.status(500).json({message: err.meessage});
    }
});

module.exports = router;