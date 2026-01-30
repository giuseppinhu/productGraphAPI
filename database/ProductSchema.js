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
  categorie: {
    type: String,
    default: "none"
  },
  quantity: {
    type: Number,
  },
  SKU: {
    type: String,
    default: "TESTE-SKU",
    required: true
  },
  companieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Companie",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = productSchema;
