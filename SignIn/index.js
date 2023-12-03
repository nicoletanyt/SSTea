import { database } from "../Firebase.js";
import {
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const signInBtn = document.querySelector(".sign-in");
const signInEmail = document.querySelector("#email-signIn");
const signInPassword = document.querySelector("#password-signIn");

function login(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("SSTea-UID", user.uid);

      const userRef = ref(database, "users/" + user.uid);
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        localStorage.setItem("userInfo", JSON.stringify(userData));
        window.location.pathname = "../Homescreen/index.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      switch (errorCode) {
        case "auth/invalid-credential":
          createUser(auth, email, password);
          break;
      }
      console.log(errorMessage);
    });
}

function createUser(auth, email, password) {
  alert("User not found, creating a new user.");
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const defaultUser = {
        plants: [
          {
            name: "Plant 1",
            locked: false,
            img: "",
            stats: {
              HP: 20,
              ATK: 20,
              Range: 40,
              "ATK Speed": 20,
              level: 3,
            },
          },
        ],
      };
      set(ref(database, "users/" + user.uid), defaultUser).then(() => {
        alert("New user added");
        localStorage.setItem("SSTea-UID", user.uid);
        localStorage.setItem("userInfo", JSON.stringify(defaultUser));
        window.location.pathname = "../Homescreen/index.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      switch (errorCode) {
        case "auth/invalid-email":
          alert("Please enter a valid email.");
          break;
        case "auth/email-already-in-use":
          alert("Your Password is wrong..");
          break;
        default:
          alert("Please enter a valid email and password.");
          break;
      }
      console.log(errorMessage);
    });
}

signInBtn.addEventListener("click", () => {
  if (signInEmail.value.length == 0 || signInPassword.value.length == 0) {
    alert("Please fill in all fields");
  } else if (signInPassword.value.length < 6) {
    alert("Password needs to be at least 6 characters.");
  } else {
    login(signInEmail.value, signInPassword.value);
  }
});
