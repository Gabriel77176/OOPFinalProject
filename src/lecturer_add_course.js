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


const form = document.getElementById("add-course-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const courseName = document.getElementById("course-name").value;
    const courseTimeIn = document.getElementById("course-timein").value;
    const courseTimeOut = document.getElementById("course-timeout").value;
    const courseDateTimestampIN = Timestamp.fromDate(new Date(courseTimeIn));
    const courseDateTimestampOUT = Timestamp.fromDate(new Date(courseTimeOut));
    const courseDescription = document.getElementById("course-description").value;

    const newCourse = {
        name: courseName,
        time_in: courseDateTimestampIN,
        time_out: courseDateTimestampOUT,
        module_id: module_id,
        description: courseDescription
    };

    try {
        const docRef = await addDoc(collection(db, "course"), newCourse);
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});