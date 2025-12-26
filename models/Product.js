const mongoose = require("mongoose");
const ProductSchema = require("../database/ProductSchema");
const ProductModel = mongoose.model("Product", ProductSchema);

class Product {
  async create(data) {
    try {
      const { name, price, description, quantity } = data;

      const product = new ProductModel({
        name,
        price,
        description,
        quantity,
      });

      await product.save();
      return product;
    } catch (error) {
      throw new Error("Error creating product: " + error.message);
    }
  }

  async delete(id) {
    try {
      const result = await ProductModel.findByIdAndDelete(id);

      if (result != undefined) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error("Error deleting product: " + error.message);
    }
  }
}

module.exports = new Product();
