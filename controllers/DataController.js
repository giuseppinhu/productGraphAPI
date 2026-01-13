const Sales = require("../models/Sales");
const User = require("../models/User");
const Product = require('../models/Product')

class DataController {
    async dataDashboard(req, res) {
        try {
            const users = await User.getNewUsers()
            const sales = await Sales.dataSales()

            const getDataProduct = async () => {
                const rawMoreSales = await Sales.getProductMoreSale()   
                 
                const newMoreSales = await Promise.all(
                    rawMoreSales.map(async i => {
                        const product = await Product.findById(i._id)
                        
                        if(product != null) {
                            const newObj = {
                                totalQuantity: i.totalQuantity,
                                totalSales: i.totalSales,
                                name: product.name,
                                date: i.lastSaleDate
                            }  
                            
                            return newObj
                        } else {
                            return {}
                        }
                    })
                )

                return newMoreSales
            }

            const getDataSaleLast = async () => {
                const rawSales = await Sales.getLatest()
                
                const newSales = await Promise.all(
                    rawSales.map(async i => {
                        const user = await User.findById(i.clientId)                 

                       if(user != undefined) {
                            const newObj = {
                                _id: i._id,
                                totalPrice: i.totalPrice,
                                status: i.status,
                                saleDate: i.saleDate,
                                name: user?.user.name || 'Name Test'
                            }
                            return newObj
                       } else {
                        return {}
                       }
                    })

                )

                return newSales
            }

            

            const productSales = await getDataProduct()
            const salesLast = await getDataSaleLast()

            const graphData = await Sales.getProductMonth()

            const data = {
                users_new: users,
                sales,
                salesLast,
                productSales,
                graphData
            }

            res.status(200).json({ data })
        } catch (error) {
            res.status(500).json({ message: "Error retrieving data dashboard", error });
        }
    }
}

module.exports = new DataController()