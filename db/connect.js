const mysql = require("mysql2")

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root5678',
    database: 'employee_db'
  });

module.exports = db;