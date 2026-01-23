const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");
const SalesController = require("../controllers/SalesController");
const UserController = require("../controllers/UserController");
const DataController = require("../controllers/DataController");
const CompanieController = require("../controllers/CompanieController");

const AdminAuth = require("../middleware/AdminAuth");
const UserLogged = require("../middleware/UserLogged");
const uploadMiddleware = require("../middleware/UploadAvatar");

const upload = uploadMiddleware("avatars");

router.get("/", (req, res) => {
  res.send("Welcome to the Product Graph API");
});

// ROTAS DE PRODUTO
router.get("/product", ProductController.findAllProducts);

router.post("/product", AdminAuth, ProductController.createProduct);

router.delete("/product", AdminAuth, ProductController.deleteProduct);

router.post("/id/product", ProductController.findById);

// ROTAS DE VENDA
router.post("/sale", UserLogged, SalesController.createSale);

router.get("/sale", SalesController.getSales);

router.delete("/sale", SalesController.deleteSale);

// ROTAS DE USUARIOS
router.post("/users", AdminAuth, UserController.getAllUsers);

router.post("/user", UserController.createUser);

router.post("/id/user", UserController.getUserById);

router.delete("/user", AdminAuth, UserController.deleteUser);

router.post("/login", UserController.loginUser);

router.post("/update", UserController.update);

router.post("/upload", upload.single("file"), UserController.uploadAvatar);

// ROTA DA DADOS PARA A DASH
router.get("/data/dashboard", DataController.dataDashboard);

router.get("/data/sales", DataController.dataSales);

router.post("/data/users", DataController.dataUser);

// ROTA DE EMPRESAS

router.post("/companie", CompanieController.createCompanie);

router.post("/id/companie", CompanieController.findById);

module.exports = router;
