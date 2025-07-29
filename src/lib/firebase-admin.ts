import * as admin from "firebase-admin";
import "server-only";

let serviceAccount: object | null = null;
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (serviceAccountKey) {
  try {
    // Directly parse if it's a valid JSON string
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (e) {
    // If parsing fails, it might be due to escaping issues with newlines in the private key.
    console.warn("Could not parse FIREBASE_SERVICE_ACCOUNT_KEY directly. Attempting to fix newlines...");
    try {
      const keyWithFixedNewlines = serviceAccountKey.replace(/
/g, '
');
      serviceAccount = JSON.parse(keyWithFixedNewlines);
    } catch (e2) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY after attempting to fix newlines.", e2);
    }
  }
}

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } else {
    console.warn(
      "Firebase Admin SDK not initialized. Missing or invalid FIREBASE_SERVICE_ACCOUNT_KEY. Server-side Firebase features will be disabled."
    );
  }
}

const adminDb = admin.apps.length ? admin.firestore() : undefined;
const adminAuth = admin.apps.length ? admin.auth() : undefined;

export { adminAuth, adminDb };
