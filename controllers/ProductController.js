const Companie = require("../models/Companie");
const Product = require("../models/Product");

class ProductController {
  async createProduct(req, res) {
    try {
      const data = req.body;

      if (!data.quantity) {
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

      const resultComp = await Companie.getById(data.companieId);

      if (!resultComp.sucess) {
        return res.status(404).json({ message: "Companie not found." });
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
      const { id } = req.params;
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
      const companie_id = req.companie_id;
      const products = await Product.findAll(companie_id);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving products", error });
    }
  }

  async updateProduct(req, res) {
    try {
      const data = req.body;

      if (!data.name) {
        res.status(500).json({ message: "Name not defined!" });
      }

      if (!data.quantity) {
        res.status(500).json({ message: "Quantity not defined!" });
      }

      if (!data.price) {
        res.status(500).json({ message: "Prices not defined!" });
      }

      const products = await Product.update(data);
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: "Error update products", error });
    }
  }

  async uploadImage(req, res) {
    try {
      const { id } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!id) {
        return res.status(400).json({ error: "ID invalid!" });
      }

      const resultProd = await Product.findById(id);

      if (resultProd) {
        const fileUrl = req.file.path;

        const result = await Product.updateAvatar(id, fileUrl);

        if (!result.sucess) {
          res.status(406).json({ result });
        }

        res.status(200).json({ success: true, fileUrl: fileUrl });
      } else {
        res.status(200).json({ message: "Product Not Found!" });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(400).json({ error: "Error in upload avatar" });
    }
  }
}

module.exports = new ProductController();
