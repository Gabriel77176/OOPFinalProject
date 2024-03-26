// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";
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

const auth = getAuth();
const db = getFirestore();

const userCollection = collection(db, 'user');
const eventCollection = collection(db, 'event');

const firstName = document.querySelector("#first-name");
const lastName = document.querySelector("#last-name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const ulexam = document.querySelector(".exam-ul");
const resultul = document.querySelector(".result-ul");
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("connecté");
        // Personal information Part
        const userQuery = query(userCollection, where("auth_id", "==", user.uid));
        console.log(userQuery);
        getDocs(userQuery).then((querySnapshot) => {
            querySnapshot.forEach((docuser) => {
                firstName.innerHTML = docuser.data().firstName;
                lastName.innerHTML = docuser.data().lastName;
                email.innerHTML = docuser.data().email;
                phone.innerHTML = docuser.data().phoneNumber;

                // Module Part
                const docRef = doc(db, 'class', docuser.data().class_id);
                getDoc(docRef).then((doc2) => {
                    if (doc2.exists()) {
                        console.log("Document data:", doc2.data());
                        const class_moduleCollection = collection(db, 'class_module');
                        const class_moduleQuery = query(class_moduleCollection, where('class_id', '==', doc2.id));

                        getDocs(class_moduleQuery).then((querySnapshot2) => {
                            querySnapshot2.forEach((class_moduledoc) => {
                                const moduleRef = doc(db, 'module', class_moduledoc.data().module_id);
                                getDoc(moduleRef).then((moduleDoc) => {
                                    if (moduleDoc.exists()) {
                                        console.log("Document data:", moduleDoc.data());
                                        const ul = document.querySelector(".module-ul");
                                        const li = document.createElement("li");
                                        li.innerHTML = moduleDoc.data().name;
                                        ul.appendChild(li);


                                        const eventQuery = query(eventCollection, where('module_id', '==', moduleDoc.id));
                                        getDocs(eventQuery).then((eventQuerySnapshot) => {
                                            eventQuerySnapshot.forEach((eventDoc) => {
                                                const eventLi = document.createElement("li");
                                                eventLi.innerHTML = eventDoc.data().name;
                                                ulexam.appendChild(eventLi);
                                            });
                                        });
                                    } else {
                                        console.log("No such document!");
                                    }
                                });
                            });
                        })
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => {
                    console.log("Error getting document2:", error);
                });

                // Result Part
                const gradeCollection = collection(db, 'grade');
                const gradeQuery = query(gradeCollection, where('user_id', '==', docuser.id));
                getDocs(gradeQuery).then((gradeQuerySnapshot) => {
                    gradeQuerySnapshot.forEach((gradeDoc) => {
                        const eventRef = doc(db, 'event', gradeDoc.data().exam_id);
                        getDoc(eventRef).then((eventDoc) => {
                            if (eventDoc.exists()) {
                                console.log("Document data:", eventDoc.data());
                                const li = document.createElement("li");
                                const moduleRef = doc(db, 'module', eventDoc.data().module_id);
                                getDoc(moduleRef).then((moduleDoc) => {
                                    if (moduleDoc.exists()) {
                                        li.innerHTML = moduleDoc.data().name + " : " + gradeDoc.data().grade + "/20";
                                        resultul.appendChild(li);
                                    } else {
                                        console.log("No such document!");
                                    }
                                });
                            } else {
                                console.log("No such document!");
                            }
                        });
                    });

                }).catch((error) => {
                    console.log("Error getting document3:", error);
                });
            });
        });

    }
    else {
        console.log("non connecté");
    }
});