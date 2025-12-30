const User = require("../models/User");

class UserConstroller {
    async createUser(req, res) {
        try {
            const data = req.body
            const user = await User.create(data);
            res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    async deleteUser(req, res) {
        const { id } = req.body;

        if(id === undefined || id === null || id === " ") {
            res.status(400).json({ error: "ID is required" });
            return;
        }

        try {
            const result = await User.delete(id);
            res.status(200).json({ message: "User deleted successfully", result });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    } 

}

module.exports = new UserConstroller();