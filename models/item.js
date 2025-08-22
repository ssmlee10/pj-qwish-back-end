const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  name: {type: String, required: true},
  img: String,
  description: String,
  price: {type: Number, required: true},
  weight: {type: Number, min: 0, required: true},
  quantity: {type: Number, min: 0, max: 100},
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;