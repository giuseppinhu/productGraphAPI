require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const AdminAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (token === undefined) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const verificatedUser = await User.userIsThisCompanie(
      decoded.id,
      decoded.companieId,
    );

    if (decoded.role === 1 && verificatedUser) {
      req.companie_id = decoded.companieId;
      req.id = decoded.id;
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = AdminAuth;
