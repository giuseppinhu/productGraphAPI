const Sales = require("../models/Sales");
const User = require("../models/User");
const Product = require('../models/Product')

class DataController {
    async dataDashboard(req, res) {
        try {
            console.log("corinthians")
            const users = await User.getNewUsers()

            const sales = await Sales.dataSales()

            const salesNew = await Sales.getLatest()
            
            const products = await Product.findLatest(salesNew)

            const data = {
                users_new: users,
                sales
            }

            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ message: "Error retrieving data dashboard", error });
        }
    }
}

module.exports = new DataController()