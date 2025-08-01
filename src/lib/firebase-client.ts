
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import app from './firebase';

const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

export { auth, db };
