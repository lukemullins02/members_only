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

async function updateAdmin(id) {
  await pool.query("UPDATE users SET admin = true where id = $1", [id]);
}

async function insertMessage(title, text, added, user_id) {
  await pool.query(
    "INSERT INTO messages (title, text,added, user_id) VALUES ($1,$2,$3,$4)",
    [title, text, added, user_id],
  );
}

async function getMessagesUsers() {
  const { rows } = await pool.query(
    "SELECT * FROM messages as m join users as u on m.user_id = u.id",
  );

  return rows;
}

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");

  return rows;
}

async function getUser(username) {
  const { rows } = await pool.query("select * from users where username = $1", [
    username,
  ]);

  return rows;
}

module.exports = {
  insertUser,
  updateUser,
  insertMessage,
  getMessages,
  getMessagesUsers,
  updateAdmin,
  getUser,
};
