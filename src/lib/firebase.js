import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqx8ohyJsoXAyxoYclWPAGXoSLVSdvSjQ",
  authDomain: "chatapp-3a3d3.firebaseapp.com",
  projectId: "chatapp-3a3d3",
  storageBucket: "chatapp-3a3d3.firebasestorage.app",
  messagingSenderId: "364202825835",
  appId: "1:364202825835:web:1be41f6b3f1f3dcfe1b92e",
  measurementId: "G-6N87WMMZGV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storageF = getStorage(app);
