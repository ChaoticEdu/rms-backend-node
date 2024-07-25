var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');
var Restaurant =require('../../models/restaurant_model');

router.get('/:restaurant_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;

    const search_query = {
      restaurant_id: restaurantId,
    };

    console.log(search_query);

    let menu_item = await Menu.find(search_query); // Use findOne to get a single item

    console.log('Result:', menu_item);

    res.json(menu_item); // Send the single menu item object, not an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:restaurant_id/:menu_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const menuid = req.params.menu_id;
    const search_query = {
      restaurant_id: restaurantId,
      _id : menuid
    };


    console.log(search_query);

    let menu_item = await Menu.findOne(search_query); // Use findOne to get a single item

    console.log('Result:', menu_item);

    res.json(menu_item); // Send the single menu item object, not an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/upload', async(req, res)=>{
  try{

    const newmenu = new Menu({
      item_name : req.body.item_name,
      item_price : req.body.item_price,
      item_category: req.body.item_category,
      item_pic: req.body.item_pic,
      item_description: req.body.item_description,
      restaurant_id: req.body.restaurant_id,
      restaurant_name: req.body.restaurant_name
    });
    console.log('menu :',newmenu);

    const savedtable = await newmenu.save();

    console.log('saved:',savedtable);

    res.status(201).json(savedtable);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

router.get('/delete/:restuarant_id/:menu_id?',async(req, res)=>{
  try{
    const restaurantid = req.body.restaurant_id;
    const menuid = req.body.menu_id;

    const search_query= {
      restaurant_id: restaurantid,
      _id: menuid
    }

    const deletedmenu = await Menu.deleteOne(search_query);

    res.json(deletedmenu);

  }catch(err){
    res.status(500).json({message: err.message});
  }
});

module.exports = router;