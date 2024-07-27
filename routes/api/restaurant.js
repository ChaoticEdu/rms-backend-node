var express = require('express');
var router = express.Router();
var db = require('../../db_con/conn');
var Restaurant = require('../../models/restaurant_model');
var verifytoken = require('../../auth/token');

router.get('/:restaurant_id', verifytoken,async (req, res) => {
    try {
      const restaurantId = req.params.restaurant_id;
      const search_query=[{
        restaurant_id: restaurantId
      }];



      let restaurants = await Restaurant.find(search_query);

      console.log('Results:', restaurants);//debug console

      res.json(restaurants);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/upload', async (req, res) => {
    try {
      console.log("Received request:", req.body);
  
      const { email, name, location, coordinates, phone, createdAt } = req.body;
  
      // Check for existing restaurant with the same email
      const existing = await Restaurant.findOne({ email });
  
      if (existing) {
        return res.status(400).json({ message: 'Registration failed: email already exists' });
      }
  
      // Create new restaurant record
      const newRestaurant = new Restaurant({
        name,
        location: {
          address: location.address,
          city: location.city,
          state: location.state,
          zip: location.zip
        },
        coordinates: {
          latitude: coordinates.latitude ?? null,
          longitude: coordinates.longitude?? null,
        },
        phone,
        email,
        createdAt: createdAt || Date.now()
      });
  
      // Save to database
      const savedRestaurant = await newRestaurant.save();
      res.status(201).json(savedRestaurant);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;





