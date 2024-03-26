import { initializeApp } from 'firebase/app';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {collection, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";

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

const userModuleCollection = collection(db, 'user_module');

let currentUser = null;

onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
    } else {
        console.log('No user is signed in');
    }
});

async function isConnected() {
    return new Promise((resolve, reject) => {
        while (currentUser) {
            resolve(currentUser);
        }
    });
}

async function getUser() {
    return new Promise((resolve, reject) => {
        if (currentUser) {
            const q = query(collection(db, "user"), where("auth_id", "==", currentUser.uid));

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
    const user = await getUser();
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

const modulesDiv = document.getElementById("modules");
modulesDiv.innerHTML = "";

const user = await getUser();
const userModules = await getUserModules(user.data().class_id);

userModules.forEach(async userModule => {
    const module = await getDoc(userModule.data().module_id);

    const moduleA = document.createElement("a");
    moduleA.href = "#";
    moduleA.addEventListener("click", async () => {
        await goToModule(module.id);
    });
    const moduleDiv = document.createElement("div");
    moduleDiv.classList.add("module");
    moduleDiv.innerHTML = `
        <h2>${module.data().name}</h2>
        <p>${"Lorem Ipsum"}</p>
    `;
    modulesDiv.appendChild(moduleDiv);
});