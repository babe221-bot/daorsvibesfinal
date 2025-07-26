// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxwAQf6RX8UHlbjPpnjMVX-0jS85K3bvw",
  authDomain: "website-5a18c.firebaseapp.com",
  projectId: "website-5a18c",
  storageBucket: "website-5a18c.firebasestorage.app",
  messagingSenderId: "636702053767",
  appId: "1:636702053767:web:efb577d6c53d4d06bd6f22",
  measurementId: "G-PFBBB905RC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
