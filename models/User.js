const mongoose = require("mongoose");
const UserSchema = require("../database/UserSchema");
const getDate = require("../utils/getDate");
const UserModel = mongoose.model("User", UserSchema);

const calculateGrowthPercentage = require("../utils/calculateGrowthPercentage");

class User {
  async create(data) {
    try {
      const user = new UserModel(data);
      await user.save();
      return user;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  async delete(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw new Error("Error deleting user: " + error.message);
    }
  }

  async getAll() {
    try {
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw new Error("Error retrieving users: " + error.message);
    }
  }
  
  async getNewUsers() {
    try {      
      const { startMonth, endMonth, startMonthPrev, endMonthPrev } = getDate

      const users = await UserModel.aggregate([
        {
          $match: {
            created_at: {
              $gte: startMonthPrev,
              $lt: endMonth
            }
          }
        },
        {
          $facet: {
            current: [
              { $match: { created_at: { $gte: startMonth, $lt: endMonth } } },
              { $group: { _id: null, count: { $sum: 1 } } }
            ],
            previous: [
              { $match: { created_at: { $gte: startMonthPrev, $lt: endMonthPrev } } },
              { $group: { _id: null, count: { $sum: 1 } } }
            ]
          }
        }
      ]);

      if(users === undefined || users.length <= 0) {
        return undefined
      }

      const currentCount = users[0].current[0]?.count || 0;
      const previousCount = users[0].previous[0]?.count || 0;

      const percentage = calculateGrowthPercentage(previousCount, currentCount)

      return { currentCount, previousCount, percentage, isPositive: currentCount >= previousCount }
    } catch (error) {
      throw new Error("Error retrieving users: " + error.message);
    }
  }

  async findByEmail(email) {
    try {
      const user = await UserModel.find({ email });
      if (user.length > 0) {
        return { sucess: true, user: user[0] };
      }
      return { sucess: false };
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async findById(id) {
     try {
      const user = await UserModel.findById(id).select({_id: 0, name: 1, email: 1});

      if (user != undefined) {
        return { sucess: true, user };
      }
      return { sucess: false };
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }
}

module.exports = new User();
