// getAdmins.js
// Usage: node getAdmins.js
// This script lists all Firebase users with the custom claim isAdmin === true.

const admin = require("firebase-admin");
const path = require("path");

// Update the path below to your service account key if needed
const serviceAccount = require(path.resolve(__dirname, "./firebase-admin.json"));

// Initialize the Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Lists all users with the isAdmin custom claim set to true.
 * Handles pagination if there are more than 1000 users.
 * @returns {Promise<Array<{uid: string, email: string, displayName: string|null}>>}
 */
async function listAdmins() {
  const admins = [];
  let nextPageToken;
  do {
    // List up to 1000 users at a time, using nextPageToken for pagination
    const result = await admin.auth().listUsers(1000, nextPageToken);
    result.users.forEach(userRecord => {
      // Check if the user has the isAdmin custom claim
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

// Run the listAdmins function and print the results
listAdmins().then(admins => {
  if (admins.length === 0) {
    // No admin users found
    console.log("No admin users found.");
  } else {
    // Print each admin user's UID, email, and display name
    console.log("Admin users:");
    admins.forEach(user => {
      console.log(`UID: ${user.uid}, Email: ${user.email}, Name: ${user.displayName}`);
    });
  }
  process.exit(0);
}).catch(err => {
  // Handle errors in listing users
  console.error("Error listing admin users:", err);
  process.exit(1);
});
