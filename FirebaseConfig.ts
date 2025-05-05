// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBon4oYzNZgRFtOX1jukeq8yWXSD1e-Ya0",
  authDomain: "calcpassapp.firebaseapp.com",
  projectId: "calcpassapp",
  storageBucket: "calcpassapp.firebasestorage.app",
  messagingSenderId: "350611884308",
  appId: "1:350611884308:web:b75d2044efbb449c9c9a01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;