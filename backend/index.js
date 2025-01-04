const express = require("express");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { Storage } = require("@google-cloud/storage");

// Access environment variables
// const privateKey = process.env.FIREBASE_PRIVATE_KEY;
// if (!privateKey) {
//   throw new Error("FIREBASE_PRIVATE_KEY is not set");
// }

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
};

console.log('Service Account:', serviceAccount);

// Initialize Firebase Admin
// Add this after serviceAccount initialization
if (!serviceAccount.private_key) {
  console.error('Firebase private key is missing');
  throw new Error('Firebase configuration is incomplete');
}

// Initialize Firebase with error handling
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bpts-34c54-default-rtdb.firebaseio.com",
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}
const db = admin.firestore();
// const storage = new Storage({ keyFilename: "./serviceAccountKey.json" });
const storage = new Storage({
  credentials: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }
});
const bucket = storage.bucket("bpts-34c54.appspot.com"); // Replace with your Firebase Storage bucket name

const app = express();
app.use(cors());
app.use(bodyParser.json());

const { v4: uuidv4 } = require("uuid");
function generateCustomID() {
  const random5Letters = Array.from({ length: 5 }, () =>
    String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  ).join(""); // generates 5 random lowercase letters

  const day = new Date().getDate().toString().padStart(2, "0"); // day of the month, 2 digits
  const random6DigitCounter = Math.floor(100000 + Math.random() * 900000); // random 6-digit number
  const currentYear = new Date().getUTCFullYear(); // current year

  return `bp${random5Letters}${day}-${random6DigitCounter}-${currentYear}`;
}

// Nodemailer Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bottlepoints@gmail.com", // Replace with your email
    pass: "gknc jgyo tdbq omyg", // Use your generated App Password here
  },
});

// API to send verification code
app.post("/sendVerificationCode", async (req, res) => {
  const { email, purpose } = req.body;

  try {
    if (purpose === "signup") {
      // Check if the email is already registered in the users collection
      const snapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!snapshot.empty) {
        return res
          .status(400)
          .json({ success: false, message: "Email is already registered" });
      }
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);

    // Store the verification code in Firestore
    await db.collection("verificationCodes").add({
      email: email,
      code: code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Determine email content based on purpose
    let emailSubject, emailBody;
    if (purpose === "signup") {
      emailSubject = "BottlePoints Verification Code";
      emailBody = `
        <p style="color: #7a9b57">Thanks for signing up for <strong style="color: #455e14">BottlePoints</strong> <br>
        Use the verification code below to complete your registration:</p>
        <div class="code" style="color: #83951c; font-weight: bold;">${code}</div>
        <p style="color: #7a9b57">If you did not request this code, please ignore this email.</p>
        <p style="text-align: left; color: #7a9b57">Regards, <br> BottlePoints Team</p>
      `;
    } else if (purpose === "reset") {
      emailSubject = "BottlePoints Password Reset Code";
      emailBody = `
        <p style="color: #7a9b57">You requested to reset your password for <strong style="color: #455e14">BottlePoints</strong> <br>
        Use the verification code below to reset your password:</p>
        <div class="code" style="color: #83951c; font-weight: bold;">${code}</div>
        <p style="color: #7a9b57">If you did not request this code, please ignore this email.</p>
        <p style="text-align: left; color: #7a9b57">Regards, <br> BottlePoints Team</p>
      `;
    }

    // Send email with Nodemailer
    const mailOptions = {
      from: '"BottlePoints" <Bottlepoints@gmail.com>',
      to: email,
      subject: emailSubject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailSubject}</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Poppins', Arial, sans-serif;
              background-color: white;
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
              ${emailBody}
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
    return res
      .status(200)
      .send({ success: true, message: "Verification code sent" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error storing verification code in Firestore",
    });
  }
});

app.post("/resetPassword", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Fetch the user by email
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Get the user data from Firestore
    const user = snapshot.docs[0].data();

    // Compare the new password with the current password
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update the user's password in the database
    const userDoc = snapshot.docs[0].ref;
    await userDoc.update({ password: hashedPassword });

    return res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to reset password" });
  }
});

