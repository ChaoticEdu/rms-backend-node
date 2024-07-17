var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Order = require('../../models/order');
var Bill = require('../../models/bill');
const Joi = require('joi');

router.get('/:restaurant_id', async (req, res) => {
    try {
        const restaurantId = req.params.restaurant_id;
        const search_query={
            restaurant_id: restaurantId
        };


        const orders = await Order.find(search_query);

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/upload', async (req, res) => {
    try {
      const orderS = Joi.array().items({
        menu_id: Joi.string().required(),
        user_id: Joi.string().required(),
        table_name: Joi.string().required(),
        item_name: Joi.string().required(),
        item_quantity: Joi.number().integer().min(1).required(),
        order_date: Joi.date().iso().required(),
        order_status: Joi.string().valid('Pending', 'Done').required(),
        bill_id: Joi.string().allow(null).optional(),
        restaurant_id: Joi.string().required(),
        restaurant_name: Joi.string().required()
      });
  
      // const { error } = orderS.validate(req.body.orders, { abortEarly: false });
  
      // if (error) {
      //   const validationErrors = error.details.map(detail => ({
      //     message: detail.message,
      //     path: detail.path
      //   }));
      //   return res.status(400).json({ message: 'Validation errors:', errors: validationErrors });
      // }
  
      if (!req.body.orders || !Array.isArray(req.body.orders)) {
        return res.status(400).json({ message: 'Missing orders in request body' });
      }
      const ordersToSave = req.body.orders.map(order => new Order(order));
      const savedOrders = await Order.insertMany(ordersToSave);
  
      const response = {
        message: 'Orders created successfully',
        orders: savedOrders
      };
      res.json(response);
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.post('/update', async(req, res)=>{



});

router.get('/delete/:restaurant_id/:id',async(req, res)=>{
    try{

        const restaurantid = req.params.restaurant_id;
        const orderid = req.params.id;

        const query={
            restaurant_id : restaurantid,
            _id : orderid
        }

        const deletedorder = await User.deleteOne(query);

        res.status(201).json({message: 'user delete',deletedorder});

    }catch(err){
        res.status(500).json({message: err.meassage});
    }
});

module.exports = router;
