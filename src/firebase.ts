// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCiCkqrHcBJZVcy6RXsBKeb-NZXnKsAD6s",
  authDomain: "gratis-ngo-7bb44.firebaseapp.com",
  projectId: "gratis-ngo-7bb44",
  storageBucket: "gratis-ngo-7bb44.appspot.com",
  messagingSenderId: "659832345710",
  appId: "1:659832345710:web:8048362b3636c465f4c27f",
  measurementId: "G-LF6HJ0RP8D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
