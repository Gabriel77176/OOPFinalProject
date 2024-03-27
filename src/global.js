import { initializeApp } from 'firebase/app';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, onAuthStateChanged
} from "firebase/auth";

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

const auth = getAuth();

const debug_p = document.querySelector('#connect-p');

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, display the email
        debug_p.innerHTML = user.email;
        console.log("connecté");
    } else {
        // No user is signed in, display "non connecté"
        debug_p.innerHTML = "Not Connected";
        console.log("non connecté");

    }
});