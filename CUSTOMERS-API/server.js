// server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const customersRouter = require("./routes/customersRoutes");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// mount customers routes at /customers
app.use("/customers", customersRouter);

// health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: "Route not found", code: "NOT_FOUND" } });
});

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));
