const express = require("express");

// This module exports a function that sets up appointment-related API routes.
// It requires a Firestore database instance (db) and the Firebase Admin SDK (admin).
module.exports = (db, admin) => {
  const router = express.Router();

  // Reserve an appointment
  // POST /appointments
  // Body: { userId, date, time }
  // Checks if the time is available and the user doesn't already have an appointment, then reserves it.
  router.post("/appointments", async (req, res) => {
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
  // GET /appointments/:userId
  // Returns the user's current appointment, or null if none. Moves past appointments to history.
  router.get("/appointments/:userId", async (req, res) => {
    try {
      const snap = await db.collection("appointments").where("userId", "==", req.params.userId).get();
      if (snap.empty) return res.json({ appointment: null });
      const doc = snap.docs[0];
      const { date, time } = doc.data();
      // Check if appointment is in the past (Israel time)
      const now = new Date();
      const appointmentDateTime = new Date(`${date}T${time}:00+03:00`); // Israel is UTC+3 in summer
      if (appointmentDateTime < now) {
        // Move to 'appointments_history' collection for analysis
        await db.collection("appointments_history").add({ ...doc.data(), userId: req.params.userId, removedAt: now });
        // Remove from active appointments
        await db.collection("appointments").doc(doc.id).delete();
        return res.json({ appointment: null });
      }
      res.json({ appointment: { id: doc.id, ...doc.data() } });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  // Delete user's appointment
  // DELETE /appointments/:userId
  // Deletes the user's appointment and adds the time back to available times.
  router.delete("/appointments/:userId", async (req, res) => {
    try {
      const snap = await db.collection("appointments").where("userId", "==", req.params.userId).get();
      if (snap.empty) return res.status(404).json({ error: "No appointment found" });
      const doc = snap.docs[0];
      const { date, time } = doc.data();
      // Delete appointment
      await db.collection("appointments").doc(doc.id).delete();
      // Add the time back to availableTimes
      const timesDocRef = db.collection("availableTimes").doc(date);
      const timesDoc = await timesDocRef.get();
      if (timesDoc.exists) {
        await timesDocRef.update({
          times: admin.firestore.FieldValue.arrayUnion(time)
        });
        // Sort the times array after adding
        const updatedDoc = await timesDocRef.get();
        const updatedTimes = (updatedDoc.data().times || []).slice().sort();
        await timesDocRef.update({ times: updatedTimes });
      } else {
        await timesDocRef.set({ times: [time] });
      }
      res.json({ message: "Appointment deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Get all appointments (for admin)
  // GET /appointments
  // Returns all appointments with customer info for admin use.
  router.get("/appointments", async (req, res) => {
    try {
      const snap = await db.collection("appointments").get();
      const appointments = await Promise.all(snap.docs.map(async doc => {
        const data = doc.data();
        let customerName = null;
        let customerEmail = null;
        try {
          const userRecord = await admin.auth().getUser(data.userId);
          customerName = userRecord.displayName || null;
          customerEmail = userRecord.email || null;
        } catch (e) {
          // User not found or error, leave as null
        }
        return { id: doc.id, ...data, customerName, customerEmail };
      }));
      res.json({ appointments });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  // Change appointment date (admin)
  // POST /appointments/:userId/change-date
  // Body: { date, time }
  // Allows admin to change a user's appointment date and time, updating available times accordingly.
  router.post("/appointments/:userId/change-date", async (req, res) => {
    const { date, time } = req.body;
    const { userId } = req.params;
    if (!date || !time) {
      return res.status(400).json({ error: "Missing date or time" });
    }
    try {
      // Find the appointment for the user
      const snap = await db.collection("appointments").where("userId", "==", userId).get();
      if (snap.empty) return res.status(404).json({ error: "Appointment not found" });
      const doc = snap.docs[0];
      const oldData = doc.data();
      // Add the old time back to the old date's availableTimes
      const oldTimesRef = db.collection("availableTimes").doc(oldData.date);
      const oldTimesDoc = await oldTimesRef.get();
      if (oldTimesDoc.exists) {
        await oldTimesRef.update({
          times: (oldTimesDoc.data().times || []).concat(oldData.time).sort()
        });
      } else {
        await oldTimesRef.set({ times: [oldData.time] });
      }
      // Remove the new time from the new date's availableTimes
      const newTimesRef = db.collection("availableTimes").doc(date);
      const newTimesDoc = await newTimesRef.get();
      let newTimes = newTimesDoc.exists ? newTimesDoc.data().times : [];
      newTimes = newTimes.filter(t => t !== time);
      await newTimesRef.set({ times: newTimes });
      // Update the appointment document with the new date and time
      await db.collection("appointments").doc(doc.id).update({ date, time });
      res.json({ message: "Appointment date updated" });
    } catch (err) {
      res.status(500).json({ error: "Failed to update appointment date" });
    }
  });

  return router;
};
