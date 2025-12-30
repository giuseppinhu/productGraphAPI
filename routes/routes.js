const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");
const UserController = require("../controllers/UserController");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

router.get("/product", ProductController.findAllProducts);

router.post("/product", ProductController.createProduct);

router.delete("/product", ProductController.deleteProduct);

router.post("/sale", SalesController.createSale);

router.get("/user", UserController.getAllUsers);

router.post("/user", UserController.createUser);

router.delete("/user", UserController.deleteUser);

router.post("/login", UserController.loginUser);

module.exports = router;
