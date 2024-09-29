const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const connection = require('./config');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

// Signup route
app.post('/signup', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('studentNumber').notEmpty().withMessage('Student number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, studentNumber, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const sql = `INSERT INTO users (name, email, student_number, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [name, email, studentNumber, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', error: err });
      }
      res.json({ success: true, message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
});

module.exports = app;