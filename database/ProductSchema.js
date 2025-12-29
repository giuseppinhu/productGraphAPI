const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: mongoose.Schema.Types.Decimal128,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity: Number,
});

module.exports = productSchema;
