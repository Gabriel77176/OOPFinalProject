import {initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import {collection, doc, getDoc, setDoc, getDocs, getFirestore, query, where} from "firebase/firestore";


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
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
const userCollection = collection(db, 'user');
const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");


onAuthStateChanged(auth, (user) => {
    if (user) {
        // Personal information Part
        const userQuery = query(userCollection, where("auth_id", "==", user.uid));
        console.log(userQuery);
        getDocs(userQuery).then((querySnapshot) => {
            querySnapshot.forEach((docuser) => {
                firstName.innerHTML = docuser.data().firstName;
                lastName.innerHTML = docuser.data().lastName;
                email.innerHTML = docuser.data().email;
                phone.innerHTML = docuser.data().phoneNumber;
            });
        });
    }
    else
    {
        console.log("déconnecté");
    }
});

const button = document.querySelector("#button-modif");
const container = document.querySelector(".container");
button.addEventListener("click", () => {
    firstName.innerHTML = `<input type="text" value="${firstName.innerHTML}">`;
    lastName.innerHTML = `<input type="text" value="${lastName.innerHTML}">`;
    phone.innerHTML = `<input type="text" value="${phone.innerHTML}">`;
    button.style.display = "none";
    const buttonSave = document.createElement("button");
    buttonSave.innerHTML = "Save";
    buttonSave.className = "modifier-btn";
    container.appendChild(buttonSave);
    buttonSave.addEventListener("click", () => {
        const userQuery = query(userCollection, where("auth_id", "==", auth.currentUser.uid));
        getDocs(userQuery).then((querySnapshot) => {
            querySnapshot.forEach((docuser) => {
                const userRef = doc(db, 'user', docuser.id);
                setDoc(userRef, {
                    firstName: firstName.querySelector("input").value,
                    lastName: lastName.querySelector("input").value,
                    phoneNumber: phone.querySelector("input").value
                }, {merge: true}).then(r => {
                    firstName.innerHTML = firstName.querySelector("input").value;
                    lastName.innerHTML = lastName.querySelector("input").value;
                    phone.innerHTML = phone.querySelector("input").value;
                });
            });
        });
        button.style.display = "block";
        buttonSave.remove();
    });
});

const logoutButton = document.getElementById("button-logout");
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});