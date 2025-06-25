// removeAdminClaim.js
// Usage: node removeAdminClaim.js <USER_UID>

const admin = require("firebase-admin");
const path = require("path");

// Update the path below to your service account key if needed
const serviceAccount = require(path.resolve(__dirname, "./firebase-admin.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
if (!uid) {
  console.error("Usage: node removeAdminClaim.js <USER_UID>");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { isAdmin: false })
  .then(() => {
    console.log(`Admin rights removed for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error removing admin claim:", error);
    process.exit(1);
  });
