const express = require("express");

module.exports = (db, admin) => {
  const router = express.Router();

  // --- User Management ---
  // Create user document
  router.post("/users", async (req, res) => {
    const { uid, name, email } = req.body;
    if (!uid || !name || !email) {
      return res.status(400).json({ error: "Missing uid, name, or email" });
    }
    db.collection("users").doc(uid).set({ name, email })
      .then(() => res.json({ message: "User created!" }))
      .catch(err => res.status(500).json({ error: "Failed to create user" }));
  });

  // --- User Profile ---
  // Get user profile
  router.get("/profile/:uid", async (req, res) => {
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
  router.post("/profile/:uid", async (req, res) => {
    db.collection("users").doc(req.params.uid).set(
      { name: req.body.name },
      { merge: true }
    ).then(() => {
      res.json({ message: "Profile updated!" });
    }).catch(err => {
      res.status(500).json({ error: "Failed to update profile" });
    });
  });

  return router;
};
