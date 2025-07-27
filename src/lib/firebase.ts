
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDxwAQf6RX8UHlbjPpnjMVX-0jS85K3bvw",
  authDomain: "website-5a18c.firebaseapp.com",
  projectId: "website-5a18c",
  storageBucket: "website-5a18c.appspot.com",
  messagingSenderId: "636702053767",
  appId: "1:636702053767:web:efb577d6c53d4d06bd6f22",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { app, auth, db, storage, firebase };
