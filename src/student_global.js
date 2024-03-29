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
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        const q = query(collection(db, "user"), where("auth_id", "==", user.uid));

        getDocs(q).then(querySnapshot => {
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0].data();
                if (doc.role !== "student") {
                    window.location.href = "../index.html";
                }
            } else {
                window.location.href = "../index.html";
            }
        }).catch(error => {
            console.log(error);
        });
    }
    else
    {
        window.location.href = "../index.html";
    }
});