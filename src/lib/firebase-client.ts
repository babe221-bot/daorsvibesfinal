
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let analytics: Analytics | undefined;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} else {
  app = getApps()[0];
  auth = getAuth(app);
  firestore = getFirestore(app);
}

export { app, auth, firestore, analytics };
