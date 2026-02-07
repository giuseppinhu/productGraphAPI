require("dotenv").config();

const jwt = require("jsonwebtoken");

const UserLogged = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.id = decoded.id
    req.companie_id = decoded.companieId
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = UserLogged;
