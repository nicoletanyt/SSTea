import { data } from "../Data.js";
let userData;
let currentIndex = 0;

const topbar = document.getElementById("topbar");
const main = document.getElementById("main");
const nav = document.getElementById("nav-wrapper");
const tutorialPopup = document.getElementById("tutorialPopup");

const tutorialImg = document.getElementById("tutorial-pic");
const leftBtn = document.querySelector(".left-btn");
const rightBtn = document.querySelector(".right-btn");
const images = [
  "./Assets/Homepage/Tutorial/TUTORIAL-0.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-1.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-2.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-3.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-4.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-5.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-6.png",
  "./Assets/Homepage/Tutorial/TUTORIAL-7.png",
];
const currVersion = "1.0";
if (
  localStorage.getItem("userInfo") == undefined ||
  JSON.parse(localStorage.getItem("SSTeaVersion")) != currVersion
) {
  console.log("Show Tutorial");
  userData = data; // set starting data
  localStorage.setItem("userInfo", JSON.stringify(userData));
  localStorage.setItem("SSTeaVersion", currVersion);
  // show tutorial
  topbar.classList.add("hide");
  main.classList.add("hide");
  nav.classList.add("hide");
  tutorialPopup.classList.remove("hide");

  leftBtn.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex -= 1;
    tutorialImg.src = images[currentIndex];
  });

  rightBtn.addEventListener("click", () => {
    if (currentIndex < images.length) currentIndex += 1;
    if (currentIndex == images.length) {
      topbar.classList.remove("hide");
      main.classList.remove("hide");
      nav.classList.remove("hide");
      tutorialPopup.classList.add("hide");
    } else {
      tutorialImg.src = images[currentIndex];
    }
  });
} else {
  userData = JSON.parse(localStorage.getItem("userInfo"));
}

// load values
export function loadValues() {
  console.log("Loading values");
  const sun = document.querySelector(".sunpower");
  const leaf = document.querySelector(".leaf");

  sun.textContent = userData["currency"]["sunpower"].toString() + "/30";
  leaf.textContent = userData["currency"]["leaf"].toString();
}
loadValues();
