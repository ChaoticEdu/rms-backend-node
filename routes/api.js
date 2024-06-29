var express = require('express');
var router = express.Router();
var restaurantroute = require('./api/restaurant');
var menuroute = require('./api/menu')
var userroute = require('./api/user');
var tableroute = require('./api/table');

router.use('/restaurant',restaurantroute);
router.use('/menu',menuroute);
router.use('/user',userroute);
router.use('/table',tableroute);

module.exports = router;