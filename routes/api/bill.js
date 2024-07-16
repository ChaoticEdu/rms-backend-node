var express =require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Bill = require('../../models/bill');

router.get('/:restaurant_id/:bill_id?', async(req, res)=>{
    try{
        const restaurantId = req.params.restaurant_id;
        const billId = req.params.bill_id;
        const search_query={
            restaurant_id: restaurantId
        };

        if(req.params.bill_id){
            bill_id: billId
        }

        const bills= await bill.find(search_query);

        res.json(bills);

    }catch(err){
        res.status(500).json({message: res.message});
    }
});

router.post('/upload', async(req, res)=>{
    try{
        const newbill = new Bill({
            item_list: req.body.item_list,
            total: req.body.total,
            discount: req.body.dis,
            bill_channel: req.body.channel,
            bill_status: req.body.status,
            restauurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const savedbill = await newbill.save();
        res.json(savebill);
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

module.exports = router;