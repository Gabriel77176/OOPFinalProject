import { initializeApp } from 'firebase/app';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {addDoc, collection, getDocs, getFirestore} from "firebase/firestore";

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
const db = getFirestore();

const classCollection = collection(db, "class");

async function createClass(name) {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = await addDoc(classCollection, {
                name: name,
            });
            console.log("User created with ID: ", docRef.id);
            resolve(docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
            reject(e);
        }
    });
}

const createClassForm = document.querySelector("#create-class-form");
createClassForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = createClassForm.name.value;

    createClass(name).then(() => {
        createClassForm.reset();
        window.history.back();
    }).catch((e) => {
        console.error(e);
    });
});