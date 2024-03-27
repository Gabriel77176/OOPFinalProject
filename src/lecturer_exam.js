import { initializeApp } from 'firebase/app';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, where} from "firebase/firestore";

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
let exam_id = params.get("exam_id");
console.log("MODULE: ", exam_id);

let globalUser = null;
async function getUser() {
    return new Promise((resolve, reject) => {
        if (globalUser) {
            const q = query(collection(db, "user"), where("auth_id", "==", globalUser.uid));

            getDocs(q).then(querySnapshot => {
                if (!querySnapshot.empty) {
                    resolve(querySnapshot.docs[0]);
                } else {
                    reject("User not found in database.");
                }
            }).catch(error => {
                reject(error);
            });
        } else {
            reject("User not logged in, please log in first.");
        }
    });
}



onAuthStateChanged(auth, async user2 => {
    if (user2) {
        globalUser = user2;

        const user = await getUser();

        let examRef = doc(db, "event", exam_id);
        getDoc(examRef)
            .then((docu) => {
                if (docu.exists()) {
                    let examData = docu.data();

                    let date = new Date(examData.date.seconds * 1000);
                    let formattedDate = date.toISOString().split('T')[0];
                    let options = {year: 'numeric', month: 'long', day: 'numeric'};

                    document.getElementById('name-span').textContent = examData.name;
                    document.getElementById('description-span').textContent = examData.description; // examData.description
                    document.getElementById('coef-span').textContent = examData.coef;
                    document.getElementById('date-span').textContent = formattedDate;

                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
});

const button = document.getElementById('modify');
button.addEventListener('click', async () => {

    const name = document.getElementById('name-span');
    const description = document.getElementById('description-span');
    const coef = document.getElementById('coef-span');
    const date = document.getElementById('date-span');

    name.innerHTML = `<input type="text" value="${name.textContent}">`;
    description.innerHTML = `<input type="text" value="${description.textContent}">`;
    coef.innerHTML = `<input type="number" value="${coef.textContent}">`;
    date.innerHTML = `<input type="date" value="${date.textContent}">`;

    const buttonSave = document.createElement("button");
    buttonSave.innerHTML = "Save";
    buttonSave.className = "modifier-btn";
    buttonSave.id = "save";
    button.parentNode.appendChild(buttonSave);
    button.style.display = "none";

    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', async () => {
        const name = document.getElementById('name-span').querySelector("input").value;
        const description = document.getElementById('description-span').querySelector("input").value;
        const coef = document.getElementById('coef-span').querySelector("input").value;
        const date = document.getElementById('date-span').querySelector("input").value;
        const examDateTimestamp = Timestamp.fromDate(new Date(date));

        let examRef = doc(db, "event", exam_id);
        getDoc(examRef)
            .then((docu) => {
                if (docu.exists()) {
                    let examData = docu.data();

                    setDoc(examRef, {
                        name: name,
                        description: description,
                        coef: coef,
                        date: examDateTimestamp
                    }, {merge: true}).then(() => {
                        console.log("Document successfully written!");
                        window.location.reload();
                    }).catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
            console.log("Error getting document:", error);
        });

        saveButton.remove();
        button.style.display = "block";
    });
});

