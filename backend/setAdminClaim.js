// setAdminClaim.js
// Usage: node setAdminClaim.js <USER_UID: x2RSyVW6RdaT32AZyRh8O2QaWxO2>

const admin = require("firebase-admin");
const path = require("path");

// Update the path below to your service account key if needed
const serviceAccount = require(path.resolve(__dirname, "./firebase-admin.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
if (!uid) {
  console.error("Usage: node setAdminClaim.js <USER_UID: x2RSyVW6RdaT32AZyRh8O2QaWxO2>");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { isAdmin: true })
  .then(() => {
    console.log(`Custom claim set: isAdmin = true for user ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error setting custom claim:", error);
    process.exit(1);
  });
