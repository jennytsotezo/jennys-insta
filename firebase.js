import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyB6F8vlMMCxHAX6Joge5rJVGbeHIdKvppg",
  authDomain: "instagram-clone-ac65e.firebaseapp.com",
  projectId: "instagram-clone-ac65e",
  storageBucket: "instagram-clone-ac65e.appspot.com",
  messagingSenderId: "1038262646886",
  appId: "1:1038262646886:web:1d912fa49c42f2b40b55a7",
  measurementId: "G-4XXTB5DSNH"
};


const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

