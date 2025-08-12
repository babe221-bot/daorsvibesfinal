import admin from "firebase-admin";
import { getApps, initializeApp, getApp } from "firebase-admin/app";
import { credential } from "firebase-admin";
import { Song } from "./types";

function initializeAdminApp() {
    if (getApps().length === 0) {
        try {
            // In a hosted environment, GOOGLE_APPLICATION_CREDENTIALS should not be set
            // and the SDK will automatically discover credentials.
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                initializeApp({
                    credential: credential.applicationDefault(),
                });
            } else {
                initializeApp();
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error("Firebase admin initialization error:", e.message);
            } else {
                console.error("Firebase admin initialization error:", e);
            }
            // Return null or throw a more specific error to be caught by callers
            return null;
        }
    }
    return getApp();
}

function getAdminDb() {
    const app = initializeAdminApp();
    if (!app) {
        console.error("Firebase Admin App is not initialized.");
        return null;
    }
    return admin.firestore();
}

function getAdminAuth() {
    const app = initializeAdminApp();
     if (!app) {
        console.error("Firebase Admin App is not initialized.");
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
