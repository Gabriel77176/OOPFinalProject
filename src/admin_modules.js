import { initializeApp } from 'firebase/app';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where} from "firebase/firestore";

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
console.log(module_id);


/* ------------------- MODULES ------------------- */

const classesDiv = document.getElementById("classes");

let classesTable = document.createElement('table');
let classesThead = document.createElement('thead');
let classesTbody = document.createElement('tbody');

// Create table header
let classesHheaderRow = document.createElement('tr');
let classesNameHeader = document.createElement('th');
classesNameHeader.textContent = 'Name';
classesHheaderRow.appendChild(classesNameHeader);

classesThead.appendChild(classesHheaderRow);
classesTable.appendChild(classesThead);

const classModulesQuery = query(collection(db, "class_module"), where("module_id", "==", module_id));
getDocs(classModulesQuery).then(querySnapshot => {
    querySnapshot.forEach(docu => {
        let classModule = docu.data();
        getDoc(doc(db, "class", classModule.class_id)).then(async classModuleDoc => {
            let row = document.createElement('tr');

            let nameCell = document.createElement('td');
            const classDoc = await getDoc(doc(db, "class", classModule.class_id));
            if (classDoc.exists()) {
                nameCell.textContent = classDoc.data().name;
                row.appendChild(nameCell);

                classesTbody.appendChild(row);
            }
        });
    });
});

classesTbody.setAttribute('id', 'classes-tbody');

classesTable.appendChild(classesTbody);
classesDiv.appendChild(classesTable);

/* ------------------- END MODULES ------------------- */

/* ------------------- LECTURERS ------------------- */

const lecturersDiv = document.getElementById("lecturers");

let lecturersTable = document.createElement('table');
let lecturersThead = document.createElement('thead');
let lecturersTbody = document.createElement('tbody');

// Create table header
let lecturersHeaderRow = document.createElement('tr');
let lecturersNameHeader = document.createElement('th');
lecturersNameHeader.textContent = 'Name';
lecturersHeaderRow.appendChild(lecturersNameHeader);

lecturersThead.appendChild(lecturersHeaderRow);
lecturersTable.appendChild(lecturersThead);

const userModulesQuery = query(collection(db, "user_module"), where("module_id", "==", module_id));
getDocs(userModulesQuery).then(querySnapshot => {
    querySnapshot.forEach(docu => {
        let lecturerModule = docu.data();

        getDoc(doc(db, "user", lecturerModule.user_id)).then(lecturerDoc => {
            let lecturerData = lecturerDoc.data();
            let row = document.createElement('tr');

            let nameCell = document.createElement('td');
            nameCell.textContent = lecturerData.firstName + ' ' + lecturerData.lastName;
            row.appendChild(nameCell);

            lecturersTbody.appendChild(row);
        });
    });
});

lecturersTbody.setAttribute('id', 'lecturers-tbody');

lecturersTable.appendChild(lecturersTbody);
lecturersDiv.appendChild(lecturersTable);

/* ------------------- END LECTURERS ------------------- */

const addClassButton = document.getElementById("add-class");
addClassButton.addEventListener("click", () => {
    const buttonToDisable = document.getElementById("add-class");
    buttonToDisable.disabled = true;
    let row = document.createElement('tr');

    let nameCell = document.createElement('td');
    let form = document.createElement('form');
    let select = document.createElement('select');

    let classList = [];

    const classModulesQuery2 = query(collection(db, "class_module"), where("module_id", "==", module_id));
    getDocs(classModulesQuery2).then(querySnapshot => {
        querySnapshot.forEach(docu => {
            classList.push(docu.data().class_id);
            });
        const classQuery2 = query(collection(db, "class"));
        getDocs(classQuery2).then(querySnapshot2 => {
            querySnapshot2.forEach(docu2 => {
                if (!classList.includes(docu2.id)) {
                    let classData = docu2.data();
                    let option = document.createElement('option');
                    option.value = docu2.id;
                    option.textContent = classData.name;
                    select.appendChild(option);
                }
            });
        });
    });

    const formAddClassButton = document.createElement('button');
    formAddClassButton.textContent = "Add";
    formAddClassButton.setAttribute("type", "submit")
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let class_id = select.value;
        const classModule = {
            class_id: class_id,
            module_id: module_id
        };
        addDoc(collection(db, "class_module"), classModule).then(() => {
            window.location.reload();
        });
    });

    form.appendChild(select);
    form.appendChild(formAddClassButton);
    nameCell.appendChild(form);
    row.appendChild(nameCell);

    classesTbody.appendChild(row);
});

const addLecturerButton = document.getElementById("add-lecturer");
addLecturerButton.addEventListener("click", () => {
    const buttonToDisable = document.getElementById("add-lecturer");
    buttonToDisable.disabled = true;
    let row = document.createElement('tr');

    let nameCell = document.createElement('td');
    let form = document.createElement('form');
    let select = document.createElement('select');

    let lecturerList = [];

    const lecturerModulesQuery2 = query(collection(db, "user_module"), where("module_id", "==", module_id));
    getDocs(lecturerModulesQuery2).then(querySnapshot => {
        querySnapshot.forEach(docu => {
            lecturerList.push(docu.data().user_id);
        });
        console.log(lecturerList);
        const lecturerQuery2 = query(collection(db, "user"), where("role", "==", "lecturer"));
        getDocs(lecturerQuery2).then(querySnapshot2 => {
            querySnapshot2.forEach(docu2 => {
                if (!lecturerList.includes(docu2.id)) {
                    let lecturerData = docu2.data();
                    let option = document.createElement('option');
                    option.value = docu2.id;
                    option.textContent = lecturerData.firstName + ' ' + lecturerData.lastName;
                    select.appendChild(option);
                }
            });
        });
    });

    const formAddLecturerButton = document.createElement('button');
    formAddLecturerButton.textContent = "Add";
    formAddLecturerButton.setAttribute("type", "submit")
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let user_id = select.value;
        const userModule = {
            user_id: user_id,
            module_id: module_id
        };
        addDoc(collection(db, "user_module"), userModule).then(() => {
            window.location.reload();
        });
    });

    form.appendChild(select);
    form.appendChild(formAddLecturerButton);
    nameCell.appendChild(form);
    row.appendChild(nameCell);

    lecturersTbody.appendChild(row);
});