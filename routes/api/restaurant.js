var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Restaurant = require('../../models/restaurant_model');
var verifytoken = require('../../auth/token');

router.get('/', verifytoken,async (req, res) => {
    try {
      const search_query=[{
        resytaurant_id: req.body.resytaurant_id
      }];

      for(const key in req.body){

        if(key !== 'restuarant_id' && req.body.hasownproperty(key)){
          const value = typeof req.body[key] === 'string' ? {$regex: new Regex(req.body[key], 'i')}: req.body[key];
          search_query.push({[key]:value});
        }

      }

      const restaurants = await Restaurant.find(search_query);

      console.log('Results:', restaurants);//debug console

      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.post('/upload', async(req,res)=>{
    try{
      const newrestaurants = new Restaurant({
        name: req.body.name,
        location: {
          address: req.body.location.address,
          city: req.body.location.city,
          state: req.body.location.state,
          zip: req.body.location.zip
        },
        coordinates: {
          latitude: req.body.location.coordinates.latitude,
          longitude: req.body.location.coordinates.longitude
        },
        phone: req.body.phone,
        email: req.body.email,
        createdAt: req.body.createdAt || Date.now()
      });
      const savedrestaurant = await newrestaurants.save();
      res.status(201).json(savedrestaurant);
    }catch(err){
      res.status(500).json({message:err.message});
    }
  });

module.exports = router;





