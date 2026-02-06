const mongoose = require("mongoose");

const UserSchema = require("../database/UserSchema");
const UserModel = mongoose.model("User", UserSchema);
const Companie = require("./Companie");

const getDate = require("../utils/getDate");
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

  async getAll(companieId, page = 1, limit = 5, search = "") {
    try {
      const skip = (page - 1) * limit;
      var next = false;

      const isObjectId = mongoose.Types.ObjectId.isValid(search);

      const matchCondition = {
        companie_id: new mongoose.Types.ObjectId(companieId),
        ...(search && search.trim() !== ""
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                ...(isObjectId
                  ? [{ _id: new mongoose.Types.ObjectId(search) }]
                  : []),
              ],
            }
          : {}),
      };

      const users = await UserModel.aggregate([
        {
          $match: matchCondition,
        },
        {
          $project: {
            password: 0,
          },
        },
        { $sort: { created_at: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: limit }],
          },
        },
      ]);

      const countDoc = users[0].metadata[0] ? users[0].metadata[0].total : 0;

      if (skip + limit < countDoc) {
        next = true;
      }

      const totalPages = Math.ceil(countDoc / limit);

      return { users: users[0].data, totalUsers: countDoc, totalPages, next };
    } catch (error) {
      throw new Error("Error retrieving users: " + error.message);
    }
  }

  async getNewUsers(companieId) {
    try {
      const { startMonth, endMonth, startMonthPrev, endMonthPrev } = getDate;

      const users = await UserModel.aggregate([
        {
          $match: {
            companie_id: new mongoose.Types.ObjectId(companieId),
            created_at: {
              $gte: startMonthPrev,
              $lt: endMonth,
            },
          },
        },
        {
          $facet: {
            current: [
              { $match: { created_at: { $gte: startMonth, $lt: endMonth } } },
              { $group: { _id: null, count: { $sum: 1 } } },
            ],
            previous: [
              {
                $match: {
                  created_at: { $gte: startMonthPrev, $lt: endMonthPrev },
                },
              },
              { $group: { _id: null, count: { $sum: 1 } } },
            ],
          },
        },
      ]);

      if (users === undefined || users.length <= 0) {
        return undefined;
      }

      const currentCount = users[0].current[0]?.count || 0;
      const previousCount = users[0].previous[0]?.count || 0;

      const percentage = calculateGrowthPercentage(previousCount, currentCount);

      return {
        currentCount,
        previousCount,
        percentage,
        isPositive: currentCount >= previousCount,
      };
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
      const user = await UserModel.findById(id).select({
        _id: 1,
        name: 1,
        email: 1,
        companie_id: 1,
        avatar_url: 1,
        role: 1
      });

      if (user != undefined) {
        return { sucess: true, user };
      }
      return { sucess: false };
    } catch (error) {
      throw new Error("Error finding user by email: " + error.message);
    }
  }

  async updateAvatar(id, url) {
    try {
      const result = await this.findById(id);

      if (!result.sucess) {
        return { message: "User not found" };
      }

      const user = await UserModel.updateOne({ _id: id }, { avatar_url: url });

      if (!user) {
        return { sucess: false };
      }

      return { sucess: true };
    } catch (error) {
      throw new Error("Error update avatar");
    }
  }

  async userIsThisCompanie(id, companieId) {
    const resUser = await this.findById(id);

    const resCompanie = await Companie.getById(companieId);

    if (!resUser.sucess) {
      return false;
    }

    if (!resCompanie.sucess) {
      return false;
    }

    if ((resUser.user.companie_id = resCompanie.result._id)) {
      return true;
    } else {
      return false;
    }
  }

  async update(data) {
    try {
      const result = await UserModel.findByIdAndUpdate(data.id, data);
      return result;
    } catch (error) {
      throw new Error("Error in update data User" + error);
    }
  }
}

module.exports = new User();
