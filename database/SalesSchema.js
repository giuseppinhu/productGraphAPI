const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  saleDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = salesSchema;
