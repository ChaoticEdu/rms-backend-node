var express = require('express');
var router = express.Router();
var restaurantroute = require('./api/restaurant');
var menuroute = require('./api/menu')
var userroute = require('./api/user');
var tableroute = require('./api/table');
var orderroute = require('./api/order')
var billroute = require('./api/bill');
var categoryroute = require('./api/category');

router.use('/restaurant',restaurantroute);
router.use('/menu',menuroute);
router.use('/user',userroute);
router.use('/table',tableroute);
router.use('/order',orderroute);
router.use('/bill',billroute);
router.use('/category',categoryroute);

module.exports = router;