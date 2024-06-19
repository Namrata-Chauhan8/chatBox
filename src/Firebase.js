// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8le7hX-AuFpyxililDcbzS_anXgZ4QXE",
  authDomain: "chat-50c1d.firebaseapp.com",
  projectId: "chat-50c1d",
  storageBucket: "chat-50c1d.appspot.com",
  messagingSenderId: "655835615521",
  appId: "1:655835615521:web:75bfd65288718e9cd76e60",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
