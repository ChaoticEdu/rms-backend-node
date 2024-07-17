var express =require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Bill = require('../../models/bill');
var Order =require('../../models/order');

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
        const restaurantId = req.body.restaurant_id;
        const tablename = req.body.table_name;

        const query = {
            restaurant_id : restaurantId,
            table_name : tablename,
            bill_id : null
        }

        console.log(query);

        const orders = await Order.find({$and: query });

        let iteml= orders.map(order => order.item_name);

        console.log(iteml);
        

        const newbill = new Bill({
            item_list: iteml,
            total: req.body.total,
            discount: req.body.dis,
            bill_channel: req.body.channel,
            bill_status: 'processing',
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        console.log(newbill);

        const savedbill = await newbill.save();

        console.log('mongo : ',savedbill);

        const update = {
            bill_id: savedbill._id
        };

        const updatedOrders = await Order.updateMany(query, update);

        console.log(updatedOrders);
        
        res.json(savedbill);
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

module.exports = router;