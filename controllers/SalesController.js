const Sales = require("../models/Sales");

class SalesController {
  async createSale(req, res) {
    try {
      const data = req.body;

      if (
        data.productId === undefined ||
        data.clientId === undefined ||
        data.quantity === undefined ||
        data.totalPrice === undefined
      ) {
        return res
          .status(400)
          .json({ message: "Missing required fields - is undefined" });
      }

      if (
        data.productId.length <= 0 ||
        data.clientId.length <= 0 ||
        data.quantity <= 0 ||
        data.totalPrice <= 0
      ) {
        return res
          .status(400)
          .json({ message: "Missing required fields - length is zero" });
      }

      if (isNaN(data.quantity) || isNaN(data.totalPrice)) {
        return res
          .status(400)
          .json({ message: "Missing required fields - not is a number" });
      }

      const sale = await Sales.create(data);

      req.io.emit("dashboard:update");

      if (!sale.success) {
        res.status(406).json(sale);
      } else {
        res.status(201).json(sale);
      }
    } catch (error) {
      res.status(500).json({ message: "Error creating sale", error });
    }
  }

  async getSales(req, res) {
    try {
      const { page, search, status } = req.query;
      const { companie_id } = req.body;

      if (page === undefined || isNaN(page)) {
        return res
          .status(400)
          .json({ message: "Page is required and must be a number" });
      }

      const sales = await Sales.getAll(companie_id, page, 5, search, status);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sales", error });
    }
  }

  async deleteSale(req, res) {
    try {
      const { id } = req.body;

      const result = await Sales.delete(id);

      if (result.message) {
        res.status(404).json({ message: result.message });
        return;
      }

      res.status(200).json({ message: "Sale deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting sale", error });
    }
  }
}

module.exports = new SalesController();
