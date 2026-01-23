const Companie = require("../models/Companie");

class CompanieController {
  async createCompanie(req, res) {
    try {
      const data = req.body;
      const companie = await Companie.create(data);
      res.status(200).json({ companie });
    } catch (error) {
      res.status(400).json({ error: "Error creating companie" });
    }
  }

  async findById(req, res) {
    try {
      const { id } = req.body;
      const companie = await Companie.getById(id);
      res.status(200).json({ companie: companie.result });
    } catch (error) {
      res.status(400).json({ error: "Error found companie" });
    }
  }
}

module.exports = new CompanieController();
