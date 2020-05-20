import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/performance";


// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "AIzaSyBZsafvMdCvFeif3UW0Ya4CoJD8temnyoQ",
  authDomain: "stock-kipreos.firebaseapp.com",
  databaseURL: "https://stock-kipreos.firebaseio.com",
  projectId: "stock-kipreos",
  storageBucket: "stock-kipreos.appspot.com",
  messagingSenderId: "1060322624632",
  appId: "1:1060322624632:web:90665d122aff98fe91d98d",
  measurementId: "G-B9B8XZYN6H"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
const perf = firebase.performance();


export { db, firebase };