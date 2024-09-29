const mysql = require('mysql2');

// Setup MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // XAMPP MySQL should run locally
  user: 'root',      // Your MySQL username
  password: '',      // Your MySQL password (leave blank if no password)
  database: 'bp_db' // The database where user data will be stored
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

module.exports = db;
