import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/performance";


// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyA1k-FqCuiKFkcJwaWDChnZ7GY1NZv6DK0",
  authDomain: "stockapp-4f3c2.firebaseapp.com",
  databaseURL: "https://stockapp-4f3c2.firebaseio.com",
  projectId: "stockapp-4f3c2",
  storageBucket: "stockapp-4f3c2.appspot.com",
  messagingSenderId: "189169559056",
  appId: "1:189169559056:web:2f1677bd79b4faee588c95",
  measurementId: "G-4YH5FK7TGC"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
// let db = firebase.firestore();
const perf = firebase.performance();

// const analytics = firebase.analytics();

var db = firebaseApp.firestore();

// if (location.hostname === "localhost") {
//   db.settings({
//     host: "localhost:8080",
//     ssl: false
//   });
// }

export { db, firebase };