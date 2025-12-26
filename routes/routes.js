const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

router.post("/product", ProductController.createProduct);

router.delete("/product", ProductController.deleteProduct);

module.exports = router;
