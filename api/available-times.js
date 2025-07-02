// Vercel serverless function for available times API
const { admin, db } = require('./_utils/firebase');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, method, body } = req;
  
  try {
    if (method === 'GET' && query.date) {
      // Get available times for a specific date - GET /api/available-times?date=2023-06-15
      const doc = await db.collection("availableTimes").doc(query.date).get();
      if (!doc.exists) {
        return res.json({ times: [] });
      }
      
      let times = doc.data().times || [];
      // Remove past times for today (Israel time)
      const now = new Date();
      const israelOffset = 3 * 60; // UTC+3 in minutes (for June)
      const todayStr = new Date(now.getTime() + (now.getTimezoneOffset() + israelOffset) * 60000).toISOString().slice(0, 10);
      if (query.date === todayStr) {
        const nowHHMM = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        times = times.filter(t => t > nowHHMM);
        // Update DB to remove past times
        await db.collection("availableTimes").doc(query.date).update({ times });
      }
      return res.json({ times });
    }
    
    if (method === 'POST' && query.admin === 'true') {
      // Admin: Set available times for a specific date - POST /api/available-times?admin=true
      const { uid, date, times } = body;
      if (!uid || !date || !Array.isArray(times)) {
        return res.status(400).json({ error: "Missing uid, date, or times" });
      }
      
      // Check if user is admin using Firebase Auth custom claims
      const userRecord = await admin.auth().getUser(uid);
      if (!userRecord.customClaims || userRecord.customClaims.isAdmin !== true) {
        return res.status(403).json({ error: "Not authorized" });
      }
      
      // Replace available times for the date (overwrite with new array, sorted)
      await db.collection("availableTimes").doc(date).set({ times: times.slice().sort() });
      return res.json({ message: "Available times set", times: times.slice().sort() });
    }
    
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error('Available times API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
