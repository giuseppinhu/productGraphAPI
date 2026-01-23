const mongoose = require("mongoose");

const CompanieSchema = require("../database/CompanieSchema");
const CompanieModel = mongoose.model("Companie", CompanieSchema);

class Companie {
  async create(data) {
    try {
      const companie = new CompanieModel(data);
      await companie.save();
      return companie;
    } catch (error) {
      throw new Error("Error creating companie" + error);
    }
  }

  async getById(id) {
    try {
      const result = await CompanieModel.findById(id);

      if (result != undefined) {
        return { sucess: true, result };
      }

      return { sucess: false };
    } catch (error) {
      throw new Error("Error in found companie" + error);
    }
  }
}

module.exports = new Companie();
