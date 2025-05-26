const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "manohaircut.appspot.com"
});

const app = express();
app.use(cors());
app.use(express.json());

// app.post("/api/signup", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password){
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   try {
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//     });
//     res.status(201).json({ message: 'User Created Successfully', uid: userRecord.uid });
//   }
//   catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// })

// app.post("/api/signin", async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }
//   try {
//     const userRecord = await admin.auth().getUserByEmail(email);
//     // Here you would typically verify the password, but Firebase Auth does not allow direct password verification.
//     // You would need to use Firebase Client SDK for that.
//     res.status(200).json({ message: 'User signed in successfully', uid: userRecord.uid });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// })

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});






// Now you can use Admin SDK services
// const auth = admin.auth();
// const db = admin.firestore();
// auth.listUsers(1000).then(() => { ... });

// SITE KEY:   6LeBukcrAAAAAH3v-01Y-y-uOTAd4RtCtB5CEyUW
// SECRET KEY: 6LeBukcrAAAAAOBOlSLndpK70bmanCi_7rqG3vlp