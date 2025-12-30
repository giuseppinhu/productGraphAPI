const mongoose = require('mongoose');
const UserSchema = require('../database/UserSchema');
const UserModel = mongoose.model('User', UserSchema);

class User {
    async create(data) {
        try {
            const user = new UserModel(data);
            await user.save();

            return user;
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async delete(id) {
        try {
            const result = await UserModel.findByIdAndDelete(id);        
            return result
        } catch (error) {
            throw new Error('Error deleting user: ' + error.message);
        }
    }
}

module.exports = new User();