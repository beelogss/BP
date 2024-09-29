const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 setup
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    '57022876739-7a4n25qr9kvqnhf0ggotqo9la6netspc.apps.googleusercontent.com', // Client ID (wrap in quotes)
    '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', // Client Secret (wrap in quotes)
    "https://developers.google.com/oauthplayground" // Redirect URL
);

// Set OAuth2 credentials
oauth2Client.setCredentials({
    refresh_token: '1//04339krGRDRmfCgYIARAAGAQSNwF-L9IrvXRDbSdmPGairhBW5UtmB7cHp9VKL8wW8S5fTrHTeKcXw6MH5vyoOYUpXEGmbJt_DqY', // Replace with actual refresh token
});

// Function to send verification email
async function sendVerificationEmail(recipientEmail, verificationCode) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'bottlepoints@gmail.com', // Your email address
                clientId: '57022876739-7a4n25qr9kvqnhf0ggotqo9la6netspc.apps.googleusercontent.com', // Replace with your actual client ID
                clientSecret: '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', // Replace with your actual client secret
                refreshToken: '1//04339krGRDRmfCgYIARAAGAQSNwF-L9IrvXRDbSdmPGairhBW5UtmB7cHp9VKL8wW8S5fTrHTeKcXw6MH5vyoOYUpXEGmbJt_DqY', // Replace with your refresh token
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: 'bottlepoints@gmail.com', // Sender email
            to: recipientEmail, // Recipient email
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

// Create a POST route for triggering email verification
router.post('/send-verification', async (req, res) => {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
        return res.status(400).json({ error: 'Email and verification code are required' });
    }

    try {
        await sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
        console.error('Error in /send-verification:', error);
        res.status(500).json({ error: 'Failed to send verification email' });
    }
});

module.exports = router;
