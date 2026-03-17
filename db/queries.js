const pool = require("./pool");

async function insertUser(firstName, lastName, username, hash, salt) {
  await pool.query(
    "INSERT INTO users (firstName, lastName, username, hash, salt, status) VALUES ($1,$2,$3,$4,$5, $6)",
    [firstName, lastName, username, hash, salt, false],
  );
}

async function updateUser(id) {
  await pool.query("UPDATE users SET status = true where id = $1", [id]);
}

module.exports = {
  insertUser,
  updateUser,
};
