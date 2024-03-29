import { initializeApp } from 'firebase/app';
import { getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import {addDoc, collection, doc, getDoc, getDocs, getFirestore, query, Timestamp, where} from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
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
let course_id = params.get("course_id");
const courseRef = doc(db, "course", course_id);
const class_moduleCollection = collection(db, "class_module");
const userCollection = collection(db, "user");
const attendanceCollection = collection(db, "attendance");

onAuthStateChanged(auth, user => {

    getDoc(courseRef).then((docu) => {
        const course = docu.data();
        const module_id = course.module_id;
        const q = query(class_moduleCollection, where("module_id", "==", module_id));



        getDocs(q).then(querySnapshot => {
            querySnapshot.forEach(docu => {
                const div = document.createElement("div")
                const class_module = docu.data();
                const table = document.createElement("table");
                const class_id = class_module.class_id;
                const tbody = document.createElement("tbody");
                const h2 = document.createElement("h2");
                const classRef = doc(db, "class", class_id);
                getDoc(classRef).then(docu => {
                    const class_ = docu.data()

                    console.log("class: " + class_.name);
                    h2.textContent = class_.name;

                    const q2 = query(userCollection, where("class_id", "==", class_id));
                    getDocs(q2).then(querySnapshot => {
                        querySnapshot.forEach(docu => {
                            const user = docu.data();
                            const user_id = docu.id;

                            const td1 = document.createElement("td");
                            td1.textContent = user.firstName + " " + user.lastName;
                            const td2 = document.createElement("td");
                            const q3 = query(attendanceCollection, where("user_id", "==", user_id), where("course_id", "==", course_id));
                            getDocs(q3).then(querySnapshot => {
                                if (querySnapshot.empty) {
                                    td2.textContent = "?";
                                } else {
                                    if (querySnapshot.docs[0].data().present) {
                                        td2.textContent = "Present";
                                    } else {
                                        td2.textContent = "Absent";
                                    }
                                }
                            });
                            const tr = document.createElement("tr");
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tbody.appendChild(tr);
                        });
                    });
                    const button = document.createElement("button");
                    button.addEventListener("click", () => {
                        const div = button.parentElement//document.getElementById("attendance");
                        div.innerHTML = "";
                        getDoc(courseRef).then((docu) => {
                            const course = docu.data();
                            const class_id = class_module.class_id;
                            console.log("class_id: " + class_id);
                            const table = document.createElement("table");
                            const classRef2 = doc(db, "class", class_id);
                            console.log("classRef: " + classRef2);
                            const tbody = document.createElement("tbody");
                            const h2 = document.createElement("h2");
                            getDoc(classRef).then(docu => {
                                const class_ = docu.data()
                                console.log("class: " + class_.name);
                                h2.textContent = class_.name;
                                const q2 = query(userCollection, where("class_id", "==", class_id));
                                getDocs(q2).then(querySnapshot => {
                                    querySnapshot.forEach(docu => {
                                        const user = docu.data();
                                        const user_id = docu.id;

                                        const td1 = document.createElement("td");
                                        td1.textContent = user.firstName + " " + user.lastName;
                                        const td2 = document.createElement("td");
                                        const q3 = query(attendanceCollection, where("user_id", "==", user_id), where("course_id", "==", course_id));
                                        getDocs(q3).then(querySnapshot => {

                                            if (querySnapshot.empty) {
                                                const attendance = {
                                                    user_id: user_id,
                                                    course_id: course_id,
                                                    present: true
                                                };
                                                addDoc(attendanceCollection, attendance).then(
                                                    (docRef) => {
                                                        const attendanceRef = doc(db, "attendance", docRef.id);
                                                        const select = document.createElement("select");
                                                        const option1 = document.createElement("option");
                                                        option1.value = "present";
                                                        option1.textContent = "Present";
                                                        const option2 = document.createElement("option");
                                                        option2.value = "absent";
                                                        option2.textContent = "Absent";
                                                        getDoc(attendanceRef).then((docu) => {
                                                            if (docu.data().present) {
                                                                option1.selected = true;
                                                            } else {
                                                                option2.selected = true;
                                                            }
                                                        });

                                                        select.appendChild(option1);
                                                        select.appendChild(option2);
                                                        select.addEventListener("change", () => {
                                                            if (select.value === "present") {
                                                                updateDoc(attendanceRef, {
                                                                    present: true
                                                                });
                                                            } else {
                                                                updateDoc(attendanceRef, {
                                                                    present: false
                                                                });
                                                            }
                                                        });
                                                        td2.appendChild(select);
                                                    })

                                            }
                                            else {
                                                const attendanceRef = doc(db, "attendance", querySnapshot.docs[0].id);
                                                const select = document.createElement("select");
                                                const option1 = document.createElement("option");
                                                option1.value = "present";
                                                option1.textContent = "Present";
                                                const option2 = document.createElement("option");
                                                option2.value = "absent";
                                                option2.textContent = "Absent";
                                                if (querySnapshot.docs[0].data().present) {
                                                    option1.selected = true;
                                                } else {
                                                    option2.selected = true;
                                                }
                                                select.appendChild(option1);
                                                select.appendChild(option2);
                                                select.addEventListener("change", () => {
                                                    if (select.value === "present") {
                                                        updateDoc(attendanceRef, {
                                                            present: true
                                                        });
                                                    } else {
                                                        updateDoc(attendanceRef, {
                                                            present: false
                                                        });
                                                    }
                                                });
                                                td2.appendChild(select);

                                            }

                                        });
                                        const tr = document.createElement("tr");
                                        tr.appendChild(td1);
                                        tr.appendChild(td2);
                                        tbody.appendChild(tr);
                                    });
                                });
                            });
                            div.appendChild(h2);
                            table.appendChild(tbody);
                            div.appendChild(table);
                        });
                        document.getElementById("save-button-1").style.display = "block";
                        document.getElementById("save-button-2").style.display = "block";
                        button.style.display = "none";
                    });
                    button.textContent = "Edit";
                    div.appendChild(button);
                });




                div.appendChild(h2);
                table.appendChild(tbody);
                div.appendChild(table);
                document.getElementById("attendance").appendChild(div);
            });


        });
    });
});

const saveButton1 = document.getElementById("save-button-1");
saveButton1.addEventListener("click", () => {
    window.location.reload();
});
const saveButton2 = document.getElementById("save-button-2");
saveButton2.addEventListener("click", () => {
    window.location.reload();
});