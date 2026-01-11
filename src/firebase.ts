
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCiCkqrHcBJZVcy6RXsBKeb-NZXnKsAD6s",
  authDomain: "gratis-ngo-7bb44.firebaseapp.com",
  projectId: "gratis-ngo-7bb44",
  storageBucket: "gratis-ngo-7bb44.firebasestorage.app",
  messagingSenderId: "659832345710",
  appId: "1:659832345710:web:8048362b3636c465f4c27f",
  measurementId: "G-LF6HJ0RP8D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, functions, storage, analytics };
