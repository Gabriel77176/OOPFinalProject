import { initializeApp } from 'firebase/app';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {addDoc, collection, doc, getDoc, getDocs, getFirestore, query, Timestamp, where} from "firebase/firestore";

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

let params = new URLSearchParams(window.location.search);
let module_id = params.get("module_id");
console.log("MODULE: ", module_id);


const form = document.getElementById("add-exam-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const examName = document.getElementById("exam-name").value;
    const examDate = document.getElementById("exam-date").value;
    const examCoef = document.getElementById("exam-coef").value;
    const examDateTimestamp = Timestamp.fromDate(new Date(examDate));
    const examDescription = document.getElementById("exam-description").value;

    const newExam = {
        name: examName,
        date: examDateTimestamp,
        coef: examCoef,
        module_id: module_id,
        description: examDescription
    };

    try {
        const docRef = await addDoc(collection(db, "event"), newExam);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});