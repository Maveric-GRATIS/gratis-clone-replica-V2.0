/**
 * Fix Admin Role - Add user_roles document
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

// Your Firebase config (from .env or firebase config)
const firebaseConfig = {
  apiKey: "AIzaSyAn2m0EfKlBdJhTjXmUWFOG7W1tVrJb_2Q",
  authDomain: "gratis-ngo-7bb44.firebaseapp.com",
  projectId: "gratis-ngo-7bb44",
  storageBucket: "gratis-ngo-7bb44.firebasestorage.app",
  messagingSenderId: "659832345710",
  appId: "1:659832345710:web:d892a50f9ad11d2a99a932",
  measurementId: "G-8EZEKG5FJJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixAdminRole() {
  const userId = "Q6MBn8CKOFXGZMORpdh9tlEPO2n1"; // Your user ID

  try {
    console.log("🔧 Adding user_roles document...");

    // Add document to user_roles collection
    await setDoc(doc(db, "user_roles", userId), {
      user_id: userId,
      role: "admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Admin role fixed successfully!");
    console.log("🔄 Now refresh your browser and try again.");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixAdminRole();
