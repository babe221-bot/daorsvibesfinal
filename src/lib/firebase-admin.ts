import admin from "firebase-admin";

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