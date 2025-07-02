// Vercel serverless function for users and profile API
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
    if (method === 'GET' && query.profile && query.uid) {
      // Get user profile - GET /api/users?profile=true&uid=xxx
      const userRecord = await admin.auth().getUser(query.uid);
      return res.json({
        uid: userRecord.uid,
        name: userRecord.displayName || null,
        email: userRecord.email || null,
        isAdmin: userRecord.customClaims && userRecord.customClaims.isAdmin === true
      });
    }
    
    if (method === 'POST' && query.profile && query.uid) {
      // Update user profile - POST /api/users?profile=true&uid=xxx
      const { name } = body;
      if (!name) {
        return res.status(400).json({ error: "Missing name" });
      }
      
      await admin.auth().updateUser(query.uid, { displayName: name });
      return res.json({ message: "Profile updated!" });
    }
    
    if (method === 'GET' && !query.profile) {
      // Get all users (for admin) - GET /api/users
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
      return res.json({ users });
    }
    
    if (method === 'POST' && query.uid && query.action === 'update') {
      // Update user info and admin status - POST /api/users?uid=xxx&action=update
      const { name, email, isAdmin } = body;
      
      // Update displayName and email
      await admin.auth().updateUser(query.uid, {
        displayName: name,
        email: email
      });
      // Update admin claim
      await admin.auth().setCustomUserClaims(query.uid, { isAdmin: !!isAdmin });
      return res.json({ message: "User updated" });
    }
    
    if (method === 'POST' && !query.uid) {
      // Create user in Firestore (from signup) - POST /api/users
      const { uid, name, email } = body;
      if (!uid || !name || !email) {
        return res.status(400).json({ error: "Missing uid, name, or email" });
      }
      
      // Update the user's display name in Firebase Auth
      await admin.auth().updateUser(uid, { displayName: name });
      return res.json({ message: "User created successfully" });
    }
    
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error('Users API error:', error);
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
