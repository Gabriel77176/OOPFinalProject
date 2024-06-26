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
    const role = createAccountForm.role.value;
    const phoneNumber = createAccountForm.phone_number.value;
    const email = createAccountForm.email.value;
    const password = createAccountForm.password.value;
    const class_id = createAccountForm.class.value;

    console.log(firstName, lastName, role, phoneNumber, email, password);

    createUser(firstName, lastName, role, phoneNumber, email, password, class_id, "fakeUser")
        .then(() => {
            alert("Account created successfully!")
            createAccountForm.reset();
            window.history.back();
                })
        .catch((error) => {
            console.error('Error creating user: ', error);
        });
});

async function getClasses() {
    const querySnapshot = await getDocs(classCollection);
    const classes = querySnapshot.docs.map(doc => doc);
    return classes;
}

getClasses().then(classes => {
    const classSelect = document.querySelector("#class-select");
    if (classes.length > 0)
    {
        classSelect.innerHTML = "";
    }
    classes.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.text = classItem.data().name;
        classSelect.add(option);
    });
});