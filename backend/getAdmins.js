// getAdmins.js
// Usage: node getAdmins.js

const admin = require("firebase-admin");
const path = require("path");

// Update the path below to your service account key if needed
const serviceAccount = require(path.resolve(__dirname, "./firebase-admin.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function listAdmins() {
  const admins = [];
  let nextPageToken;
  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    result.users.forEach(userRecord => {
      if (userRecord.customClaims && userRecord.customClaims.isAdmin === true) {
        admins.push({
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName || null
        });
      }
    });
    nextPageToken = result.pageToken;
  } while (nextPageToken);
  return admins;
}

listAdmins().then(admins => {
  if (admins.length === 0) {
    console.log("No admin users found.");
  } else {
    console.log("Admin users:");
    admins.forEach(user => {
      console.log(`UID: ${user.uid}, Email: ${user.email}, Name: ${user.displayName}`);
    });
  }
  process.exit(0);
}).catch(err => {
  console.error("Error listing admin users:", err);
  process.exit(1);
});
