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

async function insertMessage(text, added, user_id) {
  await pool.query(
    "INSERT INTO messages (text,added, user_id) VALUES ($1,$2,$3)",
    [text, added, user_id],
  );
}

async function getMessagesUsers() {
  const { rows } = await pool.query(
    "SELECT m.id, m.user_id, m.text, m.added, u.firstname, u.lastname FROM messages as m join users as u on m.user_id = u.id order by m.id desc",
  );

  return rows;
}

async function getMessages() {
  const { rows } = await pool.query("SELECT * FROM messages order by id desc");

  return rows;
}

async function getUser(username) {
  const { rows } = await pool.query("select * from users where username = $1", [
    username,
  ]);

  return rows;
}

async function deleteMsg(id) {
  await pool.query("delete from messages where id = $1", [id]);
}

module.exports = {
  insertUser,
  updateUser,
  insertMessage,
  getMessages,
  getMessagesUsers,
  updateAdmin,
  getUser,
  deleteMsg,
};
