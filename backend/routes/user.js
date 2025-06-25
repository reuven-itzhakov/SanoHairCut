const express = require("express");

module.exports = (db, admin) => {
  const router = express.Router();

  // --- User Management ---
  // Create user (handled by Firebase Auth, not here)
  // Optionally, you can create users via admin.auth().createUser if needed

  // --- User Profile ---
  // Get user profile from Firebase Auth
  router.get("/profile/:uid", async (req, res) => {
    try {
      const userRecord = await admin.auth().getUser(req.params.uid);
      res.json({
        uid: userRecord.uid,
        name: userRecord.displayName || null,
        email: userRecord.email || null,
        isAdmin: userRecord.customClaims && userRecord.customClaims.isAdmin === true
      });
    } catch (err) {
      res.status(404).json({ error: "User not found" });
    }
  });

  // Update user profile (displayName in Firebase Auth)
  router.post("/profile/:uid", async (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing name" });
    }
    try {
      await admin.auth().updateUser(req.params.uid, { displayName: name });
      res.json({ message: "Profile updated!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  return router;
};
