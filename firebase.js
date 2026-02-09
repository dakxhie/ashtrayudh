// firebase.js (Astrayudh Firebase Setup)

// Import Firebase SDK (Module version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCzRcanZqOZPf8bNq0zP7wkyICntaUr8bs",
  authDomain: "astrayudh-7626b.firebaseapp.com",
  projectId: "astrayudh-7626b",
  storageBucket: "astrayudh-7626b.firebasestorage.app",
  messagingSenderId: "427419109726",
  appId: "1:427419109726:web:134b8f06fbee142cf6a7cf"
};

// Initialize Firebase
console.log("[FIREBASE] 🔧 Initializing Firebase with config...");
export const app = initializeApp(firebaseConfig);
console.log("[FIREBASE] ✅ Firebase initialized");

// Export Firestore Database
export const db = getFirestore(app);
console.log("[FIREBASE] ✅ Firestore initialized - Project ID:", firebaseConfig.projectId);

// Export Authentication
export const auth = getAuth(app);
console.log("[FIREBASE] ✅ Authentication initialized");

