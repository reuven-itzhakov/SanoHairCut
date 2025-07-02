// Firebase Admin SDK initialization for Vercel serverless functions
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  let firebaseConfig;
  
  if (process.env.FIREBASE_ADMIN_KEY_BASE64) {
    // Production: decode base64 environment variable
    const serviceAccountKey = JSON.parse(
      Buffer.from(process.env.FIREBASE_ADMIN_KEY_BASE64, 'base64').toString('utf-8')
    );
    firebaseConfig = {
      credential: admin.credential.cert(serviceAccountKey),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "sanohaircut.appspot.com"
    };
  } else {
    // Development: use local file (won't work in production)
    try {
      const serviceAccount = require('../backend/firebase-admin.json');
      firebaseConfig = {
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "sanohaircut.appspot.com"
      };
    } catch (error) {
      console.error('Firebase Admin SDK key not found. Please set FIREBASE_ADMIN_KEY_BASE64 environment variable.');
      throw error;
    }
  }
  
  admin.initializeApp(firebaseConfig);
}

const db = admin.firestore();

module.exports = { admin, db };
