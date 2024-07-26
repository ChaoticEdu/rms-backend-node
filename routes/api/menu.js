var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');
var image = require('../../models/image');
var Restaurant =require('../../models/restaurant_model');
var Category = require('../../models/category');
const upload = require('../../middleware/upload');

router.post('/upload',upload.single('image'), async(req, res)=>{
  try{


    const newmenu = new Menu({
      item_name : req.body.item_name,
      item_price : req.body.item_price,
      item_category: req.body.item_category,
      item_pic: req.file.filename,
      item_description: req.body.item_description,
      restaurant_id: req.body.restaurant_id,
      restaurant_name: req.body.restaurant_name
    });
    console.log('menu :',newmenu);

    const existingCategory = await Category.findOne({ item_name: req.body.item_name, restaurant_id: req.body.restaurant_id });

    if (existingCategory) {
        // If the category exists, send an error message
        return res.status(400).json({ message: 'Category already exists for this restaurant.' });
    }

    const savedtable = await newmenu.save();

    console.log('saved:',savedtable);
    if(req.file){
      const newimage= new image({
          image_name: req.file.filename,
          image_category: 'profile',
          image_category_id: savedtable._id,
          image_category_type: 'User'
      });
      const savedimage = await newimage.save();
    }

    

    res.status(201).json(savedtable);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

router.post('/update',upload.single('image'),async(req, res)=>{
  try{

    const menuid = req.body.menu_id;

    console.log("menu menu_id:",menuid);
    const original = await Menu.findById(menuid);

    const updatemenu ={
      item_name: req.body.item_name || original.item_name,
      item_price: req.body.item_price || original.item_price,
      item_category: req.body.item_category || original.item_category,
      item_pic: req.file.filename || original.item_pic,
      item_description: req.body.item_description || original.item_description,
      restaurant_id: req.body.restaurant_id || original.restaurant_id,
      restaurant_name: req.body.restaurant_name || original.restaurant_name
    };

    console.log("updated menu:",updatemenu);

    const updatedmenu = await Menu.findByIdAndUpdate(menuid,updatemenu,{new: true});

    console.log("updated menu object:",updatedmenu);
    if(req.file){
      const newimage= new image({
          image_name: req.file.filename,
          image_category: 'food',
          image_category_id: menuid,
          image_category_type: 'Menu'
      });
      const savedimage = await newimage.save();
      console.log("image saved");
    }

    res.status(200).json(updatedmenu);

  }catch(err){
    res.status(500).json({message: err.message});
  }


});

router.get('/:restaurant_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;

    const search_query = {
      restaurant_id: restaurantId,
    };

    console.log("why?"+search_query.restaurant_id);

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


router.get('/menubycat/:restaurant_id/:cat_id', async (req, res) => {
  try {
    const restaurantId = req.params.restaurant_id;
    const cat_id = req.params.cat_id;
    const search_query = {
      restaurant_id: restaurantId,
      item_category : cat_id
    };


    console.log(search_query);
    console.log("hello")

    let menu_item = await Menu.find(search_query); // Use findOne to get a single item

    console.log('Result:', menu_item);

    res.json(menu_item); // Send the single menu item object, not an array
  } catch (err) {
    res.status(500).json({ message: err.message });
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