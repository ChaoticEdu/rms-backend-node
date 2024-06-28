var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Menu = require('../../models/menu_model');

router.get('/', async (req, res) => {
    try {
      const variable_name = req.query.var_name;
      const value = req.query.value;

      if (!variable_name || !value) {
        return res.status(400).json({ message: 'Variable name and value are required' });
      }

      const search_query ={};
      search_query[variable_name]={ $regex: new RegExp(value, 'i') };

      console.log('Query:', search_query); //debug console

      const menu_item = await Menu.find(search_query);

      console.log('Results:', restaurants);//debug console

      res.json(menu_item);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;