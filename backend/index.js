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

// Get available times for a specific date
app.get("/api/available-times/:date", async (req, res) => {
  try {
    const doc = await db.collection("availableTimes").doc(req.params.date).get();
    if (!doc.exists) {
      return res.json({ times: [] });
    }
    res.json({ times: doc.data().times || [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch available times" });
  }
});

// Reserve an appointment
app.post("/api/appointments", async (req, res) => {
  const { userId, date, time } = req.body;
  if (!userId || !date || !time) {
    return res.status(400).json({ error: "Missing userId, date, or time" });
  }
  try {
    // Check if the time is still available
    const timesDocRef = db.collection("availableTimes").doc(date);
    const timesDoc = await timesDocRef.get();
    const times = timesDoc.exists ? timesDoc.data().times : [];
    if (!times.includes(time)) {
      return res.status(400).json({ error: "Time not available" });
    }
    // Check if user already has an appointment
    const existing = await db.collection("appointments").where("userId", "==", userId).get();
    if (!existing.empty) {
      return res.status(400).json({ error: "User already has an appointment" });
    }
    // Reserve appointment
    await db.collection("appointments").add({ userId, date, time, createdAt: new Date() });
    // Remove the time from availableTimes
    await timesDocRef.update({ times: times.filter(t => t !== time) });
    res.json({ message: "Appointment reserved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reserve appointment" });
  }
});

// Get user's appointment
app.get("/api/appointments/:userId", async (req, res) => {
  try {
    const snap = await db.collection("appointments").where("userId", "==", req.params.userId).get();
    if (snap.empty) return res.json({ appointment: null });
    const doc = snap.docs[0];
    res.json({ appointment: { id: doc.id, ...doc.data() } });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
});

// Delete user's appointment
app.delete("/api/appointments/:userId", async (req, res) => {
  try {
    const snap = await db.collection("appointments").where("userId", "==", req.params.userId).get();
    if (snap.empty) return res.status(404).json({ error: "No appointment found" });
    const doc = snap.docs[0];
    const { date, time } = doc.data();
    // Delete appointment
    await db.collection("appointments").doc(doc.id).delete();
    // Add the time back to availableTimes
    const timesDocRef = db.collection("availableTimes").doc(date);
    await timesDocRef.update({
      times: admin.firestore.FieldValue.arrayUnion(time)
    });
    // Sort the times array after adding
    const updatedDoc = await timesDocRef.get();
    const updatedTimes = (updatedDoc.data().times || []).slice().sort();
    await timesDocRef.update({ times: updatedTimes });
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
});

// Admin: Add available times for a specific date
app.post("/api/admin/available-times", async (req, res) => {
  const { uid, date, times } = req.body;
  if (!uid || !date || !Array.isArray(times)) {
    return res.status(400).json({ error: "Missing uid, date, or times" });
  }
  try {
    // Check if user is admin
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists || userDoc.data().isAdmin !== true) {
      return res.status(403).json({ error: "Not authorized" });
    }
    // Add or update available times for the date (merge and sort)
    const timesDocRef = db.collection("availableTimes").doc(date);
    const timesDoc = await timesDocRef.get();
    let newTimes = times;
    if (timesDoc.exists) {
      // Merge with existing times, remove duplicates, and sort
      const existingTimes = timesDoc.data().times || [];
      newTimes = Array.from(new Set([...existingTimes, ...times])).sort();
    } else {
      newTimes = times.slice().sort();
    }
    await timesDocRef.set({ times: newTimes });
    res.json({ message: "Available times updated", times: newTimes });
  } catch (err) {
    res.status(500).json({ error: "Failed to update available times" });
  }
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