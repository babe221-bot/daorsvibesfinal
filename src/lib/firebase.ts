import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage }_from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDxwAQf6RX8UHlbjPpnjMVX-0jS85K3bvw",
    authDomain: "website-5a18c.firebaseapp.com",
    projectId: "website-5a18c",
    storageBucket: "website-5a18c.appspot.com",
    messagingSenderId: "636702053767",
    appId: "1:636702053767:web:efb577d6c53d4d06bd6f22",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Point to the emulators
    connectAuthEmulator(auth, 'http://localhost:9101');
    connectFirestoreEmulator(db, 'localhost', 8082);
}


export { app, auth, db, storage };
