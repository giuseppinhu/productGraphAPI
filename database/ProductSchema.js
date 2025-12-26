const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity: Number,
});

module.exports = productSchema;
