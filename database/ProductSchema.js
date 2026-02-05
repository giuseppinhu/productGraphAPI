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
  product_url: {
    type: String,
    default:
      "https://res.cloudinary.com/dhn5ceymi/image/upload/v1769785236/caixa_ipbl5e.png",
  },
  description: {
    type: String,
  },
  categorie: {
    type: String,
    default: "none",
  },
  quantity: {
    type: Number,
  },
  SKU: {
    type: String,
    default: "NONE-SKU",
    unique: true,
    uppercase: true,
    trim: true,
    required: true,
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
