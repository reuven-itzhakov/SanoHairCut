// Vercel serverless function for admin available times API
const { admin, db } = require('../_utils/firebase');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { body } = req;
  
  try {
    // Admin: Set available times for a specific date - POST /api/admin/available-times
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
  } catch (error) {
    console.error('Admin available times API error:', error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
