const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./Backend/config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/dashboard", require("./Backend/routes/routes"));

// Endpoint to provide configuration data to the frontend
app.get('/config', (req, res) => {
  const DocAss_server_url = process.env.DOC_API_URL;
  res.setHeader("Content-Type", "application/json");
  res.json({ DocAss_server_url });
});

app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.get("/", (req, res) => {
  res.send("Dashboard API Running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});