import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAa2w7ckD-mSVZv5zlXFqC9FjnElIKn0qQ",
    authDomain: "new-123-91183.firebaseapp.com",
    projectId: "new-123-91183",
    storageBucket: "new-123-91183.firebasestorage.app",
    messagingSenderId: "172738936152",
    appId: "1:172738936152:web:d7e2e71058666114b0792d",
    measurementId: "G-KSW2RL5XY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
