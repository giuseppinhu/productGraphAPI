const Sales = require("../models/Sales");
const User = require("../models/User");
const Product = require("../models/Product");

class DataController {
  async dataDashboard(req, res) {
    try {
      const users = await User.getNewUsers();
      const sales = await Sales.dataSales();

      const getDataProduct = async () => {
        const rawMoreSales = await Sales.getProductMoreSale();

        const newMoreSales = await Promise.all(
          rawMoreSales.map(async (i) => {
            const product = await Product.findById(i._id);

            if (product != undefined) {
              const newObj = {
                totalQuantity: i.totalQuantity,
                totalSales: i.totalSales,
                name: product.name,
                date: i.lastSaleDate,
            };

              return newObj;
            } else {
              return { message: "Product not found!" };
            }
          })
        );

        return newMoreSales;
      };

      const getDataSaleLast = async () => {
        const rawSales = await Sales.getLatest();
    

        const newSales = await Promise.all(
          rawSales.map(async (i) => {
            const user = await User.findById(i.clientId);

            if (user.sucess) {
              const newObj = {
                _id: i._id,
                totalPrice: i.totalPrice,
                status: i.status,
                saleDate: i.saleDate,
                name: user?.user.name || "Name Test",
              };
              return newObj;
            } else {
              return { message: "User not found!" };
            }
          })
        );

        return newSales;
      };

      const productSales = await getDataProduct();
      const salesLast = await getDataSaleLast();

      const graphData = await Sales.getProductMonth();

      if(productSales.message === "Product not found!" || salesLast.message === "User not found!"){
        return res.status(404).json({ message: "Error retring product or user data" });
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
      const { page } = req.query

      if(page === undefined || isNaN(page)) {
        return res.status(400).json({message: "Paga is required and must be a number"})
      }

      const salesAll = await Sales.getAll(page, 5);

      const newUsers = await User.getNewUsers();

      const sales = await Promise.all(
        salesAll.sales.map(async (i) => {
          const product = await Product.findById(i.productId);
          const user = await User.findById(i.clientId);

          const newObj = {
            id: i._id,
            product: product.name,
            client: user.user.name,
            totalPrice: Number(i.totalPrice),
            saleDate: i.saleDate,
            status: i.status,
          };

          return newObj;
        })
      );

      const budges = await Sales.getSalesWeek();

      const AUR = budges.quantity / newUsers.currentCount || 0;

      res.status(200).json({ totalPages: salesAll.totalPages, sales, next: salesAll.next, budges, AUR });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving data sales", error });
    }
  }
}

module.exports = new DataController();
