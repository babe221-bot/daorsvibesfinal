// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

let firebaseConfig;

if (typeof window !== "undefined") {
    try {
        if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
            firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        } else {
            throw new Error("Firebase config environment variable not found.");
        }
    } catch (e) {
        console.error("Failed to parse Firebase config:", e);
        firebaseConfig = undefined;
    }
}


// Initialize Firebase
const app = !getApps().length && firebaseConfig ? initializeApp(firebaseConfig) : getApp();

export default app;