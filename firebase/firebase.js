// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY7okhN4uyFBu93oaIn5cs24plpgKIEQE",
  authDomain: "yourmate-26000.firebaseapp.com",
  projectId: "yourmate-26000",
  storageBucket: "yourmate-26000.appspot.com",
  messagingSenderId: "250897571963",
  appId: "1:250897571963:web:3e4231221d71e0a35e02de",
  measurementId: "G-Z3CSM8RV0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app }