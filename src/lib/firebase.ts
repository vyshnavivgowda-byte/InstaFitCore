// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDslmQ2GBgeJsauUcd-s4lu4yaY76bISLw",
  authDomain: "instafitcore-85684.firebaseapp.com",
  projectId: "instafitcore-85684",
  storageBucket: "instafitcore-85684.firebasestorage.app",
  messagingSenderId: "230563962822",
  appId: "1:230563962822:web:45b71d499e73a78fb71cc7",
  measurementId: "G-TN4MCKS5GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);