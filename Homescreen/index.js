import { data } from "../Data.js";
let userData;

if (localStorage.getItem("userInfo") == undefined) {
  userData = data; // set starting data
} else {
  userData = JSON.parse(localStorage.getItem("userInfo"));
}

// store to local storage
localStorage.setItem("userInfo", JSON.stringify(userData));

// load values
const sun = document.querySelector(".sunpower");
const leaf = document.querySelector(".leaf");

sun.textContent = userData["currency"]["sunpower"].toString() + "/30";
leaf.textContent = userData["currency"]["leaf"].toString();
