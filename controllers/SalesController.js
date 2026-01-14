const Sales = require("../models/Sales");

class SalesController {
  async createSale(req, res) {
    try {
      const data = req.body;
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
      const sales = await Sales.getAll();
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving sales", error });
    }
  }
}

module.exports = new SalesController();
