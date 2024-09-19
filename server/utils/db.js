const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:uTwOzUnJEDkFiXguBzsXxwhtiFiotqgb@autorack.proxy.rlwy.net:11618/railway",
});

module.exports = pool;
