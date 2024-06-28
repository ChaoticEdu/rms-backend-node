const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const restaurantSchema = new Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: Number },
  },
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  phone: { type: String },
  email: { type: String },
  createdAt: { type: Date },
}, { collection: 'restaurant' });

// Create a model based on the schema
const Restaurant = mongoose.model('restaurant', restaurantSchema);

module.exports = Restaurant;