
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

let firebaseConfig;

if (typeof window !== "undefined") {
    try {
        const configString = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;
        if (configString) {
            firebaseConfig = JSON.parse(configString);
        } else {
            console.error("Firebase config environment variable not found.");
        }
    } catch (e) {
        console.error("Failed to parse Firebase config:", e);
        firebaseConfig = undefined;
    }
}


// Initialize Firebase
const app = !getApps().length && firebaseConfig ? initializeApp(firebaseConfig) : (getApps().length > 0 ? getApp() : undefined);

export default app;
