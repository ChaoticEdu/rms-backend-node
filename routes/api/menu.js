var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');
var Restaurant =require('../../models/restaurant_model');

router.get('/:restaurant_id/:name?', async (req, res) => {
    try {
        const restaurantId = req.params.restaurant_id;
        const itemname = req.params.name;
        const search_query={
            restaurant_id: restaurantId
        };
        if(req.params.name){
          search_query.item_name= itemname;
        }

        console.log(search_query);

        let menu_item = await Menu.find(search_query);

        console.log('Results:', menu_item);

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
    });
    console.log('menu :',newmenu);

    const savedtable = await newmenu.save();

    console.log('saved:',savedtable);

    res.status(201).json(savedtable);
  }catch(err){
    res.status(500).json({message: err.message});
  }
});

module.exports = router;