// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgIykVwPcv67Qem8iiqEdS_D3Ms8F7Zf4",
  authDomain: "oopfinalproject-1ad78.firebaseapp.com",
  projectId: "oopfinalproject-1ad78",
  storageBucket: "oopfinalproject-1ad78.appspot.com",
  messagingSenderId: "10697858559",
  appId: "1:10697858559:web:0eea452e24f9883f6e9bca",
  measurementId: "G-2ZS6JBKR21"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const db = getFirestore();

const userCollection = collection(db, "user");
const moduleCollection = collection(db, "module");