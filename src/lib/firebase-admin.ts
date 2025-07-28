import { initializeApp, getApps, App, cert } from "firebase-admin/app";
import "server-only";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let adminApp: App;

export async function initFirebaseAdminApp() {
  if (getApps().length > 0) {
    adminApp = getApps()[0];
    return;
  }
  
  if (!serviceAccount) {
    console.warn(
      "Firebase Admin SDK not initialized. Missing FIREBASE_SERVICE_ACCOUNT_KEY. Server-side Firebase features will be disabled."
    );
    throw new Error("Firebase Admin SDK not initialized.");
  }

  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
}
