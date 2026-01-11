import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiCkqrHcBJZVcy6RXsBKeb-NZXnKsAD6s",
  authDomain: "gratis-ngo-7bb44.firebaseapp.com",
  projectId: "gratis-ngo-7bb44",
  storageBucket: "gratis-ngo-7bb44.firebasestorage.app",
  messagingSenderId: "659832345710",
  appId: "1:659832345710:web:8048362b3636c465f4c27f",
  measurementId: "G-LF6HJ0RP8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addAdminRole() {
  try {
    const userId = "o2VNTdUnyVYJdUAxaLpXAjm2Eif1";

    console.log(`Adding admin role to user: ${userId}...`);

    // Create or update user document with admin role
    await setDoc(doc(db, "users", userId), {
      uid: userId,
      role: "admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log(`✓ Created/Updated user document with admin role`);

    // Create admin role in user_roles collection
    await setDoc(doc(db, "user_roles", userId), {
      user_id: userId,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    console.log(`✓ Admin role assigned in user_roles collection`);

    console.log("\n🎉 Admin role added successfully!");
    console.log("=======================================");
    console.log(`User ID: ${userId}`);
    console.log(`Role: admin`);
    console.log("=======================================");
    console.log("\nYou can now access the admin panel at http://localhost:8080/admin");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error adding admin role:", error.message);
    console.error(error);
    process.exit(1);
  }
}

addAdminRole();
