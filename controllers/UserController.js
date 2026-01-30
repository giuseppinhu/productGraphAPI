require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Companie = require("../models/Companie");

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

      if (
        data.companie_id === undefined ||
        data.companie_id === null ||
        data.companie_id === " " ||
        data.companie_id.length <= 23
      ) {
        res.status(400).json({ error: "Companie ID is required" });
        return;
      }

      const emailExists = await User.findByEmail(data.email);

      if (emailExists.sucess) {
        res.status(400).json({ error: "Email already in use" });
        return;
      }

      const companieExist = await Companie.getById(data.companie_id);

      if (!companieExist.sucess) {
        res.status(404).json({ error: "Companie not found" });
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
    const { id } = req.params;

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
      const { companie_id } = req.body;
      const { page, search } = req.query;

      const users = await User.getAll(companie_id, page, 5, search);

      if (users.error) {
        res.status(406).json({ error: users.error });
      }

      res.status(200).json({
        users: users.users,
        total: users.totalUsers,
        totalPages: users.totalPages,
        next: users.next,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.body;
      const user = await User.findById(id);

      if (!user.sucess) {
        res.status(404).json({ error: "User not found!" });
      }

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
                companieId: result.user.companie_id,
                email: result.user.email,
                name: result.user.name,
                role: result.user.role,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1h" },
            );
            res.status(200).json({ message: "Login successful", token });
          } else {
            res.status(401).json({ error: "Invalid credentials" });
          }
        },
      );
    }
  }

  async uploadAvatar(req, res) {
    try {
      const { id } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!id) {
        return res.status(400).json({ error: "ID invalid!" });
      }

      const resultUser = await User.findById(id)
    
      if(resultUser.sucess) {
        const fileUrl = req.file.path;

        const result = await User.updateAvatar(id, fileUrl);

        if (!result.sucess) {
          res.status(406).json({ result });
        }

        res.status(200).json({ success: result.sucess, fileUrl: fileUrl });
      } else {
        res.status(200).json({ message: "User Not Found!" });
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      res.status(400).json({ error: "Error in upload avatar" });
    }
  }

  async update(req, res) {
    try {
      const data = req.body
      const result = await User.update(data)

      if(result === null) {
        res.status(400).json({ sucess: false, message: "Not found user" })
      }
       
      res.json({ sucess: true, message: "User update to sucess" })
    } catch (error) {
      res.status(500).json({ error: "Error update user"})
    }
  }

}

module.exports = new UserConstroller();
