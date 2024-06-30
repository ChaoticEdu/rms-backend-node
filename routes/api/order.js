var express = require('express');
var router = express.Router();
var db = require('../..db_con/conn');
var Order = require('../../models/order');

router.get('/',async(req, res)=>{
    try{
        const variable_name = req.query.var_name;
        const value = req.query.value;
        if(!variable_name || !value){
            res.status(400).json({message: 'variable namme and value are required'});
        }
        const search_query= {};
        search_query[variable_name]={$regex : new RegExp(value, 'i')};
    
        const orders= await Order.find(search_query);
    
        res.json(orders);
    }catch(err){
        res.status(500).json({message: res.message});
    }

});

router.post('/upload', async(req, res)=>{
    try{
        const neworder = new Order({
            menu_id : req.body.menu_id,
            user_id : req.body.user_id,
            table_name: req.body.table_name,
            item_name: req.body.item_name,
            item_quatity: req.body.item_amount,
            order_date: req.body.date,
            order_status: req.body.status,
            bill_id: req.body.bill_no,
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const savedorder = await neworder.save();
        res.json(savedorder);
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

modules.export = router;
