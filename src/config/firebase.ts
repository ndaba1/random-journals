import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1-EWrRBPGwKt6k9HKMEElcR7h00xXdbQ",
  authDomain: "random-journals.firebaseapp.com",
  projectId: "random-journals",
  storageBucket: "random-journals.appspot.com",
  messagingSenderId: "939044867005",
  appId: "1:939044867005:web:fc7a9deff45b2bef7b60d4",
  measurementId: "G-CH3LVKK908",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
