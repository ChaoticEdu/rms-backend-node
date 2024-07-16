var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Order = require('../../models/order');

// Route to get orders based on a query parameter
router.get('/', async (req, res) => {
    try {
        const search_query=[{
            restaurant_id: req.body.restaurant_id
        }];

        for(const key in req.body){
            if(key !== 'restaurant_id' && req.body.hasOwnProperty(key)){
                const value = typeof req.body[key] === 'string' ? {$regex : new RegExp(req.body[key], 'key')}: req.body[key];
                search_query.push({[key]:value});
            }
        }

        const orders = await Order.find(search_query);

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route to upload a new order
router.post('/upload', async (req, res) => {
    try {
        const neworder = new Order({
            menu_id: req.body.menu_id,
            user_id: req.body.user_id,
            table_name: req.body.table_name,
            item_name: req.body.item_name,
            item_quantity: req.body.item_quantity,
            order_date: req.body.order_date,
            order_status: req.body.order_status,
            bill_id: req.body.bill_id,
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name
        });
        const savedorder = await neworder.save();
        res.json(savedorder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
