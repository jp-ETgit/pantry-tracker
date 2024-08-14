// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5H-STNo1Zc87l8PhGE0s9KEQkZXNRB4w",
  authDomain: "inventory-management-56360.firebaseapp.com",
  projectId: "inventory-management-56360",
  storageBucket: "inventory-management-56360.appspot.com",
  messagingSenderId: "539489312232",
  appId: "1:539489312232:web:23dc07d782759085e1585d",
  measurementId: "G-5CVFJ6629V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore};