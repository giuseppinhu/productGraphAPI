const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");

const http = require("http").createServer(app);
const { Server } = require("socket.io");

const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

const db = require("./database/db");

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());

const router = require("./routes/routes");
app.use("/", router);

http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
