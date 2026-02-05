const mongoose = require("mongoose");
const SalesSchema = require("../database/SalesSchema");
const SalesModel = mongoose.model("Sales", SalesSchema);

const Product = require("./Product");
const User = require("./User");
const getDate = require("../utils/getDate");
const calculateGrowthPercentage = require("../utils/calculateGrowthPercentage");

class Sales {
  async create(data) {
    try {
      if (!mongoose.Types.ObjectId.isValid(data.productId)) {
        return { success: false, message: "Invalid product ID" };
      }

      const product = await Product.findById(data.productId);
      const priceReal = product.price * data.quantity;
      const user = await User.findById(data.clientId);

      if (!product) {
        return { success: false, message: "Product not found!" };
      }

      if (!user.sucess) {
        return { success: false, message: "User not found!" };
      }

      if (data.totalPrice != priceReal) {
        return { success: false, message: "Total price is incorret!" };
      }

      const newSale = new SalesModel(data);

      await newSale.save();

      const result = await Product.updateQuantity(
        data.productId,
        data.quantity,
      );

      if (!result.success) {
        return { success: false, message: result.message };
      }

      return { success: true, newSale };
    } catch (error) {
      throw new Error("Error creating sale: " + error.message);
    }
  }

  async delete(id) {
    try {
      const result = await SalesModel.findByIdAndDelete(id);

      if (result === undefined || result === null) {
        return { message: "Sale not found!" };
      }
      return { result };
    } catch (error) {
      throw new Error("Error deleting sale: " + error.message);
    }
  }

  async getAll(companieId, page = 1, limit = 5, search = "", status = "") {
    try {
      const skip = (page - 1) * limit;
      var next = false;

      const isObjectId = mongoose.Types.ObjectId.isValid(search);

      const matchCondition = {
        companieId: new mongoose.Types.ObjectId(companieId),
        ...(search && search.trim() !== ""
          ? {
              $or: [
                { "clientData.name": { $regex: search, $options: "i" } },
                { "productData.name": { $regex: search, $options: "i" } },
                ...(isObjectId
                  ? [{ _id: new mongoose.Types.ObjectId(search) }]
                  : []),
              ],
            }
          : {}),
      };

      if (status) {
        matchCondition.$and.push({ status: status });
      }

      const sales = await SalesModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "clientData",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $unwind: "$clientData" },
        { $unwind: "$productData" },
        { $match: matchCondition },
        {
          $project: {
            _id: 1,
            totalPrice: { $toDouble: "$totalPrice" },
            saleDate: 1,
            status: 1,
            "clientData.name": 1,
            "productData.name": 1,
          },
        },
        { $sort: { saleDate: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
      ]);

      const countDoc = sales[0].metadata[0] ? sales[0].metadata[0].total : 0;

      if (skip + limit < countDoc) {
        next = true;
      }

      const totalPages = Math.ceil(countDoc / limit);

      return { sales: sales[0].data, totalPages, total: countDoc, next };
    } catch (error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }

  async getProductMoreSale(companieId) {
    try {
      const sales = await SalesModel.aggregate([
        {
          $match: {
            companieId: new mongoose.Types.ObjectId(companieId),
          },
        },
        {
          $group: {
            _id: "$productId",
            totalQuantity: { $sum: "$quantity" },
            totalSales: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 4,
        },
      ]);

      if (sales === undefined || sales === null) {
        return {};
      }

      return sales;
    } catch (error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }

  async getProductMonth(companieId) {
    try {
      const sales = await SalesModel.aggregate([
        {
          $match: {
            companieId: new mongoose.Types.ObjectId(companieId),
          },
        },
        {
          $group: {
            _id: { $month: "$saleDate" },
            quantity: { $sum: "$quantity" },
            totalSales: { $sum: { $toDouble: "$totalPrice" } },
          },
        },
        {
          $sort: { _id: 1 },
        },
        {
          $project: {
            _id: 0,
            month: {
              $arrayElemAt: [
                [
                  "jan",
                  "fev",
                  "mar",
                  "abr",
                  "mai",
                  "jun",
                  "jul",
                  "ago",
                  "set",
                  "out",
                  "nov",
                  "dez",
                ],
                { $subtract: ["$_id", 1] },
              ],
            },
            quantity: 1,
            sales: "$totalSales",
          },
        },
      ]);

      return sales;
    } catch (error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }

  async getLatest(companieId) {
    try {
      const sales = await SalesModel.find({ companieId })
        .select("productId totalPrice saleDate clientId status")
        .sort({ _id: -1 })
        .limit(5);
      return sales;
    } catch (error) {
      throw new Error("Error getting sales: " + error.message);
    }
  }

  async getSalesWeek(companieId) {
    try {
      const { startWeek, endWeek } = getDate;

      const sales = await SalesModel.aggregate([
        {
          $match: {
            companieId: new mongoose.Types.ObjectId(companieId),
            saleDate: { $gte: startWeek, $lt: endWeek },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $toDouble: "$totalPrice" } },
            quantity: { $sum: "$quantity" },
          },
        },
      ]);

      if (sales === undefined || sales.length === 0) {
        return { totalRevenue: 0 };
      }

      sales[0].totalRevenue = Number(sales[0].totalRevenue.toFixed(2));

      return {
        totalRevenue: sales[0].totalRevenue,
        quantity: sales[0].quantity,
      };
    } catch (error) {
      throw new Error("Error getting sales week: " + error.message);
    }
  }

  async dataSales(companieId) {
    try {
      const { startMonth, endMonth, startMonthPrev, endMonthPrev } = getDate;

      const getStatsPeriod = async (start, end) => {
        const [result] = await SalesModel.aggregate([
          {
            $match: {
              companieId: new mongoose.Types.ObjectId(companieId),
              saleDate: { $gte: start, $lt: end },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$totalPrice" },
              totalSales: { $sum: "$quantity" },
            },
          },
        ]);

        if (!result) {
          return { totalRevenue: 0, totalSales: 0 };
        }

        const totalRevenue =
          result.totalRevenue && result.totalRevenue.toString
            ? Number(result.totalRevenue.toString())
            : Number(result.totalRevenue) || 0;

        const totalSales = Number(result.totalSales) || 0;

        return { totalRevenue, totalSales };
      };

      const calcTicket = ({ totalRevenue, totalSales }) =>
        totalSales ? Number((totalRevenue / totalSales).toFixed(2)) : 0;

      const [current, previous] = await Promise.all([
        getStatsPeriod(startMonth, endMonth),
        getStatsPeriod(startMonthPrev, endMonthPrev),
      ]);

      const metrics = {
        revenueGrowth: {
          percentage: calculateGrowthPercentage(
            previous.totalRevenue,
            current.totalRevenue,
          ),
          isPositive: current.totalRevenue >= previous.totalRevenue,
        },
        salesGrowth: {
          percentage: calculateGrowthPercentage(
            previous.totalSales,
            current.totalSales,
          ),
          isPositive: current.totalSales >= previous.totalSales,
        },
        ticketGrowth: {
          value: calcTicket(current),
          percentage: calculateGrowthPercentage(
            calcTicket(previous),
            calcTicket(current),
          ),
          isPositive: calcTicket(current) >= calcTicket(previous),
        },
      };

      if (current === undefined || current.length <= 0) {
        return undefined;
      }

      return { current, metrics };
    } catch (error) {
      throw new Error("Error getting data sales: " + error.message);
    }
  }
}

module.exports = new Sales();
