
import admin from 'firebase-admin';
import { getApps, initializeApp, getApp, App } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import { Song } from './types';

function initializeAdminApp(): App | null {
  if (getApps().length === 0) {
    try {
      if (process.env.FIREBASE_PRIVATE_KEY) {
        initializeApp({
          credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        initializeApp({
          credential: credential.applicationDefault(),
        });
      } else {
        initializeApp();
      }
    } catch (e: any) {
      console.error('Firebase admin initialization error:', e.message);
      return null;
    }
  }
  return getApp();
}

function getAdminDb() {
  const app = initializeAdminApp();
  if (!app) {
    console.error('Firebase Admin App is not initialized.');
    return null;
  }
  return admin.firestore();
}

function getAdminAuth() {
  const app = initializeAdminApp();
  if (!app) {
    console.error('Firebase Admin App is not initialized.');
    return null;
  }
  return admin.auth();
}

export async function getSong(songId: string): Promise<Song | null> {
  const db = getAdminDb();
  if (!db) {
    return null;
  }

  const songRef = db.collection('songs').doc(songId);
  const songDoc = await songRef.get();

  if (!songDoc.exists) {
    return null;
  }

  return { id: songDoc.id, ...songDoc.data() } as Song;
}

export { getAdminDb, getAdminAuth };
