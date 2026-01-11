require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");
const jobRoutes = require("./routes/jobs"); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(jobRoutes); 

app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
