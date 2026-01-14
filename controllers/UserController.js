const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "hjldasflhkj";

class UserConstroller {
  async createUser(req, res) {
    try {
      const data = req.body;

      // Input validation
      if (data.name === undefined || data.name === null || data.name === " ") {
        res.status(400).json({ error: "Name is required" });
        return;
      }
      if (
        data.password === undefined ||
        data.password === null ||
        data.password === " "
      ) {
        res.status(400).json({ error: "Password is required" });
        return;
      }
      if (
        data.email === undefined ||
        data.email === null ||
        data.email === " "
      ) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      const emailExists = await User.findByEmail(data.email);

      if (emailExists.sucess) {
        res.status(400).json({ error: "Email already in use" });
        return;
      }

      const { password } = data;
      const saltRounds = 10;

      await bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
          throw new Error("Error hashing password: " + err.message);
        }

        data.password = hash;
        const user = await User.create(data);
        req.io.emit("dashboard:update");
        res.status(201).json({ message: "User created successfully", user });
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.body;

    if (id === undefined || id === null || id === " ") {
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

  async getAllUsers(req, res) {
    try {
      const users = await User.getAll();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.body
      const user = await User.findById(id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    if (
      email === undefined ||
      email === null ||
      email === " " ||
      email.length <= 1
    ) {
      res.status(400).json({ error: "Email is required" });
      return;
    }
    if (password === undefined || password === null || password === " ") {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    const result = await User.findByEmail(email);

    if (result.sucess) {
      await bcrypt.compare(
        password,
        result.user.password,
        function (err, isMatch) {
          if (err) {
            res.status(500).json({ error: "Internal server error" });
            return;
          }

          if (isMatch) {
            const token = jwt.sign(
              {
                id: result.user._id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
              },
              secret,
              { expiresIn: "1h" }
            );
            res.status(200).json({ message: "Login successful", token });
          } else {
            res.status(401).json({ error: "Invalid credentials" });
          }
        }
      );
    }
  }
}

module.exports = new UserConstroller();
