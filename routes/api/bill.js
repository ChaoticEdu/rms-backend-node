var express =require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Bill = require('../../models/bill');
var Menu = require('../../models/menu_model');
var Order =require('../../models/order');
var json2pdf = require('../../middleware/j2p');

router.get('/:restaurant_id/:bill_id?', async (req, res) => {
    try {
      console.log("hello ");
      const billId = req.params.bill_id;
  
      const bills = await Bill.findById(billId);
  
      if (!bills) {
        console.log('Bill not found');
        return;
      }
  
      const itemNames = bills.item_list;
  
      const menuItems = await Menu.find({ item_name: { $in: itemNames } });
  
      const detailedItems = itemNames.map(itemName => {
        const menuItem = menuItems.find(item => item.item_name === itemName);
        const detailedItem = menuItem ? {
          item_name: menuItem.item_name,
          item_price: menuItem.item_price,
        } : { item_name: itemName };
  
        console.log('Detailed Item:', detailedItem);

        return detailedItem;
      });
  
      const detailedBill = {
        ...bills.toObject(),
        item_list: detailedItems
      };

      console.log('Bill Details:', detailedBill);
  
      res.json(detailedBill);
  
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: err.message });
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

        res.status(200).json(updatedOrders);
        
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

router.post('/update', async(req, res)=>{
    try{
        const billId = req.body.bill_id;
        // const query = {
        //     restaurant_id : restaurantId,
        //     table_name : tablename,
        //     bill_id : null
        // }

        // console.log(query);



        const original = await Order.findById(billId);




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

        const fileconverted = await PDF(updatedOrders);
        
        res.contentType('application/pdf');
        res.send(fileconverted);
        
    }catch(err){
        res.status(500).json({message: res.message});
    }
});

// router.post('/pdf', async (req, res) => {
//     try {
//         const jsondata = req.body;
//         const fileconverted = await json2pdf(jsondata);

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
//         res.send(fileconverted);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

router.post('/pdf', async (req, res) => {
    try {
        const jsondata = req.body;
        const pdfBlob = await json2pdf(jsondata);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
        
        const buffer = await pdfBlob.arrayBuffer();
        res.send(Buffer.from(buffer));
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;