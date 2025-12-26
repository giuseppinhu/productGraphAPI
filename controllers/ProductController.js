const Product = require("../models/Product");

class ProductController {
  async createProduct(req, res) {
    try {
      const data = req.body;
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
}

module.exports = new ProductController();
