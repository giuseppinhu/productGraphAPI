const Sales = require("../models/Sales");

class SalesController {
  async createSale(req, res) {
    try {
      const data = req.body;
      const sale = await Sales.create(data);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ message: "Error creating sale", error });
    }
  }
}

module.exports = new SalesController();
