import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON)
  : undefined;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
  });
}

export const adminDb = admin.firestore();
