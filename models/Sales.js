const mongoose = require("mongoose");
const SalesSchema = require("../database/SalesSchema");
const SalesModel = mongoose.model("Sales", SalesSchema);

const Product = require("./Product");

class Sales {
  async create(data) {
    try {
      const newSale = new SalesModel(data);
      await newSale.save();

      const result = await Product.updateQuantity(
        data.productId,
        data.quantity
      );

      if (!result.success) {
        return { success: false, message: result.message };
      }

      return newSale;
    } catch (error) {
      throw new Error("Error creating sale: " + error.message);
    }
  }
}

module.exports = new Sales();
