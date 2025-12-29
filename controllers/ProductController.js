const Product = require("../models/Product");

class ProductController {
  async createProduct(req, res) {
    try {
      const data = req.body;

      if (data.quantity === undefined) {
        res.status(406).json({ message: "Value not accepted." });
        return;
      }

      if (
        data.name === undefined ||
        data.name === " " ||
        data.name.length < 2 ||
        data.name.length > 100
      ) {
        res.status(406).json({ message: "Value not accepted." });
        return;
      }

      if (data.price === undefined || isNaN(data.price) || data.price < 0) {
        res.status(406).json({ message: "Value not accepted." });
        return;
      }

      const product = await Product.create(data);

      res
        .status(201)
        .json({ message: "Product created successfully", product });
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.body;
      const result = await Product.delete(id);

      if (!result) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res
          .status(200)
          .json({ message: "Product deleted successfully", result });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting product", error });
    }
  }

  async findAllProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products", error });
    }
  }
}

module.exports = new ProductController();
