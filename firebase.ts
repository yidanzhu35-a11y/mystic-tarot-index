// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDe6VRGVGyCWM9ITt2zX3qKHMetSaHHiYU",
  authDomain: "mystic-tarot-index.firebaseapp.com",
  projectId: "mystic-tarot-index",
  storageBucket: "mystic-tarot-index.firebasestorage.app",
  messagingSenderId: "767551112403",
  appId: "1:767551112403:web:188fc1de2a89be011f0026",
  measurementId: "G-MKWCW692DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };
export default app;