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
        { new: true }
      );

      return { success: true };
    } catch (error) {
      throw new Error("Error updating product quantity: " + error.message);
      return false;
    }
  }

  async findById(id) {
    try {
      const product = await ProductModel.findById(id)
      return product
    } catch (error) {
       throw new Error("Error retrieving product: " + error.message);
    }
  }

  async findLatest(data){
    let products = {}

    data.forEach(async item =>  {
      const product = await this.findById(String(item.productId))
      console.log(product)
    })

    return products
  }
}

module.exports = new Product();
