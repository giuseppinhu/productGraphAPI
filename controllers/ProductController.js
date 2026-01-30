const Companie = require("../models/Companie");
const Product = require("../models/Product");

class ProductController {
  async createProduct(req, res) {
    try {
      const data = req.body;

      if (data.quantity === undefined) {
        return res.status(406).json({ message: "Quantity not accepted." });
      }

      if (
        data.name === undefined ||
        data.name === " " ||
        data.name.length < 2 ||
        data.name.length > 100
      ) {
        return res.status(406).json({ message: "Name not accepted." });
      }

      if (data.price === undefined || isNaN(data.price) || data.price < 0) {
        return res.status(406).json({ message: "Price not accepted." });
      }

      const resultComp = await Companie.getById(data.companieId)

      if (!resultComp.sucess) {
        return res.status(404).json({ message: "Companie not found." });
      }

      const product = await Product.create(data);

      console.log(product)


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

  async findById(req, res) {
    try {
      const { id } = req.body;
      const product = await Product.findById(id);

      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving product", error });
    }
  }

  async findAllProducts(req, res) {
    try {
      const { id } = req.body;
      const products = await Product.findAll(id);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products", error });
    }
  }
}

module.exports = new ProductController();
