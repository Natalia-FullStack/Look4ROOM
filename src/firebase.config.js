// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgD76FQrCXXKU5rZfIn2oT1SzcPSmP7dk",
  authDomain: "tfg-natalia2024.firebaseapp.com",
  projectId: "tfg-natalia2024",
  storageBucket: "tfg-natalia2024.appspot.com",
  messagingSenderId: "81258919339",
  appId: "1:81258919339:web:dc42d3b039717471a50eee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db=getFirestore(app);
export const storage=getStorage();


