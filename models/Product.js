const mongoose = require("mongoose");
const ProductSchema = require("../database/ProductSchema");
const ProductModel = mongoose.model("Product", ProductSchema);

class Product {
  async findAll() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Error retrieving products: " + error.message);
    }
  }

  async create(data) {
    try {
      const product = new ProductModel(data);

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

  async updateQuantity(id, quantity) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        return { success: false, message: "Product not found" };
      }

      if (product.quantity < quantity) {
        return { success: false, message: "Insufficient product quantity" };
      }

      await ProductModel.findByIdAndUpdate(
        id,
        { $inc: { quantity: -quantity } },
        { new: true },
      );

      return { success: true };
    } catch (error) {
      throw new Error("Error updating product quantity: " + error.message);
      return false;
    }
  }

  async findById(id) {
    try {
      const product = await ProductModel.findById(id).select(
        "name price createdAt",
      );
      return product;
    } catch (error) {
      throw new Error("Error retrieving product: " + error.message);
    }
  }

  async findLatest(data) {
    try {
      const products = await Promise.all(
        data.map(async (item) => {
          return await this.findById(String(item.productId));
        }),
      );

      return products.filter(Boolean);
    } catch (error) {
      throw new Error("Error retrieving latest products: " + error.message);
    }
  }
}

module.exports = new Product();
