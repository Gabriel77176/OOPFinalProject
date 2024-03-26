// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import {collection, getDocs, getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

const auth = getAuth();
const db = getFirestore();

const moduleCollection = collection(db, 'module');

const debug_p = document.querySelector('#connect-p');

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, display the email
    debug_p.innerHTML = user.email;
    console.log("connecté");
  } else {
    // No user is signed in, display "non connecté"
    debug_p.innerHTML = "Not Connected";
    console.log("non connecté");

  }
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', (e) => {
  e.preventDefault();

  signOut(auth)
      .then(() => {
        console.log('User signed out');
        // window.location.href = 'login.html';
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
});

const moduleForm = document.querySelector("#form_module");
moduleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const moduleSelect = document.querySelector('select[name="module_id"]');
  const selectedId = moduleSelect.value;

  let currentUrl = new URL(window.location.href);
  let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

  let newRelativeUrl = "admin/add_teacher_module.html";
  let newUrl = baseUrl + newRelativeUrl;

  let urlObject = new URL(newUrl);

  urlObject.searchParams.append('module_id', selectedId);
  window.location.href = urlObject.toString();
});

getDocs(moduleCollection).then((querySnapshot) => {
  const moduleSelect = document.querySelector("#form_module_select");

  querySnapshot.forEach((doc) => {
    let option = document.createElement('option');
    option.value = doc.id;
    option.text = doc.data().name;
    moduleSelect.add(option);
  });
});