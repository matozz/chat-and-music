import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyByhTrE2McqMwiKEqnQ5IMTpyDvXoL84hI",
  authDomain: "chat-music-22d07.firebaseapp.com",
  projectId: "chat-music-22d07",
  storageBucket: "chat-music-22d07.appspot.com",
  messagingSenderId: "234093693045",
  appId: "1:234093693045:web:8faa8f9c5b7b4347e1503c",
  measurementId: "G-60F0EMCKJE",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const storage = app.storage();
const auth = firebase.auth();

export { db, storage, auth, firebase };
