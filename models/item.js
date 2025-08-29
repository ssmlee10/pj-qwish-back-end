const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  product_id: { type: String, required: true },
  name: { type: String, required: true },
  img: String,
  description: String,
  price: { type: Number, required: true },
  weight: { type: Number, min: 0 },
  quantity: { type: Number, min: 0 },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;