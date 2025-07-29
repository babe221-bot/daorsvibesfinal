import * as admin from "firebase-admin";
import "server-only";

let adminDb: admin.firestore.Firestore | undefined;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (!admin.apps.length) {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      adminDb = admin.firestore();
    } else {
      console.warn(
        "Firebase Admin SDK not initialized. Missing FIREBASE_SERVICE_ACCOUNT_KEY. Server-side Firebase features will be disabled."
      );
    }
  } else {
    adminDb = admin.firestore();
  }
} catch (e: any) {
  console.error("Firebase Admin SDK initialization failed:", e.message);
}

const adminAuth = admin.apps.length ? admin.auth() : undefined;

export { adminAuth, adminDb };
