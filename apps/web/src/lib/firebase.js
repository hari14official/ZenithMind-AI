import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "zenithmind-ai.firebaseapp.com",
    projectId: "zenithmind-ai",
    storageBucket: "zenithmind-ai.firebasestorage.app",
    messagingSenderId: "945294746410",
    appId: "1:945294746410:web:7de2fd931d58a1b7067453",
    measurementId: "G-2KCQR4122L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
