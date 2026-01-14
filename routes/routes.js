const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");
const UserController = require("../controllers/UserController");

const AdminAuth = require("../middleware/AdminAuth");
const UserLogged = require("../middleware/UserLogged");
const DataController = require("../controllers/DataController");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

// ROTAS DE PRODUTO
router.get("/product", ProductController.findAllProducts);

router.post("/product", AdminAuth, ProductController.createProduct);

router.delete("/product", AdminAuth, ProductController.deleteProduct);

router.post("/id/product/", ProductController.findById);

// ROTAS DE VENDA
router.post("/sale", UserLogged, SalesController.createSale);

router.get("/sale", SalesController.getSales);

router.delete("/sale", SalesController.deleteSale);

// ROTAS DE USUARIOS
router.get("/users", AdminAuth, UserController.getAllUsers);

router.post("/user", UserController.createUser);

router.post("/id/user", UserController.getUserById);

router.delete("/user", AdminAuth, UserController.deleteUser);

router.post("/login", UserController.loginUser);

// ROTA DA DADOS PARA A DASH
router.get("/data/dashboard", DataController.dataDashboard);

router.get("/data/sales", DataController.dataSales);

module.exports = router;
