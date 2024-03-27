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
                    let options = {year: 'numeric', month: 'long', day: 'numeric'};
                    let formattedDate = date.toLocaleDateString("en-EN", options);

                    document.getElementById('name-span').textContent = examData.name;
                    document.getElementById('description-span').textContent = "Lorem Ipsum"; // examData.description
                    document.getElementById('coef-span').textContent = examData.coef;
                    document.getElementById('date-span').textContent = formattedDate;
                    document.getElementById('grade-span').textContent = "0";
                    document.getElementById('grade-span').textContent = "Not graded";

                    // Get the document from the "grade" collection where "exam_id" equals "doc.id" and "user_id" equals "user.id"
                    let gradeDocRef = doc(db, "grade", docu.id);

                    let gradeQuery = query(collection(db, "grade"), where("exam_id", "==", docu.id), where("user_id", "==", user.id));

                    getDocs(gradeQuery)
                        .then((querySnapshot) => {
                            if (querySnapshot.size >= 1) {
                                let doc = querySnapshot.docs[0];
                                console.log(doc.id, " => ", doc.data());
                                document.getElementById('grade-span').textContent = "" + doc.data().grade;
                            } else {
                                console.log("More than one document matches the conditions.");
                            }
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
});
