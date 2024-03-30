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

const userCollection = collection(db, "user");
const classCollection = collection(db, "class");

async function createUser(firstName, lastName, phoneNumber, email, password, auth_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = await addDoc(userCollection, {
                firstName: firstName,
                lastName: lastName,
                role: "lecturer",
                phoneNumber: phoneNumber,
                email: email,
                auth_id: auth_id,
                password: password
            });
            console.log("User created with ID: ", docRef.id);
            resolve(docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
            reject(e);
        }
    });
}


const createAccountForm = document.querySelector("#create-account-form");
createAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = createAccountForm.first_name.value;
    const lastName = createAccountForm.last_name.value;
    const phoneNumber = createAccountForm.phone_number.value;
    const email = createAccountForm.email.value;
    const password = createAccountForm.password.value;

    console.log(firstName, lastName, phoneNumber, email, password);

    createUser(firstName, lastName, phoneNumber, email, password, "fakeUser")
        .then(() => {
            alert("Account created successfully!")
            createAccountForm.reset();
            window.history.back();
                })
        .catch((error) => {
            console.error('Error creating user: ', error);
        });
});