// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {  collection, addDoc, serverTimestamp } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwyU-To-tEGTqrZZVKHSjP6HHj1SEUudM",
  authDomain: "crud-firestore-414a5.firebaseapp.com",
  projectId: "crud-firestore-414a5",
  storageBucket: "crud-firestore-414a5.appspot.com",
  messagingSenderId: "798657005938",
  appId: "1:798657005938:web:2ee2ad00db5b695a87f5eb",
  measurementId: "G-WZB65443W3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const db = getFirestore(app);
export const storage = getStorage(app);
export { collection, addDoc, serverTimestamp };
