// Vercel serverless function for appointments API
const { admin, db } = require('./_utils/firebase');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, method, body } = req;
  
  try {
    if (method === 'POST' && !query.userId) {
      // Reserve an appointment - POST /api/appointments
      const { userId, date, time } = body;
      if (!userId || !date || !time) {
        return res.status(400).json({ error: "Missing userId, date, or time" });
      }
      
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
      return res.json({ message: "Appointment reserved" });
    }
    
    if (method === 'GET' && query.userId) {
      // Get user's appointment - GET /api/appointments?userId=xxx
      const snap = await db.collection("appointments").where("userId", "==", query.userId).get();
      if (snap.empty) return res.json({ appointment: null });
      
      const doc = snap.docs[0];
      const { date, time } = doc.data();
      // Check if appointment is in the past (Israel time)
      const now = new Date();
      const appointmentDateTime = new Date(`${date}T${time}:00+03:00`); // Israel is UTC+3 in summer
      if (appointmentDateTime < now) {
        // Move to 'appointments_history' collection for analysis
        await db.collection("appointments_history").add({ ...doc.data(), userId: query.userId, removedAt: now });
        // Remove from active appointments
        await db.collection("appointments").doc(doc.id).delete();
        return res.json({ appointment: null });
      }
      return res.json({ appointment: { id: doc.id, ...doc.data() } });
    }
    
    if (method === 'DELETE' && query.userId) {
      // Delete user's appointment - DELETE /api/appointments?userId=xxx
      const snap = await db.collection("appointments").where("userId", "==", query.userId).get();
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
      return res.json({ message: "Appointment deleted" });
    }
    
    if (method === 'GET' && !query.userId) {
      // Get all appointments (for admin) - GET /api/appointments
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
      return res.json({ appointments });
    }
    
    if (method === 'POST' && query.userId && query.action === 'change-date') {
      // Change appointment date (admin) - POST /api/appointments?userId=xxx&action=change-date
      const { date, time } = body;
      if (!date || !time) {
        return res.status(400).json({ error: "Missing date or time" });
      }
      
      // Find the appointment for the user
      const snap = await db.collection("appointments").where("userId", "==", query.userId).get();
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
      return res.json({ message: "Appointment date updated" });
    }
    
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error('Appointments API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
