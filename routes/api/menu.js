var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');
var Restaurant =require('../../models/restaurant_model');

router.get('/', async (req, res) => {
    try {
      // const variable_name = req.query.var_name;
      // const value = req.query.value;

      // if (!variable_name || !value) {
      //   return res.status(400).json({ message: 'Variable name and value are required' });
      // }
      const body = req.body;

      const search_query ={};
      
      for(const [key, value] of Object.entries(body)){
        if(key==='restaurant_id'){
          search_query[key]=value;
        }else{
          search_query[key]={ $regex: new RegExp(value, 'i') };
        }
      }
      
      console.log('Query:', search_query); //debug console

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