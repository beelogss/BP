const express = require('express');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');  // Ensure correct path
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bpts-34c54-default-rtdb.firebaseio.com"
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer Transporter setup    
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bottlepoints@gmail.com',  // Replace with your email
    pass: 'gknc jgyo tdbq omyg',     // Use your generated App Password here
  },
});

// API to send verification code
app.post('/sendVerificationCode', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if the email is already registered in the users collection
      const snapshot = await db.collection('users').where('email', '==', email).get();
  
      if (!snapshot.empty) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }
  
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000);
  
      // Store the verification code in Firestore
      await db.collection('verificationCodes').add({
        email: email,
        code: code,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      // Send email with Nodemailer
      const mailOptions = {
        from: '"BottlePoints" <Bottlepoints@gmail.com>',
        to: email,
        subject: 'BottlePoints Verification Code',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BottlePoints Verification Code</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
            <style>
              body {
                font-family: 'Poppins', Arial, sans-serif;
                background-color: #e5eeda;
                padding: 20px;
              }
              .email-container {
                max-width: 36rem;
                margin: auto;
                background-color: #e5eeda;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 18px;
              }
              .header h1 {
                font-size: 1.5rem;
                font-weight: 600;
                font-weight: bold;
              }
              .body {
                text-align: center;
                font-size: 0.9rem;
                line-height: 1.5;
              }
              .code {
                font-size: 2.1rem;
                font-weight: 600;
                margin: 20px 0;
                letter-spacing: 7px; 
              }
              .footer {
                margin-top: 20px;
                font-size: 0.6rem;
                color: #888;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1 style="color: #455e14">BottlePoints</h1>
              </div>
              <div class="body">
                <p style="color: #7a9b57">Thanks for signing up for <strong style="color: #455e14">BottlePoints</strong> <br>
                Use the verification code below to complete your registration:</p>
                <div class="code" style="color: #83951c; font-weight: bold;">${code}</div>
                <p style="color: #7a9b57">If you did not request this code, please ignore this email.</p>
                <p style="text-align: left; color: #7a9b57">Regards, <br> BottlePoints Team</p>
              </div>
              <div class="footer">
                <p>© 2024 BottlePoints. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };
      
      
  
      await transporter.sendMail(mailOptions);
      return res.status(200).send({ success: true, message: 'Verification code sent' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send({ success: false, message: 'Error storing verification code in Firestore' });
    }
  });
  

app.post('/verifyCode', async (req, res) => {
    const { email, code } = req.body;
  
    console.log(`Verifying code for email: ${email.trim()}, code: ${code}`);
  
    try {
      const snapshot = await db.collection('verificationCodes')
        .where('email', '==', email.trim())  // Trim spaces
        .where('code', '==', parseInt(code))  // Convert code to a number for comparison
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();
  
      if (snapshot.empty) {
        console.log('No matching code found or code is expired.');
        return res.status(400).json({ success: false, message: 'Invalid or expired code' });
      }
  
      // If code is found, delete it from Firestore to prevent reuse
      snapshot.forEach((doc) => doc.ref.delete());
  
      console.log('Code verified successfully.');
      return res.status(200).json({ success: true, message: 'Code verified successfully' });
    } catch (error) {
      console.error('Error verifying code:', error);
      return res.status(500).json({ success: false, message: 'Failed to verify code' });
    }
  });

  // Backend Route to handle Signup
  const bcrypt = require('bcrypt');

// Number of salt rounds for bcrypt hashing
const saltRounds = 10;

app.post('/signup', async (req, res) => {
  const { email, name, studentNumber, password } = req.body;

  try {
    // Check if the email is already registered
    let snapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Check if the studentNumber is already registered
    snapshot = await db.collection('users')
      .where('studentNumber', '==', studentNumber)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Student number already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Add the user to the users collection with the hashed password
    await db.collection('users').add({
      email,
      name,
      studentNumber,
      password: hashedPassword, // Store hashed password
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ success: false, message: 'Failed to create account' });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Fetch the user by email
      const snapshot = await db.collection('users')
        .where('email', '==', email)
        .get();
  
      if (snapshot.empty) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }
  
      // Get the user data from Firestore
      const user = snapshot.docs[0].data();
  
      // Compare the entered password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }
  
      res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ success: false, message: 'Failed to login' });
    }
  });
  
  
  

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
