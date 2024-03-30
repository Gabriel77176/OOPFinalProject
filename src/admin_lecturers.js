import { initializeApp } from 'firebase/app';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";

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

// Query Firestore for users in the class
const q = query(collection(db, "user"), where("role", "==", "lecturer"));
const userQuerySnapshot = await getDocs(q);

// Create table and populate with user data
let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

// Create table header
let headerRow = document.createElement('tr');
let nameHeader = document.createElement('th');
nameHeader.textContent = 'Name';
headerRow.appendChild(nameHeader);

let emailHeader = document.createElement('th');
emailHeader.textContent = 'Email';
headerRow.appendChild(emailHeader);

thead.appendChild(headerRow);
table.appendChild(thead);

// Populate table body with user data
userQuerySnapshot.forEach(doc => {
    let user = doc.data();
    let row = document.createElement('tr');

    let nameCell = document.createElement('td');
    nameCell.textContent = user.firstName + ' ' + user.lastName;
    row.appendChild(nameCell);

    let emailCell = document.createElement('td');
    emailCell.textContent = user.email;
    row.appendChild(emailCell);

    tbody.appendChild(row);
});

table.appendChild(tbody);

// Append the table to a container in your HTML
const tableContainer = document.getElementById('userTableContainer');
console.log(tableContainer);
tableContainer.appendChild(table);

const addLecturerButton = document.getElementById('addLecturer');
addLecturerButton.addEventListener('click', () => {
    window.location.href = "create_lecturer.html";
});
