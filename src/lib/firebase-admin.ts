import * as admin from "firebase-admin";
import "server-only";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn(
      "Firebase Admin SDK not initialized. Missing FIREBASE_SERVICE_ACCOUNT_KEY. Server-side Firebase features will be disabled."
    );
  }
}

const adminAuth = admin.apps.length ? admin.auth() : undefined;
const adminDb = admin.apps.length ? admin.firestore() : undefined;

export { adminAuth, adminDb };
