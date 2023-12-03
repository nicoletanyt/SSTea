import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCKb_lCOdJKegYBeatlUhOEqvMOLUiihr0",
  authDomain: "sstea-d1cf3.firebaseapp.com",
  projectId: "sstea-d1cf3",
  storageBucket: "sstea-d1cf3.appspot.com",
  messagingSenderId: "548984165430",
  appId: "1:548984165430:web:8e870f8c34d49e49e53497",
  databaseURL:
    "https://sstea-d1cf3-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
