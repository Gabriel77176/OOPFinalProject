import { initializeApp } from 'firebase/app';

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword, getAuth
} from "firebase/auth";

import {
    collection,
    getDocs,
    getFirestore,
    query,
    where,
    deleteField,
    updateDoc
} from "firebase/firestore";

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
const auth = getAuth();

async function fixUser(user) {
    return new
        Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, user.data().email, user.data().password)
            .then(async (cred) => {

                updateDoc(user.ref, {
                    auth_id: cred.user.uid,
                    password: deleteField()
                })
                    .then(() => {
                        console.log('User created with ID: ', cred.user.uid);
                        resolve();
                    })
                    .catch((error) => {
                        console.log('Error updating user: ', error);
                        reject();
                    });
            })
            .catch((error) => {
                console.log('Error creating user: ', error);
                reject();
            });
    })
}

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value

    const emailQuery = query(collection(db, "user"), where("email", "==", email));

    getDocs(emailQuery)
        .then(async (querySnapshot) => {
            if (querySnapshot.empty) {
                console.log('No such user found');
                return;
            }

            const myUser = querySnapshot.docs[0];
            if (myUser.data().auth_id !== "fakeUser") {
                signInWithEmailAndPassword(auth, email, password)
                    .then((cred) => {
                        console.log('user logged in: ', cred.user)
                        loginForm.reset()
                        window.location.href = 'index.html';
                        console.log('user logged in: ', cred.user.email)
                    })
                    .catch((err) => {
                        console.log(err.message)
                    })
            }
            else {
                if (myUser.data().password === password) {
                    await fixUser(myUser)
                        .then(() => {
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error('Error creating user: ', error);
                        });
                }
                else
                {
                    console.log("Mauvais mdp")
                }
            }
        })
})