var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');
var Restaurant =require('../../models/restaurant_model');

router.get('/', async (req, res) => {
    try {
      const search_query=[{
        restaurant_id: req.body.restaurant_id
    }];

    for(const key in req.body){
        if(key !== 'restaurant_id' && req.body.hasownproperty(key)){
            const value = typeof req.body[key] === 'string' ? {$regex : new Regex(req.body[key], 'key')}: req.body[key];
            search_query.push({[key]:value});
        }
    }
      const menu_item = await Menu.find(search_query);

      console.log('Results:', menu_item);//debug console

      res.json(menu_item);
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
    }
    );
    console.log('menu :',newmenu);

    const savedtable = await newmenu.save();

    console.log('saved:',savedtable);

    res.status(201).json(savedtable);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

module.exports = router;