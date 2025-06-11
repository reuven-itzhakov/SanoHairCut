const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "manohaircut.appspot.com"
});

const app = express();
app.use(cors());
app.use(express.json());
const db = admin.firestore();

// Get user profile
app.get("/api/profile/:uid", async (req, res) => {
  db.collection("users").doc(req.params.uid).get()
  .then(docSnap => {
    if (!docSnap.exists)
      return res.status(404).json({ error: "User not found" });
    res.json(docSnap.data());
  }).catch(err => {
    res.status(500).json({ error: "Failed to fetch profile" });
  });
});

// Update user profile (first name)
app.post("/api/profile/:uid", async (req, res) => {
  db.collection("users").doc(req.params.uid).set(
    { name: req.body.name },
    { merge: true }
  ).then(() => {
    res.json({ message: "Profile updated!" });
  }).catch(err => {
    res.status(500).json({ error: "Failed to update profile" });
  });
});

// Create user document
app.post("/api/users", async (req, res) => {
  const { uid, name, email } = req.body;
  if (!uid || !name || !email) {
    return res.status(400).json({ error: "Missing uid, name, or email" });
  }
  db.collection("users").doc(uid).set({ name, email })
    .then(() => res.json({ message: "User created!" }))
    .catch(err => res.status(500).json({ error: "Failed to create user" }));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






// Now you can use Admin SDK services
// const auth = admin.auth();
// const db = admin.firestore();
// auth.listUsers(1000).then(() => { ... });

// SITE KEY:   6LeBukcrAAAAAH3v-01Y-y-uOTAd4RtCtB5CEyUW
// SECRET KEY: 6LeBukcrAAAAAOBOlSLndpK70bmanCi_7rqG3vlp