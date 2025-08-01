import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBNxXJR9HWxBClHbXOdr8O2Mk1njDUvliI",
    authDomain: "pawtracker-colonies.firebaseapp.com",
    databaseURL: "https://pawtracker-colonies-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pawtracker-colonies",
    storageBucket: "pawtracker-colonies.appspot.com",
    messagingSenderId: "174432639214",
    appId: "1:174432639214:web:21e50410629997240f7bff",
    measurementId: "G-1T2LHZ16R4"
  };
  
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore();
  const storage = getStorage(app);


export { firebaseConfig };
