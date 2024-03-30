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

const courseButton = document.getElementById("add-course");
courseButton.addEventListener("click", () => {
    window.location.href = "add_course.html?module_id=" + module_id;
});

const button = document.getElementById("add-exam");
button.addEventListener("click", () => {
    window.location.href = "add_exam.html?module_id=" + module_id;
});

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

    //const addDiv = document.getElementById("add-exam")

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
    examsDiv.prepend(examA);

});


const coursesDiv = document.getElementById("courses");
const courses = await getCoursesFromModule(module_id);
courses.forEach(course => {
    const courseA = document.createElement("a");
    courseA.href = "#";
    courseA.classList.add("div-a")
    courseA.addEventListener("click", async () => {
        await goToCourse(course.id);
    });

    const courseDiv = document.createElement("div");
    courseDiv.classList.add("course");
    courseDiv.classList.add("grid-div");

    const courseTitle = document.createElement("h2");
    courseTitle.textContent = course.data().name;

    const courseDescription = document.createElement("p");

    const coursetime_in = document.createElement("p");
    const timeIn = course.data().time_in;
    const timeOut = course.data().time_out;
    coursetime_in.innerHTML = "<b>Time in:</b> " + timeIn.toDate().toLocaleString();
    courseDescription.appendChild(coursetime_in);

    const coursetime_out = document.createElement("p");
    coursetime_out.innerHTML = "<b>Time out:</b> " + timeOut.toDate().toLocaleString();
    courseDescription.appendChild(coursetime_out);


    courseDiv.appendChild(courseTitle);
    courseDiv.appendChild(courseDescription);

    courseA.appendChild(courseDiv);
    coursesDiv.prepend(courseA);

});



async function getExamsFromModule(moduleId) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "event"), where("module_id", "==", moduleId));

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

function goToCourse(courseId) {
    let currentUrl = new URL(window.location.href);
    let baseUrl = currentUrl.origin + currentUrl.pathname.replace(/\/[^/]+$/, '/');

    let newRelativeUrl = "course.html";
    let newUrl = baseUrl + newRelativeUrl;

    let urlObject = new URL(newUrl);
    urlObject.searchParams.append('course_id', courseId);

    window.location.href = urlObject.toString();
}

/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */
/* ******************************************************************************************************************** */

import { stretchGridDivs } from './module_strech';
stretchGridDivs();