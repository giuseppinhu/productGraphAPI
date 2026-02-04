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
      const prefix = data.name.substring(0, 3).toUpperCase();
      const random = Math.floor(1000 + Math.random() * 9000); // 4 dígitos aleatórios
      data.SKU = `${prefix}-${random}`;

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

  async dataProducts(companieId, page = 1, limit = 15, search = '') {
    try { 
      const matchCondition = {
        companieId: new mongoose.Types.ObjectId(companieId),
        ...(search && search.trim() !== ""
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { SKU: { $regex: search, $options: "i" } },
              ]
            }
          : {}),
      };

      const products = await ProductModel.aggregate([
        { $match: matchCondition },
        {
          $facet: {
            metadata: [
            {
              $group: {
                _id: null,
                countDocs: { $sum: 1 },
                totalQuantity: { $sum: "$quantity" },
                totalPrice: { $sum: "$price" },
                total: {
                  $sum: {
                    $multiply: ["$price", "$quantity"]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0,
                total: { $toDouble: "$total" },
                totalQuantity: "$totalQuantity",
                totalPrice: { $toDouble: "$totalPrice" },
                countDocs: 1
              }
            }
          ],
            data: [
              {
                $project: {
                  id: 1,
                  price:  { $toDouble: "$price" },
                  name: 1,
                  description: 1,
                  categorie: 1,
                  quantity: 1,
                  SKU: 1,
                  total: 1,
                  product_url: 1
                }
              },
              { $skip: 0 }, { $limit: 15 }
            ],
          },
        }
      ])

      const totalDocs = await ProductModel.countDocuments({companieId})

      return { products, totalDocs  }
    } catch (error) {
      throw new Error("Error in data products")
    }
  }

  async updateAvatar(id, url) {
    try {
      const result = await this.findById(id);

      if (!result) {
        return { message: "Product not found" };
      }

      const user = await ProductModel.updateOne({ _id: id }, { product_url: url });

      if (!user) {
        return { sucess: false };
      }

      return { sucess: true };
    } catch (error) {
      throw new Error("Error update avatar");
    }
  }

  async update(data){
    try{
      const result = await ProductModel.findByIdAndUpdate(data.id, data)
      
      return result
    } catch (error) {
      throw new Error("Error in update data User" + error)
    }
  }
}

module.exports = new Product();
