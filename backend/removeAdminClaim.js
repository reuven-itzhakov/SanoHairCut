// removeAdminClaim.js
// Usage: node removeAdminClaim.js <USER_UID>
// This script removes admin rights (isAdmin custom claim) from a Firebase user.

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
  console.error("Usage: node removeAdminClaim.js <USER_UID>");
  process.exit(1);
}

// Remove the isAdmin custom claim from the user
admin.auth().setCustomUserClaims(uid, { isAdmin: false })
  .then(() => {
    // Success message
    console.log(`Admin rights removed for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    // Error handling
    console.error("Error removing admin claim:", error);
    process.exit(1);
  });
