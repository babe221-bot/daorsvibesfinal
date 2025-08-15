// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { firebaseConfig } from "./firebase-config";


// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} else {
  app = getApps()[0]!;
  analytics = getAnalytics(app);
}

export default app;
export { analytics };
