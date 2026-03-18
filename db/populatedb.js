require("dotenv").config();

const { Client } = require("pg");

const SQL = `
CREATE TABLE users (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  hash VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  status BOOLEAN NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE messages (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  added VARCHAR(255),
  text VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  PRIMARY KEY ("sid")
);
`;

async function main() {
  console.log("Creating tables...");
  const client = new Client({
    connectionString: process.env.URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
