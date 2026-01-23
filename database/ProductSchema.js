const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
  },
  companieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companie",
    required: true,
  },
});

module.exports = productSchema;
