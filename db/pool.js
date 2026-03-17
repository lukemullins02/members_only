require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: `${process.env.USERNAME}`,
  database: `${process.env.DB}`,
  password: `${process.env.PASSWORD}`,
  port: 5432,
});

module.exports = pool;
