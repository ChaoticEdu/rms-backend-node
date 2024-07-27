const express = require('express');
const router = express.Router();
const Menu = require('../models/menu_model');

const getMenuItemPrice = async (menuId) => {
    const menuItem = await Menu.findById(menuId);
    return menuItem ? menuItem.item_price : 0;
  };

module.exports = getMenuItemPrice;