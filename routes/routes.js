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
router.get("/product", AdminAuth, ProductController.findAllProducts);

router.post("/product", AdminAuth, ProductController.createProduct);

router.delete("/product/:id", AdminAuth, ProductController.deleteProduct);

router.post("/id/product", UserLogged, ProductController.findById);

router.put("/product", AdminAuth, ProductController.updateProduct);

router.post("/product/upload", dynamicUpload, ProductController.uploadImage);

// ROTAS DE VENDA
router.post("/sale", AdminAuth, SalesController.createSale);

router.post("/sales", AdminAuth, SalesController.getSales);

router.delete("/sale", AdminAuth, SalesController.deleteSale);

// ROTAS DE USUARIOS
router.post("/users", AdminAuth, UserController.getAllUsers);

router.post("/user", AdminAuth, UserController.createUser);

router.post("/id/user", AdminAuth, UserController.getUserById);

router.delete("/user/:id", AdminAuth, UserController.deleteUser);

router.post("/login", UserController.loginUser);

router.post("/logout", UserController.logout);

router.put("/update", AdminAuth, UserController.update);

router.post("/user/upload", dynamicUpload, UserController.uploadAvatar);

// ROTA DA DADOS PARA A DASH
router.post("/data/dashboard", AdminAuth, DataController.dataDashboard);

router.post("/data/sales", AdminAuth, DataController.dataSales);

router.post("/data/users", AdminAuth, DataController.dataUser);

router.post("/data/product", AdminAuth, DataController.dataProduct);

// ROTA DE EMPRESAS
router.post("/companie", CompanieController.createCompanie);

router.post("/id/companie", CompanieController.findById);

module.exports = router;
