const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sendVerificationRoute = require('./sendVerificationRoute'); // Update with the correct path to your router

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Use the route
app.use('/api', sendVerificationRoute);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
