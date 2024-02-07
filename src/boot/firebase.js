// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1k-FqCuiKFkcJwaWDChnZ7GY1NZv6DK0",
  authDomain: "stockapp-4f3c2.firebaseapp.com",
  databaseURL: "https://stockapp-4f3c2.firebaseio.com",
  projectId: "stockapp-4f3c2",
  storageBucket: "stockapp-4f3c2.appspot.com",
  messagingSenderId: "189169559056",
  appId: "1:189169559056:web:2f1677bd79b4faee588c95",
  measurementId: "G-4YH5FK7TGC"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = firebase.firestore();

export { db, firebase };
