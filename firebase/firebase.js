import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBY7okhN4uyFBu93oaIn5cs24plpgKIEQE",
  authDomain: "yourmate-26000.firebaseapp.com",
  projectId: "yourmate-26000",
  storageBucket: "yourmate-26000.appspot.com",
  messagingSenderId: "250897571963",
  appId: "1:250897571963:web:3e4231221d71e0a35e02de",
  measurementId: "G-Z3CSM8RV0N"
};

// Initialise Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth(app);
export const firestore = firebase.firestore(app);