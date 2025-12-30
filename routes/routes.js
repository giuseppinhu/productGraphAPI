const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");
const UserController = require("../controllers/UserController");

const AdminAuth = require("../middleware/AdminAuth");
const UserLogged = require("../middleware/UserLogged");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

router.get("/product", ProductController.findAllProducts);

router.post("/product", AdminAuth, ProductController.createProduct);

router.delete("/product", AdminAuth, ProductController.deleteProduct);

router.post("/sale", UserLogged, SalesController.createSale);

router.get("/user", AdminAuth, UserController.getAllUsers);

router.post("/user", AdminAuth, UserController.createUser);

router.delete("/user", AdminAuth, UserController.deleteUser);

router.post("/login", UserController.loginUser);

module.exports = router;
