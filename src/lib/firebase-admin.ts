import admin from "firebase-admin";
<<<<<<< HEAD
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
=======

let serviceAccount;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    }
} catch (e) {
    console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
}

if (!admin.apps.length) {
  try {
      admin.initializeApp({
        credential: serviceAccount
          ? admin.credential.cert(serviceAccount)
          : admin.credential.applicationDefault(),
      });
  } catch(e) {
      console.error("Failed to initialize Firebase Admin SDK:", e);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
>>>>>>> 393eea469d735144848945653dca895f2deb8842
