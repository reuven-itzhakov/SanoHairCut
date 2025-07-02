const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sanohaircut.appspot.com"
});

const app = express();
app.use(cors());
app.use(express.json());
const db = admin.firestore();

// Routers
const appointmentsRouter = require("./routes/appointments")(db, admin);
app.use("/api", appointmentsRouter);
const userRouter = require("./routes/user")(db, admin);
app.use("/api", userRouter);
const timesRouter = require("./routes/times")(db, admin);
app.use("/api", timesRouter);


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