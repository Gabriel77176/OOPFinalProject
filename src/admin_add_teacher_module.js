import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut
} from "firebase/auth";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";

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
const userModuleCollection = collection(db, "user_module");

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

    querySnapshot.forEach((docu) => {
        if (docu.data().role === 'lecturer') {
            let row = document.createElement('tr');

            let nameCell = document.createElement('td');
            nameCell.textContent = docu.data().firstName + ' ' + docu.data().lastName;
            row.appendChild(nameCell);

            let roleCell = document.createElement('td');
            let checkbox = document.createElement('input');
            checkbox.type = "checkbox";
            checkbox.name = "student";
            checkbox.value = docu.id;

            // Check if a document exists in the user_module collection with module_id = module_id and user_id = current user's id

            const q = query(userModuleCollection, where("module_id", "==", module_id), where("user_id", "==", docu.id));

            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    checkbox.checked = true;
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });

            roleCell.appendChild(checkbox);
            row.appendChild(roleCell);

            tbody.appendChild(row);
        }
    });
});

async function isModuleThere(module_id, checkbox) {
    return new Promise((resolve, reject) => {
        let is_there = false;

        const q = query(userModuleCollection, where("module_id", "==", module_id), where("user_id", "==", checkbox.value));

        getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((docu) => {
                is_there = true;
                console.log("Chgt à true");
            });
            resolve(is_there);
        }).catch((error) => {
            console.log("Error getting documents: ", error);
            reject(error);
        });
    });
}

let form = document.querySelector("#add-teacher-module-form");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let checkboxes = document.querySelectorAll('input[type=checkbox]');

    checkboxes.forEach( async (checkbox) => {
        if (checkbox.checked === false) {
            let userId = checkbox.value;

            const q = query(userModuleCollection, where("module_id", "==", module_id), where("user_id", "==", checkbox.value));

            getDocs(q).then((querySnapshot) => {
                querySnapshot.forEach((docu) => {
                    deleteDoc(docu.ref).then(() => {
                        console.log("Document successfully deleted!");
                    }).catch((error) => {
                        console.error("Error removing document: ", error);
                    })
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            });
        }
        else {
            let is_there = await isModuleThere(module_id, checkbox);

            if (is_there === false) {
                console.log("Verification")
                addDoc(userModuleCollection, {
                    user_id: checkbox.value,
                    module_id: module_id
                }).then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                }).catch((error) => {
                    console.error("Error adding document: ", error);
                });
            }
        }
    });
});