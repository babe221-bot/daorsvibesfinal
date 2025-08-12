
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import app from './firebase';

const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence]
});
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
  const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
  connectAuthEmulator(auth, `http://${host}:9099`);
  connectFirestoreEmulator(db, host, 8080);
}

export { auth, db };
