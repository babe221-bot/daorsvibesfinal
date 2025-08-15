
import {
  getAuth,
  connectAuthEmulator,
} from 'firebase/auth';
import {
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import app from './firebase';

const auth = getAuth(app);
const db = getFirestore(app);

if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
  const host = process.env.NEXT_PUBLIC_EMULATOR_HOST;
  try {
    connectAuthEmulator(auth, `http://${host}:9099`);
  } catch (e) {
    console.error(e);
  }
  try {
    connectFirestoreEmulator(db, host, 8080);
  } catch (e) {
    console.error(e);
  }
}

export { auth, db };
