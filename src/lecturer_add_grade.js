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
let exam_id = params.get("exam_id");

function getExam(exam_id) {
    return new Promise((resolve, reject) => {
        const examRef = doc(db, "event", exam_id);
        getDoc(examRef)
            .then((docu) => {
                resolve(docu);
            }).catch(error => {
                reject("getExam error: " + error);
            });
    });
}

function getModule(module_id) {
    return new Promise((resolve, reject) => {
        const moduleRef = doc(db, "module", module_id);
        getDoc(moduleRef)
            .then((docu) => {
                resolve(docu);
            }).catch(error => {
                reject("getModule error: " + error);
            });
    });
}

function GetClass_module(module_id) {
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "class_module"), where("module_id", "==", module_id));
        getDocs(q).then(querySnapshot => {
            let classes = [];
            querySnapshot.forEach(doc => {
                classes.push(doc.data());
            });
            resolve(classes);
        }).catch(error => {
            reject("GetClass_module error: " + error);
        });
    });
}

function GetClass(class_id)
{
    return new Promise((resolve, reject) => {
        const classRef = doc(db, "class", class_id);
        getDoc(classRef)
            .then((docu) => {
                resolve(docu);
            }).catch(error => {
                reject("GetClass error: " + error);
            });
    });
}

function GetStudent(class_id)
{
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "user"), where("class_id", "==", class_id));
        getDocs(q).then(querySnapshot => {
            let students = [];
            querySnapshot.forEach(doc => {
                students.push(doc);
            });
            resolve(students);
        }).catch(error => {
            reject("GetStudent error: " + error);
        });
    });
}

function GetGrade(user_id, exam_id)
{
    return new Promise((resolve, reject) => {
        const q = query(collection(db, "grade"), where("user_id", "==", user_id), where("exam_id", "==", exam_id));
        getDocs(q).then(querySnapshot => {
            let grades = [];
            querySnapshot.forEach(doc => {
                grades.push(doc.data());
            });
            resolve(grades);
        }).catch(error => {
            reject("GetGrade error: "+ error);
        });
    });

}

onAuthStateChanged(auth, async user2 => {
    if (user2) {
        const exam = await getExam(exam_id);
        const examData = exam.data();

        console.log(0)

        const module = await getModule(examData.module_id);

        console.log(1)

        const classes = await GetClass_module(module.id);

        console.log(2)

        classes.forEach((classe_module) =>
        {
            GetClass(classe_module.class_id).then(classe =>
            {
                let div = document.createElement('div');
                div.classList.add('class');
                let h2 = document.createElement('h2');
                h2.textContent = classe.data().name;
                div.appendChild(h2);
                let table = document.createElement('table');

                let tbody = document.createElement('tbody');
                tbody.id = "table-body";
                table.appendChild(tbody);
                GetStudent(classe.id).then(students =>
                {
                    students.forEach(student =>
                    {
                        const student2 = student.data();
                        let tr = document.createElement('tr');
                        let td = document.createElement('td');
                        td.textContent = student2.firstName + " " + student2.lastName;
                        tr.appendChild(td);
                        console.log(student.id)
                        console.log(exam_id)
                        GetGrade(student.id, exam_id).then(grades =>
                        {

                            if (grades.length > 0)
                            {
                                let td = document.createElement('td');
                                td.textContent = grades[0].grade + "/20" ;
                                td.className = "grade_student"
                                td.id = student.id;
                                tr.appendChild(td);
                            }
                            else
                            {
                                let td = document.createElement('td');
                                td.textContent = "N/A";
                                td.className = "grade_student"
                                td.id = student.id;
                                tr.appendChild(td);
                            }
                        }
                        );
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                })
                    .catch(error => {
                        console.log("GetStudent error: " + error);
                    });
                let button = document.createElement('button');
                button.textContent = "Edit";
                button.className = "modifier-btn"
                button.addEventListener('click', () =>
                {
                    div = button.parentNode;
                    let grades = div.querySelectorAll('.grade_student');
                    grades.forEach(grade =>
                    {
                        let input = document.createElement('input');
                        if (input.value === "N/A")
                        {
                            input.value = "";
                        }
                        else {
                            input.value = grade.textContent.split("/")[0];
                        }
                        input.type = "number";
                        input.min = 0;
                        input.max = 20;
                        input.addEventListener('change', async () =>
                        {
                            if (input.value === "")
                            {
                                return;
                            }
                            const student_id = grade.id;
                            const q = query(collection(db, "grade"), where("exam_id", "==", exam_id), where("user_id", "==", student_id));
                            const querySnapshot = await getDocs(q);
                            if (querySnapshot.empty)
                            {
                                await addDoc(collection(db, "grade"), {
                                    exam_id: exam_id,
                                    user_id: student_id,
                                    grade: input.value
                                });
                            }
                            else
                            {
                                querySnapshot.forEach(doc =>
                                {
                                    doc.ref.update({
                                        grade: input.value
                                    });
                                });
                            }
                        });
                        grade.textContent = "";
                        grade.appendChild(input);
                    });
                    document.getElementById('save-button').style.display = "block";
                });


                div.appendChild(table);
                div.appendChild(button);
                document.getElementById('grade').appendChild(div);
            });
        })
    }
    else {
        window.location.href = "login.html";
    }
});

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () =>
{
    saveButton.style.display = "none";
    window.location.reload();
});