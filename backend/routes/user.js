// user.js
// API routes for user management and profile operations.
// Requires Firestore database instance (db) and Firebase Admin SDK (admin).

const express = require("express");

module.exports = (db, admin) => {
  const router = express.Router();

  // --- User Management ---
  // Create user (handled by Firebase Auth, not here)
  // Optionally, you can create users via admin.auth().createUser if needed

  // --- User Profile ---
  // Get user profile from Firebase Auth
  // GET /profile/:uid
  // Returns the user's UID, display name, email, and admin status.
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
  // POST /profile/:uid
  // Body: { name }
  // Updates the user's display name in Firebase Auth.
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

  // Get all users (for admin)
  // GET /users
  // Returns a list of all users with UID, display name, email, and admin status.
  router.get("/users", async (req, res) => {
    try {
      let users = [];
      let nextPageToken;
      do {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        users = users.concat(result.users.map(userRecord => ({
          uid: userRecord.uid,
          displayName: userRecord.displayName || null,
          email: userRecord.email || null,
          isAdmin: userRecord.customClaims && userRecord.customClaims.isAdmin === true
        })));
        nextPageToken = result.pageToken;
      } while (nextPageToken);
      res.json({ users });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Update user info and admin status (for admin)
  // POST /users/:uid/update
  // Body: { name, email, isAdmin }
  // Updates the user's display name, email, and admin status (custom claim).
  router.post("/users/:uid/update", async (req, res) => {
    const { name, email, isAdmin } = req.body;
    const { uid } = req.params;
    try {
      // Update displayName and email
      await admin.auth().updateUser(uid, {
        displayName: name,
        email: email
      });
      // Update admin claim
      await admin.auth().setCustomUserClaims(uid, { isAdmin: !!isAdmin });
      res.json({ message: "User updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  return router;
};
