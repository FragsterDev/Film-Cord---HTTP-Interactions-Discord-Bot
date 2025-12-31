require("dotenv").config(); // ✅ ensure env is loaded

const { Pool } = require("pg");

// Optional but STRONGLY recommended guard
if (!process.env.DB_PASSWORD) {
  throw new Error("❌ DB_PASSWORD missing. Check your .env file.");
}

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const query = async (text, params) => {
  return pool.query(text, params);
};

module.exports = {
  pool,
  query,
};
