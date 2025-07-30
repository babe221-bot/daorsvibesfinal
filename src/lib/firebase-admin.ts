import admin from "firebase-admin";

let adminDb: admin.firestore.Firestore;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    if (!admin.apps.length) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } catch (e) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
        }
    }
    adminDb = admin.firestore();
} else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY is not set. Firebase Admin SDK not initialized.");
    // Provide a dummy implementation or handle the case where adminDb is not available.
    adminDb = {} as admin.firestore.Firestore;
}

export { adminDb };
