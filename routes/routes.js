const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

router.get("/product", ProductController.findAllProducts);

router.post("/product", ProductController.createProduct);

router.delete("/product", ProductController.deleteProduct);

router.post("/sale", SalesController.createSale);

module.exports = router;
