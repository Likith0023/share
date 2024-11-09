import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyB4sFEhKhOR0tn6B3N7UohYF2NWeK8tgGM",
    authDomain: "share-c3c43.firebaseapp.com",
    projectId: "share-c3c43",
    storageBucket: "share-c3c43.appspot.com",
    messagingSenderId: "751431508713",
    appId: "1:751431508713:web:c5af7e14ec452e42b74678",
    measurementId: "G-QN1ERDKW3W"
  };
  

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const functions = getFunctions(app);
  export const auth = getAuth(app);

  
  export { db, storage, functions };

