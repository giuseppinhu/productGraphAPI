const mongoose = require("mongoose");
const SalesSchema = require("../database/SalesSchema");
const SalesModel = mongoose.model("Sales", SalesSchema);

const Product = require("./Product");
const getDate = require("../utils/getDate");
const calculateGrowthPercentage = require("../utils/calculateGrowthPercentage");

class Sales {
  async create(data) {
    try {     
      const newSale = new SalesModel(data);
      await newSale.save();

      const result = await Product.updateQuantity(
        data.productId,
        data.quantity
      );

      if (!result.success) {
        return { success: false, message: result.message };
      }

      return newSale;
    } catch (error) {
      throw new Error("Error creating sale: " + error.message);
    }
  }
  
  async getAll() {
    try {
      const sales = await SalesModel.find();
      return sales;
    } catch (error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }
  
  async getLatest() {
    try {
      const sales = await SalesModel
                        .find()
                        .select("productId totalPrice saleDate clientId status")
                        .sort({ _id: -1 })
                        .limit(5)
      return sales
    } catch(error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }
  
  async dataSales() {
    try {
      const { startMonth, endMonth, startMonthPrev, endMonthPrev } = getDate

      const getStatsPeriod = async (start, end) => {
        const [result] = await SalesModel.aggregate([
          { 
            $match: { 
              saleDate: { $gte: start, $lt: end } 
            } 
          },
          { 
            $group: { 
              _id: null, 
              totalRevenue: { $sum: "$totalPrice" }, 
              totalSales: { $sum: "$quantity" }, 
            } 
          }
        ]);

        if (!result) {
          return { totalRevenue: 0, totalSales: 0 };
        }

        const totalRevenue = result.totalRevenue && result.totalRevenue.toString
          ? Number(result.totalRevenue.toString())
          : Number(result.totalRevenue) || 0;

        const totalSales = Number(result.totalSales) || 0;

        return { totalRevenue, totalSales };
      }

      const calcTicket = ({ totalRevenue, totalSales }) => totalSales ? Number((totalRevenue / totalSales).toFixed(2)) : 0;

      const [current, previous] = await Promise.all([
        getStatsPeriod(startMonth, endMonth),
        getStatsPeriod(startMonthPrev, endMonthPrev),
      ]);

     const metrics = {
        revenueGrowth: {
          percentage:  calculateGrowthPercentage(previous.totalRevenue,current.totalRevenue),
          isPositive: current.totalRevenue >=previous.totalRevenue,
        },
        salesGrowth: {
          percentage: calculateGrowthPercentage(previous.totalSales,current.totalSales),
          isPositive: current.totalSales >= previous.totalSales,
        },
        ticketGrowth: {
          value: calcTicket(current),
          percentage: calculateGrowthPercentage(calcTicket(previous),calcTicket(current)),
          isPositive: calcTicket(current) >= calcTicket(previous),
        }
      };

      return { current, metrics }
    } catch (error) {
      throw new Error("Error getting data sales: " + error.message);
    }
  }

  async getProductMoreSale() {
    const sales = await SalesModel.aggregate([
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: "$totalPrice" }
        }
      },
    ])
    return sales
  } 
}

module.exports = new Sales();
