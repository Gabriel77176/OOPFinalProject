import { initializeApp } from 'firebase/app';


import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {addDoc, collection, doc, getDoc, getDocs, getFirestore} from "firebase/firestore";

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

let params = new URLSearchParams(window.location.search);
let module_id = params.get("module_id");
console.log(module_id);

const moduleCollection = collection(db, "module");
const userCollection = collection(db, "user");

let moduleDocRef = doc(db, "module", module_id);
let moduleData;

await getDoc(moduleDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
        // The document exists, store its data in a variable
        moduleData = docSnapshot.data();
        console.log(moduleData);
    } else {
        alert("No such document!")
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

let h1_module_name = document.querySelector("#h1-module-name");
h1_module_name.innerHTML = moduleData.name;

getDocs(userCollection).then((querySnapshot) => {
    const tbody = document.querySelector('#tbody-users');

    querySnapshot.forEach((doc) => {
        if (doc.data().role === 'lecturer') {
            let row = document.createElement('tr');

            let nameCell = document.createElement('td');
            nameCell.textContent = doc.data().firstName + ' ' + doc.data().lastName;
            row.appendChild(nameCell);

            let roleCell = document.createElement('td');
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "student";
            /*if (doc.data().module_id === module_id) {
                checkbox.checked = true;
            }*/
            roleCell.appendChild(checkbox);
            row.appendChild(roleCell);

            tbody.appendChild(row);
        }
    });
});
