// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getDatabase } from "firebase/database";   // Realtime Database
import { getAuth } from "firebase/auth"; // Firebase Authentication
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLCbhTQV4amNtdC-2CSInS5S5QTPHbd1c",
  authDomain: "catchyourgroup.firebaseapp.com",
  projectId: "catchyourgroup",
  storageBucket: "catchyourgroup.firebasestorage.app",
  messagingSenderId: "740003602816",
  appId: "1:740003602816:web:718c4b2df39226a8d7a165",
  measurementId: "G-27QHMZ48N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth=getAuth(app);
// Initialize Firestore and Realtime Database
const fsdb = getFirestore(app); // Firestore instance
const rtdb = getDatabase(app); // Realtime Database instance

export {app,auth,analytics,fsdb,rtdb};