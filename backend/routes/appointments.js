const express = require("express");

module.exports = (db, admin) => {
  const router = express.Router();

  // Reserve an appointment
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

  return router;
};
