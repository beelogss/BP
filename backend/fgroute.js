const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Reuse the OAuth2 client and email configuration from earlier setup
// This will be the same as your email verification logic.

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate a reset token (you can store this in the DB and link it to the user)
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Example of 6-digit reset code

  // Send the password reset email using the existing email-sending logic
  try {
    await sendVerificationEmail(email, resetToken); // You can reuse the sendVerificationEmail function for this
    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
});

module.exports = router;
