const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json"); // Replace with your Firebase service account key

const app = express();
app.use(cors());
app.use(express.json());

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

app.post("/api/signup", async (req, res) => {
  const { username, email, zone, password, role, photoURL } = req.body;

  try {
    // Check if email already exists
    const signInMethods = await auth.fetchSignInMethodsForEmail(email);
    if (signInMethods.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: username,
    });

    // Save user data to Firestore
    await db.collection("users").doc(userRecord.uid).set({
      username,
      email,
      zone,
      role,
      photoURL,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "User created successfully", uid: userRecord.uid });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});