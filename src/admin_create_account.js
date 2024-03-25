import { initializeApp } from 'firebase/app';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {addDoc, collection, getFirestore} from "firebase/firestore";

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

async function createUser(firstName, lastName, role, phoneNumber, email, password, class_id, auth_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const docRef = await addDoc(userCollection, {
                firstName: firstName,
                lastName: lastName,
                role: role,
                phoneNumber: phoneNumber,
                email: email,
                class_id: class_id,
                auth_id: auth_id
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
    const role = createAccountForm.role.value;
    const phoneNumber = createAccountForm.phone_number.value;
    const email = createAccountForm.email.value;
    const password = createAccountForm.password.value;
    const class_id = createAccountForm.class.value;

    console.log(firstName, lastName, role, phoneNumber, email, password);

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // The user has been created and signed in
            console.log('User created: ', userCredential.user)
            createUser(firstName, lastName, role, phoneNumber, email, password, class_id, userCredential.user.uid)
                .then(() => {
                    console.log("User Created")
                    signOut(auth)
                        .then(() => {
                        console.log('User signed out');
                        createAccountForm.reset();
                        })
                        .catch((error) => {
                            console.error('Error signing out: ', error);
                        });

                })
                .catch((err) =>
                    console.log(err.message)
                );
        })
        .catch((error) => {
            console.error('Error creating user: ', error);
        });
});

