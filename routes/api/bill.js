var express =require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Bill = require('../../models/bill');
var Menu = require('../../models/menu_model');
var Order =require('../../models/order');
var json2pdf = require('../../middleware/j2p');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

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

        console.log(`Channel: ${req.body.channel}`);
        
        const billstatus = req.body.channel === "cash" ? "done":"processing"; 

        console.log(`Bill Status: ${billstatus}`);

        const newbill = new Bill({
            item_list: iteml,
            total: req.body.total,
            discount: req.body.dis,
            bill_channel: req.body.channel,
            bill_status: billstatus,
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

        res.status(200).json(newbill);
        
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
            discount: req.body.dis || 0,
            bill_channel: req.body.channel,
            bill_status: 'processing',
            restaurant_id: req.body.restaurant_id,
            restaurant_name: req.body.restaurant_name || 'cafe'
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



router.post('/pdf', async (req, res) => {
    try {
        // Fetch the bill by its ID
        const bill = await Bill.findById(req.body.billId);

        console.log("bill   : ",bill);

        if (!bill) {
            return res.status(404).send('Bill not found');
        }

        // Fetch the menu items by their names in item_list
        const menuItems = await Menu.find({
            item_name: { $in: bill.item_list }
        }).select('item_name item_price');

        console.log("menu items   :  ",menuItems);

        // Map the menu items to a format suitable for display
        const itemDetails = menuItems.map(item => ({
            name: item.item_name,
            price: item.item_price
        }));

        console.log(" item tails  : ",itemDetails);

        // Create the PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 50;

        // Embed the font
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Helper function to calculate text width
        const getTextWidth = (text) => font.widthOfTextAtSize(text, fontSize);

        // Determine the maximum width of labels
        const labels = [
            'Bill ID:', 'Restaurant Name:', 'Table Name:', 
            'Total:', 'Discount:', 'Channel:', 'Status:'
        ];
        const maxLabelWidth = Math.max(...labels.map(label => getTextWidth(label)));

        // Function to draw label and value with aligned values
        const drawLabelValue = (label, value, y, spacing) => {
            const labelWidth = getTextWidth(label);
            page.drawText(label, {
                x: margin,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
            page.drawText(value, {
                x: width - margin - getTextWidth(value) - spacing, // Align value to the right
                y: y,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        };

        // Add bill information to the PDF
        drawLabelValue('Bill ID:', `${bill._id}`, height - 50, margin + maxLabelWidth);
        drawLabelValue('Restaurant Name:', bill.restaurant_name || "CAFE", height - 70, margin + maxLabelWidth);
        drawLabelValue('Table Name:', req.body.table_name, height - 90, margin + maxLabelWidth);

        // Add items to the PDF
        page.drawText(`Items:`, {
            x: margin,
            y: height - 110,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
        });

        itemDetails.forEach((item, index) => {
            page.drawText(`${index + 1}. ${item.name} - $${item.price.toFixed(2)}`, {
                x: margin,
                y: height - 130 - (index * 20),
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        });

        // Add total, discount, and other details
        drawLabelValue('Total:', `$${bill.total.toFixed(2)}`, height - 150 - (itemDetails.length * 20), margin + maxLabelWidth);
        drawLabelValue('Discount:', bill.discount ? `$${bill.discount.toFixed(2)}` : 'None', height - 170 - (itemDetails.length * 20), margin + maxLabelWidth);
        drawLabelValue('Channel:', bill.bill_channel, height - 190 - (itemDetails.length * 20), margin + maxLabelWidth);
        drawLabelValue('Status:', bill.bill_status, height - 210 - (itemDetails.length * 20), margin + maxLabelWidth);

        // Save the PDF and send it to the client
        const pdfBytes = await pdfDoc.save();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=bill.pdf',
        });

        res.status(200).send(Buffer.from(pdfBytes));

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});


module.exports = router;