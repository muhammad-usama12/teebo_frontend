// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAuFwplHaRHAzNMf01DpRYr6Ho3G1M4jA4",
  authDomain: "teebo-d73f3.firebaseapp.com",
  projectId: "teebo-d73f3",
  storageBucket: "teebo-d73f3.appspot.com",
  messagingSenderId: "102496492051",
  appId: "1:102496492051:web:e1d425dadba91b816f3de6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)