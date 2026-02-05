const Sales = require("../models/Sales");
const User = require("../models/User");
const Product = require("../models/Product");

class DataController {
  async dataDashboard(req, res) {
    try {
      const companie_id = req.companie_id;

      const users = await User.getNewUsers(companie_id);
      const sales = await Sales.dataSales(companie_id);

      const getDataProduct = async () => {
        const rawMoreSales = await Sales.getProductMoreSale(companie_id);
        const newMoreSales = await Promise.all(
          rawMoreSales.map(async (i) => {
            const product = await Product.findById(i._id);

            if (product != undefined) {
              const newObj = {
                totalQuantity: i.totalQuantity,
                totalSales: Number(i.totalSales),
                name: product.name,
                date: i.lastSaleDate,
              };

              return newObj;
            } else {
              return { message: "Product not found!" };
            }
          }),
        );

        return newMoreSales;
      };

      const getDataSaleLast = async () => {
        const rawSales = await Sales.getLatest(companie_id);

        const newSales = await Promise.all(
          rawSales.map(async (i) => {
            const user = await User.findById(i.clientId);

            if (user.sucess) {
              const newObj = {
                _id: i._id,
                totalPrice: Number(i.totalPrice),
                status: i.status,
                saleDate: i.saleDate,
                name: user?.user.name || "Name Test",
              };
              return newObj;
            } else {
              return { message: "User not found!" };
            }
          }),
        );

        return newSales;
      };

      const productSales = await getDataProduct();
      const salesLast = await getDataSaleLast();

      const graphData = await Sales.getProductMonth(companie_id);

      if (
        productSales.message === "Product not found!" ||
        salesLast.message === "User not found!"
      ) {
        return res
          .status(404)
          .json({ message: "Error retring product or user data" });
      }

      const data = {
        users_new: users,
        sales,
        salesLast,
        productSales,
        graphData,
      };

      res.status(200).json({ data });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving data dashboard", error });
    }
  }

  async dataSales(req, res) {
    try {
      const { page, search, status } = req.query;
      const companie_id = req.companie_id;

      if (page === undefined || isNaN(page)) {
        return res
          .status(400)
          .json({ message: "Page is required and must be a number" });
      }

      const { sales, total, totalPages, next } = await Sales.getAll(
        companie_id,
        page,
        5,
        search,
        status,
      );

      const newUsers = await User.getNewUsers(companie_id);

      const budges = await Sales.getSalesWeek(companie_id);

      const AUR =
        newUsers.currentCount > 0 ? budges.quantity / newUsers.currentCount : 0;

      res.status(200).json({ sales, total, totalPages, next, budges, AUR });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving data sales", error });
    }
  }

  async dataUser(req, res) {
    try {
      const companie_id = req.companie_id;
      const { page, search } = req.query;

      const users = await User.getNewUsers(companie_id);
      const dataUsers = await User.getAll(companie_id, page, 5, search);

      res.status(200).json({ totalNew: users.currentCount, dataUsers });
    } catch (error) {
      res.status(400).json({ error: "Error retriving data users" });
    }
  }

  async dataProduct(req, res) {
    try {
      const companie_id = req.companie_id;
      const { page, search } = req.query;

      const product = await Product.dataProducts(
        companie_id,
        page,
        5,
        search.trim(),
      );

      res.json({
        product: product.products,
        totalDoc: product.totalDocs,
        companieId: companie_id,
      });
    } catch (error) {
      res.status(400).json({ error: "Error retriving data products" });
    }
  }
}

module.exports = new DataController();
