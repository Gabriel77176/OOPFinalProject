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
let class_id = params.get("class_id");
console.log(class_id);

const moduleCollection = collection(db, "module");
const userCollection = collection(db, "user");

let classDocRef = doc(db, "class", class_id);
let classData;

await getDoc(classDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
        // The document exists, store its data in a variable
        classData = docSnapshot.data();
        console.log(classData);
    } else {
        alert("No such document!")
    }
}).catch((error) => {
    console.log("Error getting document:", error);
});

let h1_class_name = document.querySelector("#h1-class-name");
h1_class_name.innerHTML = classData.name;

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
            if (doc.data().class_id === class_id) {
                checkbox.checked = true;
            }
            roleCell.appendChild(checkbox);
            row.appendChild(roleCell);

            tbody.appendChild(row);
        }
    });
});