app.post("/verifyCode", async (req, res) => {
  const { email, code } = req.body;

  console.log(`Verifying code for email: ${email.trim()}, code: ${code}`);

  try {
    const snapshot = await db
      .collection("verificationCodes")
      .where("email", "==", email.trim()) // Trim spaces
      .where("code", "==", parseInt(code)) // Convert code to a number for comparison
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("No matching code found or code is expired.");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    // If code is found, delete it from Firestore to prevent reuse
    snapshot.forEach((doc) => doc.ref.delete());

    console.log("Code verified successfully.");
    return res
      .status(200)
      .json({ success: true, message: "Code verified successfully" });
  } catch (error) {
    console.error("Error verifying code:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify code" });
  }
});

// Backend Route to handle Signup
const bcrypt = require("bcrypt");

// Number of salt rounds for bcrypt hashing
const saltRounds = 10;

app.post("/signup", async (req, res) => {
  const { email, name, studentNumber, password } = req.body;

  try {
    // Check if the email is already registered
    let snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (!snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Check if the studentNumber is already registered
    snapshot = await db
      .collection("users")
      .where("studentNumber", "==", studentNumber)
      .get();

    if (!snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Student number already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a custom ID
    const userId = generateCustomID();

    // Add the user to the 'users' collection with the hashed password and custom ID
    await db.collection("users").add({
      id: userId,
      email,
      name,
      studentNumber,
      password: hashedPassword, // Store hashed password
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(200)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create account" });
  }
});

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Fetch the user by email
//     const snapshot = await db.collection('users')
//       .where('email', '==', email)
//       .get();

//     if (snapshot.empty) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // Get the user data from Firestore
//     const user = snapshot.docs[0].data();

//     // Compare the entered password with the stored hashed password
//     const isPasswordMatch = await bcrypt.compare(password, user.password);

//     if (!isPasswordMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid email or password' });
//     }

//     // Return user data on successful login
//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         studentNumber: user.studentNumber,
//         avatar: user.avatar, // Include avatar URL
//         points: user.points || 0,
//         co2Reduction: user.co2Reduction || 0,
//         bottleGoal: user.bottleGoal || 0,
//         recycledBottles: user.recycledBottles || 0
//       }
//     });
//   } catch (error) {
//     console.error('Error logging in user:', error);
//     res.status(500).json({ success: false, message: 'Failed to login' });
//   }
// });
app.get("/userPoints", async (req, res) => {
  const { studentNumber } = req.query; // Get studentNumber from query parameters

  if (!studentNumber) {
    return res
      .status(400)
      .json({ success: false, message: "studentNumber is required" });
  }

  try {
    const userPointsSnapshot = await db
      .collection("userPoints")
      .where("studentNumber", "==", studentNumber)
      .get();

    if (userPointsSnapshot.empty) {
      return res
        .status(404)
        .json({ success: false, message: "No user points found" });
    }

    const userPointsData = userPointsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("User Points Data:", userPointsData); // Log the retrieved data

    // Ensure that totalPoints and bottleCount are being calculated correctly
    const totalPoints = userPointsData.reduce(
      (acc, curr) => acc + (curr.totalPoints || 0), // Ensure totalPoints is a number
      0,
    );
    const totalBottleCount = userPointsData.reduce(
      (acc, curr) => acc + (curr.bottleCount || 0), // Ensure bottleCount is a number
      0,
    );

    console.log("Total Points:", totalPoints); // Log total points
    console.log("Total Bottle Count:", totalBottleCount); // Log total bottle count

    return res
      .status(200)
      .json({ success: true, totalPoints, totalBottleCount });
  } catch (error) {
    console.error("Error fetching user points:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch user points" });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user by email
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Get the user data from Firestore
    const user = snapshot.docs[0].data();

    // Compare the entered password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Fetch the user's points and bottle count from the userPoints collection
    const pointsSnapshot = await db
      .collection("userPoints")
      .where("studentNumber", "==", user.studentNumber)
      .get();

    let totalPoints = 0;
    let totalBottleCount = 0;
    pointsSnapshot.forEach((doc) => {
      totalPoints += doc.data().totalPoints;
      totalBottleCount += doc.data().bottleCount;
    });

    // Return user data on successful login
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        studentNumber: user.studentNumber,
        avatar: user.avatar, // Include avatar URL
        points: totalPoints || 0, // Include total points from userPoints collection
        bottleCount: totalBottleCount || 0, // Include total bottle count from userPoints collection
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ success: false, message: "Failed to login" });
  }
});

const fs = require("fs");

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed"));
  },
});
// Set up multer for file uploads

