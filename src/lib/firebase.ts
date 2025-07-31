// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

let firebaseConfig;
<<<<<<< HEAD

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
=======
try {
    if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
        firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    } else {
        throw new Error("Firebase config environment variable not found.");
    }
} catch (e) {
    console.error("Failed to parse Firebase config:", e);
    firebaseConfig = undefined;
>>>>>>> 393eea469d735144848945653dca895f2deb8842
}


// Initialize Firebase
<<<<<<< HEAD
const app = !getApps().length && firebaseConfig ? initializeApp(firebaseConfig) : (getApps().length > 0 ? getApp() : undefined);

export default app;
=======
const app = !getApps().length && firebaseConfig ? initializeApp(firebaseConfig) : getApp();

export default app;
>>>>>>> 393eea469d735144848945653dca895f2deb8842
