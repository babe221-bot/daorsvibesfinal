import admin from "firebase-admin";
import { getApps } from "firebase-admin/app";

// Inicijalizacija Firebase Admin SDK-a samo ako već nije inicijaliziran
if (!getApps().length) {
    try {
        admin.initializeApp();
    } catch (e) {
        console.error("Firebase admin initialization error:", e);
    }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
