// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWMxmq-RMWD8q4mjwGRqFvVhiaxMd1iGw",
  authDomain: "skynet-survey-form.firebaseapp.com",
  projectId: "skynet-survey-form",
  storageBucket: "skynet-survey-form.appspot.com",
  messagingSenderId: "1028560168932",
  appId: "1:1028560168932:web:a0c18b1a0afd2d709cc9f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
