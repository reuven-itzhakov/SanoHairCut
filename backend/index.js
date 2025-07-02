// index.js
// Main entry point for the backend Express server.
// Initializes Firebase Admin SDK, sets up middleware, and registers API routes.

const express = require("express"); // Express web framework
const cors = require("cors"); // Middleware for enabling CORS
const admin = require("firebase-admin"); // Firebase Admin SDK
const serviceAccount = require("./firebase-admin.json"); // Service account credentials

// Initialize Firebase Admin SDK with service account and storage bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sanohaircut.appspot.com"
});

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
const db = admin.firestore(); // Firestore database instance

// Routers
// Import and register the appointments API router
const appointmentsRouter = require("./routes/appointments")(db, admin);
app.use("/api", appointmentsRouter);
// Import and register the user API router
const userRouter = require("./routes/user")(db, admin);
app.use("/api", userRouter);
// Import and register the times API router
const timesRouter = require("./routes/times")(db, admin);
app.use("/api", timesRouter);

// Start the server on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

