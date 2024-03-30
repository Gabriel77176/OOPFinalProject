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
let module_id = params.get("module_id");
console.log("MODULE: ", module_id);

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

async function getExamsFromModule(moduleId) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "event"), where("module_id", "==", moduleId));

        getDocs(q).then(querySnapshot => {
            if (!querySnapshot.empty) {
                resolve(querySnapshot.docs);
            } else {
                reject("No exams found in this module.");
            }
        }).catch(error => {
            reject(error);
        });
    });
}

async function getCoursesFromModule(moduleId) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "course"), where("module_id", "==", moduleId));

        getDocs(q).then(querySnapshot => {
            if (!querySnapshot.empty) {
                resolve(querySnapshot.docs);
            } else {
                resolve([]);
            }
        }).catch(error => {
            reject(error);
        });
    });
}

function goToExam(examId) {
    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "exam.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    urlObject.searchParams.append('exam_id', examId);

    window.location.href = urlObject.toString();
}

const module = await getDoc(doc(db, "module", module_id));
const moduleName = document.getElementById("module-title");
moduleName.textContent = module.data().name;

const examsDiv = document.getElementById("exams");
const exams = await getExamsFromModule(module_id);

exams.forEach(exam => {
    const examA = document.createElement("a");
    examA.href = "#";
    examA.classList.add("div-a")
    examA.addEventListener("click", async () => {
        await goToExam(exam.id);
    });


    const examDiv = document.createElement("div");
    examDiv.classList.add("exam");
    examDiv.classList.add("grid-div");

    const examTitle = document.createElement("h2");
    examTitle.textContent = exam.data().name;

    const examDescription = document.createElement("p");
    examDescription.textContent = exam.data().description;

    examDiv.appendChild(examTitle);
    examDiv.appendChild(examDescription);

    examA.appendChild(examDiv);
    examsDiv.appendChild(examA);
});

const coursesDiv = document.getElementById("courses");
const courses = await getCoursesFromModule(module_id);

onAuthStateChanged(auth, async (user) => {
    globalUser = user;
    const userDoc = await getUser();

    courses.forEach(async (course) => {
        const courseDiv = document.createElement("div");
        courseDiv.classList.add("course");
        courseDiv.classList.add("grid-div");

        const courseTitle = document.createElement("h2");
        courseTitle.textContent = course.data().name;

        let attendanceString = "?";
        const q = query(collection(db, "attendance"), where("course_id", "==", course.id), where("user_id", "==", userDoc.id));

        const querySnapshot = await getDocs(q);
        const attendance = querySnapshot.docs[0];
        if (attendance.data().present === true) {
            attendanceString = "Present";
        }
        else {
            attendanceString = "Absent";
        }

        const courseP = document.createElement("p");
        courseP.innerHTML = `<b>Beginning:</b> ${course.data().time_in.toDate().toLocaleString()}<br>`;
        courseP.innerHTML += `<b>Ending:</b> ${course.data().time_out.toDate().toLocaleString()}<br>`;
        courseP.innerHTML += `<b>Attendance:</b> ${attendanceString}`;

        courseDiv.appendChild(courseTitle);
        courseDiv.appendChild(courseP);

        coursesDiv.appendChild(courseDiv);
    });
});

/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */

import { stretchGridDivs } from './module_strech';
stretchGridDivs();