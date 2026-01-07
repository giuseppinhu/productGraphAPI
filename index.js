const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors')

app.use(cors())

const router = require("./routes/routes");

const db = require("./database/db");

app.use(express.json());

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
