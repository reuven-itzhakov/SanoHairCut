import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAJ7fErCrVZWdvbXwUvGP2VmYcycBOKk_M",
  authDomain: "manohaircut.firebaseapp.com",
  projectId: "manohaircut",
  storageBucket: "manohaircut.firebasestorage.app",
  messagingSenderId: "767285803812",
  appId: "1:767285803812:web:da74c2600223f1633211b1",
  measurementId: "G-MVLJVT4XQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// key is the counterpart to the secret key you set in the Firebase console.
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LeBukcrAAAAAH3v-01Y-y-uOTAd4RtCtB5CEyUW'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});

export const auth = getAuth(app);