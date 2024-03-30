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

async function goToModule(moduleId) {
    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "modules.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    urlObject.searchParams.append('module_id', moduleId);

    window.location.href = urlObject.toString();
}

async function goToClass(classId) {
    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "classes.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    urlObject.searchParams.append('class_id', classId);

    window.location.href = urlObject.toString();
}


const modulesDiv = document.getElementById("modules");
const modulesQuery = query(collection(db, "module"));
getDocs(modulesQuery).then(querySnapshot => {
    querySnapshot.forEach(doc => {
        const data = doc.data();
        const moduleA = document.createElement("a");
        moduleA.classList.add("div-a");
        moduleA.href = "#";
        moduleA.addEventListener("click", async () => {
            await goToModule(doc.id);
        });
        const moduleDiv = document.createElement("div");
        moduleDiv.classList.add("module");
        moduleDiv.classList.add("grid-div");
        moduleDiv.innerHTML = `<h2>${data.name}</h2><p>${data.description}</p>`;
        modulesDiv.appendChild(moduleDiv);

        moduleA.appendChild(moduleDiv);
        modulesDiv.prepend(moduleA);
    });
}).catch(error => {
    console.log(error);
});

const classesDiv = document.getElementById("classes");
const classesQuery = query(collection(db, "class"));
getDocs(classesQuery).then(async (querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const classA = document.createElement("a");
        classA.classList.add("div-a");
        classA.href = "#";
        classA.addEventListener("click", async () => {
            await goToClass(doc.id);
        });

        let nbStudent = 0;
        const studentsQuery = query(collection(db, "user"), where("role", "==", "student"), where("class_id", "==", doc.id));
        const querySnapshot = await getDocs(studentsQuery);
        nbStudent = querySnapshot.size;
        const classDiv = document.createElement("div");
        classDiv.classList.add("class");
        classDiv.classList.add("grid-div");
        classDiv.innerHTML = `<h2>${data.name}</h2><p><b>Number of student: </b>${nbStudent}</p>`;
        classesDiv.appendChild(classDiv);

        classA.appendChild(classDiv);
        classesDiv.prepend(classA);
    });
}).catch(error => {
    console.log(error);
});

onAuthStateChanged(auth, async user => {
    globalUser = user;
    const userCol = await getUser();

    const userTitle = document.getElementById("user-title");
    userTitle.textContent = `Welcome, ${userCol.data().lastName + " " + userCol.data().firstName}`;
});