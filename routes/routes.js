const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");
const UserController = require("../controllers/UserController");
const DataController = require("../controllers/DataController");
const CompanieController = require("../controllers/CompanieController");

const AdminAuth = require("../middleware/AdminAuth");
const UserLogged = require("../middleware/UserLogged");

const dynamicUpload = require("../middleware/dynamcUpload");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

// ROTAS DE PRODUTO
router.get("/product", ProductController.findAllProducts);

router.post("/product", ProductController.createProduct);

router.delete("/product/:id", ProductController.deleteProduct);

router.post("/id/product", ProductController.findById);

router.put("/product", ProductController.updateProduct)

router.post("/product/upload", dynamicUpload, ProductController.uploadImage);

// ROTAS DE VENDA
router.post("/sale", SalesController.createSale);

router.post("/sales", SalesController.getSales);

router.delete("/sale", SalesController.deleteSale);

// ROTAS DE USUARIOS
router.post("/users", AdminAuth, UserController.getAllUsers);

router.post("/user", UserController.createUser);

router.post("/user/token", UserController.createUser);

router.post("/id/user", UserController.getUserById);

router.delete("/user/:id", UserController.deleteUser);

router.post("/login", UserController.loginUser);

router.put("/update", UserController.update);

router.post("/user/upload", dynamicUpload, UserController.uploadAvatar);

// ROTA DA DADOS PARA A DASH
router.get("/data/dashboard", DataController.dataDashboard);

router.get("/data/sales", DataController.dataSales);

router.post("/data/users", DataController.dataUser);

router.post("/data/product", DataController.dataProduct);

// ROTA DE EMPRESAS
router.post("/companie", CompanieController.createCompanie);

router.post("/id/companie", CompanieController.findById);

module.exports = router;
