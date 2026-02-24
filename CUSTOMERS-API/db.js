// db.js
// Railway-ready MySQL connection configuration
// Uses Railway-provided variables on deployment, falls back to local .env for development
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  // Railway env variables (production)
  host: process.env.RAILWAY_DATABASE_HOST || process.env.DB_HOST || "localhost",
  user: process.env.RAILWAY_DATABASE_USER || process.env.DB_USER || "root",
  password: process.env.RAILWAY_DATABASE_PASSWORD || process.env.DB_PASSWORD || "",
  database: process.env.RAILWAY_DATABASE_NAME || process.env.DB_NAME || "customer_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

module.exports = pool;
