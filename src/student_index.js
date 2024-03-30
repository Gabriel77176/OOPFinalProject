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

const userModuleCollection = collection(db, 'class_module');

let globalUser = null;

async function isConnected() {
    return new Promise((resolve, reject) => {
        while (globalUser) {
            resolve(globalUser);
        }
    });
}

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

async function getUserModules(classId) {
    return new Promise((resolve, reject) => {
        const q = query(userModuleCollection, where("class_id", "==", classId));

        getDocs(q).then(querySnapshot => {
            resolve(querySnapshot);
        }).catch(error => {
            reject(error);
        });
    });
}

async function goToModule(moduleId) {
    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "module.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    urlObject.searchParams.append('module_id', moduleId);

    window.location.href = urlObject.toString();
}

const detailsButton = document.getElementById("details-a");
detailsButton.addEventListener("click", async () => {
    console.log("details button clicked");

    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "account.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    const user = await getUser();
    urlObject.searchParams.append('user_id', user.id);

    window.location.href = urlObject.toString();
});


onAuthStateChanged(auth, async user2 => {
    if (user2) {
        globalUser = user2;
        const modulesDiv = document.getElementById("modules");
        modulesDiv.innerHTML = "";

        const user = await getUser();

        const userTitle = document.getElementById("user-title");
        userTitle.textContent = `Welcome, ${user.data().lastName + " " + user.data().firstName}`;

        const userModulesSnapshot = await getUserModules(user.data().class_id);
        console.log(user.data().class_id)
        const userModules = userModulesSnapshot.docs;
        console.log(userModules.length)
        for (const userModule of userModules) {
            const moduleRef = doc(db, 'module', userModule.data().module_id);
            const module = await getDoc(moduleRef);
            const moduleA = document.createElement("a");
            moduleA.href = "#";
            moduleA.classList.add("div-a")
            moduleA.addEventListener("click", async () => {
                await goToModule(module.id);
            });
            const moduleDiv = document.createElement("div");
            moduleDiv.classList.add("module");
            moduleDiv.classList.add("grid-div");
            moduleDiv.innerHTML = `
        <h2>${module.data().name}</h2>
        <p>${module.data().description}</p>

    `;
            moduleA.appendChild(moduleDiv);
            modulesDiv.appendChild(moduleA);
        }
    } else {
        console.log('No user is signed in');
    }
});

/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */

import { stretchGridDivs } from './module_strech';
stretchGridDivs();