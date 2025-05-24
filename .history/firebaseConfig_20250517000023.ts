// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB33LD5VDMxRv2Mg8hpqiakE1Z9-6NhaGY",
  authDomain: "calculocked-7c5c4.firebaseapp.com",
  projectId: "calculocked-7c5c4",
  storageBucket: "calculocked-7c5c4.firebasestorage.app",
  messagingSenderId: "500080347589",
  appId: "1:500080347589:web:d729814c48638e065163ac",
  measurementId: "G-20P1Y6JMQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
