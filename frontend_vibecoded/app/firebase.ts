// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx1mCtlYk52pBrnSbaRv9zLe3kgRpcsyc",
  authDomain: "baton-hackrice.firebaseapp.com",
  projectId: "baton-hackrice",
  storageBucket: "baton-hackrice.firebasestorage.app",
  messagingSenderId: "586799037369",
  appId: "1:586799037369:web:da40f05af186f167aed468",
  measurementId: "G-0KL5FM4D3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);