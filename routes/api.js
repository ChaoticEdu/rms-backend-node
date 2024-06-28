var express = require('express');
var router = express.Router();
var restaurantroute = require('./api/restaurant');
var menuroute = require('./api/menu')

router.use('/restaurant',restaurantroute);
router.use('/menu',menuroute);

module.exports = router;