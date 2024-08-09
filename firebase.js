// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsNtmBnp5_4u2f9kTC_5VYiGfe7EQlruE",
  authDomain: "pantrytracker-inventorymanage.firebaseapp.com",
  projectId: "pantrytracker-inventorymanage",
  storageBucket: "pantrytracker-inventorymanage.appspot.com",
  messagingSenderId: "129641244661",
  appId: "1:129641244661:web:988b15c73210aeed7322bc",
  measurementId: "G-F8JGHVW84E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore=getFirestore(app)
export{firestore}