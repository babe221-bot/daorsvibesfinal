// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";

// This check ensures we only try to parse the config once.
const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG 
    ? JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) 
    : undefined;

// Initialize Firebase only if it hasn't been initialized yet.
const app = !getApps().length && firebaseConfig ? initializeApp(firebaseConfig) : getApp();

export default app;
