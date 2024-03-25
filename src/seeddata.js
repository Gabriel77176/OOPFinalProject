// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {addDoc, collection, getFirestore} from "firebase/firestore";

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
initializeApp(firebaseConfig);

const db = getFirestore();
const userCollection = collection(db, "user");
const moduleCollection = collection(db, "module");
const eventCollection = collection(db, "event");
const classCollection = collection(db, "class");
const gradeCollection = collection(db, "grade");
const classModuleCollection = collection(db, "class_module");
const userModuleCollection = collection(db, "user_module");

async function createSampleUsers() {
  const student1 = {
    auth_id: "student1",
    class_id: "class1",
    role: "student",
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com"
  };

  const student2 = {
    auth_id: "student2",
    class_id: "class1",
    role: "student",
    firstname: "Jane",
    lastname: "Doe",
    email: "jane.doe@example.com"
  };

  const student3 = {
    auth_id: "student3",
    class_id: "class1",
    role: "student",
    firstname: "Jim",
    lastname: "Doe",
    email: "jim.doe@example.com"
  };

  const lecturer1 = {
    auth_id: "lecturer1",
    class_id: "class2",
    role: "lecturer",
    firstname: "Alice",
    lastname: "Smith",
    email: "alice.smith@example.com"
  };

  const lecturer2 = {
    auth_id: "lecturer2",
    class_id: "class2",
    role: "lecturer",
    firstname: "Bob",
    lastname: "Smith",
    email: "bob.smith@example.com"
  };

  await addDoc(userCollection, student1);
  await addDoc(userCollection, student2);
  await addDoc(userCollection, student3);
  await addDoc(userCollection, lecturer1);
  await addDoc(userCollection, lecturer2);
}

createSampleUsers();