// setAdminClaim.js
// Usage: node setAdminClaim.js <USER_UID>
// This script grants admin rights (isAdmin custom claim) to a Firebase user.

const admin = require("firebase-admin");
const path = require("path");

// Update the path below to your service account key if needed
const serviceAccount = require(path.resolve(__dirname, "./firebase-admin.json"));

// Initialize the Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get the UID from command line arguments
const uid = process.argv[2];
if (!uid) {
  // Print usage instructions if UID is not provided
  console.error("Usage: node setAdminClaim.js <USER_UID>");
  process.exit(1);
}

// Set the isAdmin custom claim for the user
admin.auth().setCustomUserClaims(uid, { isAdmin: true })
  .then(() => {
    // Success message
    console.log(`Admin rights granted to user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    // Error handling
    console.error("Error setting admin claim:", error);
    process.exit(1);
  });
