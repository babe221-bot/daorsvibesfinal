
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyCX6PUqtE2SlQBuehPoqIGF22rw5zPQvH4",
  authDomain: "daorsvibesfinal.firebaseapp.com",
  databaseURL: "https://daorsvibesfinal-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "daorsvibesfinal",
  storageBucket: "daorsvibesfinal.firebasestorage.app",
  messagingSenderId: "546716533764",
  appId: "1:546716533764:web:273ccf84167a614ac12151",
  measurementId: "G-R5TM91LP8J"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