// Endpoint for avatar upload
app.post("/api/users/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const file = req.file;
    const fileName = `avatars/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
    });

    blobStream.on("finish", async () => {
      // Make the file public
      await fileUpload.makePublic();

      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      res.status(200).json({
        success: true,
        avatarUrl: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error handling file upload:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to process upload" });
  }
});

// Update profile endpoint
app.put("/api/users/update-profile", async (req, res) => {
  const { email, name, avatar } = req.body;

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userDoc = snapshot.docs[0].ref;
    await userDoc.update({
      name,
      avatar,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name,
        avatar,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});
app.post("/updateProfile", async (req, res) => {
  const { email, name, avatar } = req.body;

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();
    if (snapshot.empty) {
      return res
        .status(404)
        .json({ success: false, message: "User  not found" });
    }

    const userDoc = snapshot.docs[0].ref;
    await userDoc.update({ name, avatar }); // Make sure to update avatar field

    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update profile" });
  }
});

app.post("/claim-reward", async (req, res) => {
  const { userId, rewardId } = req.body;

  try {
    // Fetch the user by userId
    const userSnapshot = await db
      .collection("users")
      .where("id", "==", userId)
      .get();

    if (userSnapshot.empty) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Get the user data from Firestore
    const userDoc = userSnapshot.docs[0].ref;
    const user = userSnapshot.docs[0].data();

    // Fetch the reward by rewardId
    const rewardSnapshot = await db.collection("rewards").doc(rewardId).get();

    if (!rewardSnapshot.exists) {
      return res
        .status(400)
        .json({ success: false, message: "Reward not found" });
    }

    const reward = rewardSnapshot.data();

    // Check if the user has enough points to claim the reward
    if (user.points < reward.points) {
      return res.status(400).json({
        success: false,
        message: "Not enough points to claim this reward",
      });
    }

    // Deduct the reward points from the user's points, ensuring it does not go below zero
    let remainingPointsToDeduct = reward.points;

    // Fetch the user's points documents
    const userPointsSnapshot = await db
      .collection("userPoints")
      .where("studentNumber", "==", user.studentNumber)
      .get();

    userPointsSnapshot.forEach(async (doc) => {
      const userPointsDoc = doc.ref;
      const userPointsData = doc.data();

      if (remainingPointsToDeduct > 0) {
        const pointsToDeduct = Math.min(
          userPointsData.totalPoints,
          remainingPointsToDeduct,
        );
        const updatedPoints = userPointsData.totalPoints - pointsToDeduct;
        remainingPointsToDeduct -= pointsToDeduct;

        await userPointsDoc.update({ totalPoints: updatedPoints });
      }
    });

    // Update the user's total points in the users collection
    const newPoints = user.points - reward.points;
    await userDoc.update({ points: newPoints });

    // Optionally, you can add the claimed reward to a claimedRewards collection
    await db.collection("claimedRewards").add({
      userId: userId,
      rewardId: rewardId,
      claimedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      success: true,
      message: "Reward claimed successfully",
      newPoints,
    });
  } catch (error) {
    console.error("Error claiming reward:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to claim reward" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    // Fetch all user points data
    const pointsSnapshot = await db.collection("userPoints").get();

    // Aggregate bottle counts for each user
    const leaderboardMap = new Map();
    pointsSnapshot.forEach((doc) => {
      const data = doc.data();
      const studentNumber = data.studentNumber;
      const bottleCount = data.bottleCount;

      if (leaderboardMap.has(studentNumber)) {
        const existingData = leaderboardMap.get(studentNumber);
        leaderboardMap.set(studentNumber, {
          studentNumber: studentNumber,
          name: existingData.name, // Assuming name is consistent across documents
          avatar: existingData.avatar, // Assuming avatar is consistent across documents
          bottleCount: existingData.bottleCount + bottleCount,
        });
      } else {
        leaderboardMap.set(studentNumber, {
          studentNumber: studentNumber,
          name: data.name, // Assuming you have a name field in userPoints collection
          avatar: data.avatar, // Assuming you have an avatar field in userPoints collection
          bottleCount: bottleCount,
        });
      }
    });

    // Convert the map to an array and sort the leaderboard by bottle count in descending order
    const leaderboard = Array.from(leaderboardMap.values());
    leaderboard.sort((a, b) => b.bottleCount - a.bottleCount);

    return res.status(200).json({ success: true, leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch leaderboard" });
  }
});

app.post("/notifications", async (req, res) => {
  const { studentNumber } = req.body;

  if (!studentNumber) {
    return res
      .status(400)
      .json({ success: false, message: "studentNumber is required" });
  }

  try {
    const notificationsSnapshot = await db
      .collection("userPoints")
      .where("studentNumber", "==", studentNumber)
      .where("deleted", "==", false) // Filter out deleted notifications
      .orderBy("timestamp", "desc")
      .get();

    const notifications = notificationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      timestamp: doc.data().timestamp,
      totalPoints: doc.data().totalPoints,
      bottleCount: doc.data().bottleCount,
    }));

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// Add this after your existing routes
app.delete("/notifications/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const notificationDoc = db.collection("userPoints").doc(id);
    const doc = await notificationDoc.get();

    if (!doc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" });
    }

    // Set the deleted flag instead of deleting the document
    await notificationDoc.update({ deleted: true });
    return res.status(200).json({
      success: true,
      message: "Notification marked as deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete notification" });
  }
});
app.post("/contributeBottle", async (req, res) => {
  const { studentNumber, bottleCount } = req.body;

  try {
    // Update the user's total bottle contribution in the users collection
    const userSnapshot = await db
      .collection("users")
      .where("studentNumber", "==", studentNumber)
      .get();

    if (userSnapshot.empty) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userDoc = userSnapshot.docs[0].ref;
    await userDoc.update({
      bottleCount: admin.firestore.FieldValue.increment(bottleCount), // Increment the bottle count
    });

    // Add an entry to userPoints for the notification with deleted field
    await db.collection("userPoints").add({
      studentNumber,
      bottleCount,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      deleted: false, // Initialize deleted field to false
    });

    return res
      .status(200)
      .json({ success: true, message: "Bottle contribution recorded" });
  } catch (error) {
    console.error("Error contributing bottle:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to contribute bottle" });
  }
});
// Add these routes after your existing routes

// Get all reports (for admin)
app.get("/reports", async (req, res) => {
  try {
    const reportsSnapshot = await db
      .collection("reports")
      .orderBy("createdAt", "desc")
      .get();

    const reports = reportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reports" });
  }
});

// Submit a new report
app.post("/reports", async (req, res) => {
  const { userId, userName, studentNumber, category, description } = req.body;

  try {
    const reportData = {
      userId,
      userName,
      studentNumber,
      category,
      description,
      status: "pending", // initial status
      adminResponse: "", // empty initially
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("reports").add(reportData);

    res.status(200).json({
      success: true,
      message: "Report submitted successfully",
      reportId: docRef.id,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit report" });
  }
});

// Get reports for a specific user
app.get("/reports/user/:studentNumber", async (req, res) => {
  const { studentNumber } = req.params;

  try {
    const reportsSnapshot = await db
      .collection("reports")
      .where("studentNumber", "==", studentNumber)
      .orderBy("createdAt", "desc")
      .get();

    const reports = reportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching user reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user reports" });
  }
});

// Update report status and add admin response (for admin)
app.put("/reports/:reportId", async (req, res) => {
  const { reportId } = req.params;
  const { status, adminResponse } = req.body;

  try {
    const reportRef = db.collection("reports").doc(reportId);
    const report = await reportRef.get();

    if (!report.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    await reportRef.update({
      status,
      adminResponse,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res
      .status(200)
      .json({ success: true, message: "Report updated successfully" });
  } catch (error) {
    console.error("Error updating report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update report" });
  }
});

// Delete a report (optional, for admin)
app.delete("/reports/:reportId", async (req, res) => {
  const { reportId } = req.params;

  try {
    const reportRef = db.collection("reports").doc(reportId);
    const report = await reportRef.get();

    if (!report.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    await reportRef.delete();

    res
      .status(200)
      .json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete report" });
  }
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
