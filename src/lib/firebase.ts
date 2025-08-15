
import admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-config';

if (!getApps().length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

export { auth, firestore };
