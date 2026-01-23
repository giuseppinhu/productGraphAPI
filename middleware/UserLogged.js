const jwt = require("jsonwebtoken");

const secret = "hjldasflhkj";

const UserLogged = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token === undefined) {
    return res.status(401).json({ message: "No token provided" });
  }

  const authToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(authToken, secret);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = UserLogged;
