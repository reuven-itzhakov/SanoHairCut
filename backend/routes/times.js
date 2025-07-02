// times.js
// API routes for managing available appointment times.
// Requires Firestore database instance (db) and Firebase Admin SDK (admin).

const express = require("express");

module.exports = (db, admin) => {
  const router = express.Router();

  // Get available times for a specific date
  // GET /available-times/:date
  // Returns an array of available times for the given date.
  // For today, removes times that have already passed (Israel time) and updates the DB.
  router.get("/available-times/:date", async (req, res) => {
    try {
      const doc = await db.collection("availableTimes").doc(req.params.date).get();
      if (!doc.exists) {
        return res.json({ times: [] });
      }
      let times = doc.data().times || [];
      // Remove past times for today (Israel time)
      const now = new Date();
      const israelOffset = 3 * 60; // UTC+3 in minutes (for June)
      const todayStr = new Date(now.getTime() + (now.getTimezoneOffset() + israelOffset) * 60000).toISOString().slice(0, 10);
      if (req.params.date === todayStr) {
        const nowHHMM = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        times = times.filter(t => t > nowHHMM);
        // Update DB to remove past times
        await db.collection("availableTimes").doc(req.params.date).update({ times });
      }
      res.json({ times });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch available times" });
    }
  });

  // Admin: Set available times for a specific date (replace times)
  // POST /admin/available-times
  // Body: { uid, date, times }
  // Only allows if the user is an admin (checked via custom claims).
  // Overwrites the available times for the given date with the provided array (sorted).
  router.post("/admin/available-times", async (req, res) => {
    const { uid, date, times } = req.body;
    if (!uid || !date || !Array.isArray(times)) {
      return res.status(400).json({ error: "Missing uid, date, or times" });
    }
    try {
      // Check if user is admin using Firebase Auth custom claims
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord.customClaims || userRecord.customClaims.isAdmin !== true) {
        return res.status(403).json({ error: "Not authorized" });
      }
      // Replace available times for the date (overwrite with new array, sorted)
      await db.collection("availableTimes").doc(date).set({ times: times.slice().sort() });
      res.json({ message: "Available times set", times: times.slice().sort() });
    } catch (err) {
      res.status(500).json({ error: "Failed to set available times" });
    }
  });

  return router;
}