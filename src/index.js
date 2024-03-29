// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import {collection, getDocs, getFirestore, query, where} from "firebase/firestore";
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(collection(db, "user"), where("auth_id", "==", user.uid));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.size === 0) {
        signOut(auth).then(r => {
          console.log('No user found');
          window.location.href = 'login.html';
        });
      } else {
        const user = querySnapshot.docs[0].data();
        if (user.role === 'admin') {
          window.location.href = './admin/index.html';
        } else if (user.role === 'student') {
          window.location.href = './student/index.html';
        } else {
          window.location.href = './lecturer/index.html';
        }
      }
    }); // Added closing parenthesis here
  } else {
    window.location = 'login.html';
  }
});