import * as admin from "firebase-admin";
import "server-only";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

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

const adminDb = admin.apps.length ? admin.firestore() : undefined;
const adminAuth = admin.apps.length ? admin.auth() : undefined;

export { adminAuth, adminDb };
