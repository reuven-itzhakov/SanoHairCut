var admin = require("firebase-admin");

var serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "manohaircut.appspot.com"
});

// Now you can use Admin SDK services
// const auth = admin.auth();
// const db = admin.firestore();
// auth.listUsers(1000).then(() => { ... });

// SITE KEY:   6LeBukcrAAAAAH3v-01Y-y-uOTAd4RtCtB5CEyUW
// SECRET KEY: 6LeBukcrAAAAAOBOlSLndpK70bmanCi_7rqG3vlp