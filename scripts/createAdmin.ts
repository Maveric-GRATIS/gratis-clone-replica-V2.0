import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

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
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    console.log("Creating admin user...");

    // Get email and password from command line or use defaults
    const email = process.argv[2] || "admin@gratis.ngo";
    const password = process.argv[3] || "admin123456";
    const displayName = process.argv[4] || "Admin User";

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log(`✓ User created in Firebase Auth: ${user.uid}`);

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: "admin", // Default role in user document
    });

    console.log(`✓ User document created in Firestore`);

    // Create admin role in user_roles collection
    await setDoc(doc(db, "user_roles", user.uid), {
      user_id: user.uid,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    console.log(`✓ Admin role assigned in user_roles collection`);

    console.log("\n🎉 Admin account created successfully!");
    console.log("=======================================");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`Display Name: ${displayName}`);
    console.log(`User ID: ${user.uid}`);
    console.log("=======================================");
    console.log("\nYou can now login with these credentials at http://localhost:8080/auth");

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error creating admin user:", error.message);
    if (error.code === "auth/email-already-in-use") {
      console.log("\n💡 Tip: This email is already registered. Try a different email or login with existing credentials.");
    }
    process.exit(1);
  }
}

createAdminUser();
