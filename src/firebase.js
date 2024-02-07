// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from'firebase/auth'
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7vOoomePkLwGHx4-JTtGSTGAoLv5BpS4",
  authDomain: "weather-e7139.firebaseapp.com",
  projectId: "weather-e7139",
  storageBucket: "weather-e7139.appspot.com",
  messagingSenderId: "129713435474",
  appId: "1:129713435474:web:dbbc8030072f687076808b",
  measurementId: "G-339XTY7SQS"
};

// Initialize Firebase
let app;
app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
export  {app,auth,db};