import admin from "firebase-admin";

if (!admin.apps.length) {
    try {
        admin.initializeApp();
    } catch (e) {
        console.error("Firebase admin initialization error:", e);
    }
}


const adminDb = admin.firestore();

export { adminDb };
