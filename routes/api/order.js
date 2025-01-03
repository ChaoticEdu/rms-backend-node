const express = require('express');
const router = express.Router();
const Order = require('../../models/order');
const getMenuItemPrice = require('../../middleware/menu');


router.get('/:restaurant_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const search_query = { restaurant_id: restaurantId };
    const orders = await Order.find(search_query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload', async (req, res) => {
  try {

    const ordersWithPrices = await Promise.all(req.body.orders.map(async (order) => {

      const itemPrice = await getMenuItemPrice(order.menu_id);

      return {
        ...order,
        item_price: itemPrice,
        total_price: itemPrice
      };
    }));

    const ordersToSave = ordersWithPrices.map(order => new Order(order));
    
    const savedOrders = await Order.insertMany(ordersToSave);

    const response = {
      message: 'Orders created successfully',
      orders: savedOrders
    };

    savedOrders.forEach(order => {
      console.log(`Emitting 'newOrder' to room ${order.restaurant_id}:`, order);
      req.io.to(order.restaurant_id.toString()).emit('newOrder', order);
      console.log(order._id);
    });

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get('/:restaurant_id/:table_name/', async (req, res) => {
  try {
    const { restaurant_id, table_name} = req.params;
    
    const search_query = {
      restaurant_id,
      table_name,
      bill_id:null
    };
    const orders = await Order.find(search_query);
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/statusupdate', async (req, res) => {
  try {
    const { _id, restaurant_id, status } = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const updatedOrder = {
      restaurant_id,
      order_status: status
    };

    console.log('Updating order with:', updatedOrder);

    const orderUpdated = await Order.findByIdAndUpdate(_id, updatedOrder, { new: true });

    console.log(orderUpdated.restaurant_id.toString());

    if (!orderUpdated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Order updated:', orderUpdated);

    if (orderUpdated.restaurant_id) {
      req.io.to(orderUpdated.restaurant_id.toString()).emit('newStatus', orderUpdated);
      const ii = orderUpdated._id.toString();
      console.log(ii);
    } else {
      console.error('restaurant_id is not present in the updated order');
    }

    res.status(200).json(orderUpdated);

  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: err.message });
  }
});


router.post('/update', async (req, res) => {
  try {
    if (!req.body.orders || !Array.isArray(req.body.orders)) {
      return res.status(400).json({ message: 'Missing orders in request body' });
    }

    const ordersToUpdate = req.body.orders;
    const updatedOrders = [];

    for (const order of ordersToUpdate) {
      const updatedOrder = await Order.findByIdAndUpdate(order._id, order, { new: true });
      if (updatedOrder) {
        updatedOrders.push(updatedOrder);
        req.io.to(updatedOrder.restaurant_id.toString()).emit('orderUpdated', updatedOrder);
      }
    }

    res.json({ message: 'Orders updated successfully', orders: updatedOrders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/delete/:restaurant_id/:id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const orderId = req.params.id;

    const query = {
      restaurant_id: restaurantId,
      _id: orderId
    };

    const deletedOrder = await Order.deleteOne(query);

    // Emit the deletion to the restaurant room
    req.io.to(restaurantId).emit('orderDeleted', orderId);

    res.status(201).json({ message: 'Order deleted', deletedOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
