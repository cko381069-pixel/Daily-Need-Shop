 const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath =
    process.env.DB_PATH ||
    path.join(__dirname, "..", "database", "dayli-shop.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

console.log("SQLite database connected:", dbPath);

module.exports = db;