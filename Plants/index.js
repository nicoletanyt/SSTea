import { database } from "../Firebase.js";
import {
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

const createPlantDisplay = (locked) => {
  let displayWrapper = document.createElement("div");
  displayWrapper.classList.add("plant-display");
  let icon = document.createElement("i");
  icon.classList.add("fa-solid");
  if (locked) {
    icon.classList.add("fa-lock");
  } else {
    icon.classList.add("fa-tree");
  }
  displayWrapper.appendChild(icon);
  return displayWrapper;
};

function displayGallery() {
  const plantWrapper = document.querySelector("#gallery-wrapper");
  let userData = JSON.parse(localStorage.getItem("userInfo"));

  for (let i = 0; i < userData["plants"].length; i++) {
    let plantDiv = createPlantDisplay(userData["plants"][i].locked);
    plantWrapper.appendChild(plantDiv);

    if (!userData["plants"][i].locked) {
      plantDiv.classList.add("pointer-hover");
      plantDiv.addEventListener("click", () => {
        window.localStorage.setItem("plantIndex", i);
        window.location.pathname = "./Plants/plantDetail.html";
      });
    }
  }
}

const createDetailsDisplay = (plant) => {
  const plantImg = document.querySelector("#plantImg");
  const name = document.querySelector("#name");
  const level = document.querySelector("#level");
  const stats = document.querySelectorAll(".stat-row");

  // plantImg.src = plant["img"];
  name.textContent = plant["name"];
  level.textContent = "Level " + plant["level"];
  stats[0].textContent = plant["stats"]["HP"];
  stats[1].textContent = plant["stats"]["ATK"];
  stats[2].textContent = plant["stats"]["Range"];
  stats[3].textContent = plant["stats"]["ATK Speed"];
};

function displayDetails() {
  let selectedIndex = window.localStorage.getItem("plantIndex");
  let userData = JSON.parse(localStorage.getItem("userInfo"));
  createDetailsDisplay(userData["plants"][selectedIndex]);

  const upgradeBtns = document.querySelectorAll(".upgrade-btn");
  // upgradeBtns[0].addEventListener("click", () => {
  //   userData["plants"][selectedIndex]["stats"]["HP"] += 1;
  //   createDetailsDisplay(userData["plants"][selectedIndex]);
  // });
  // upgradeBtns[1].addEventListener("click", () => {
  //   userData["plants"][selectedIndex]["stats"]["ATK"] += 1;
  //   createDetailsDisplay(userData["plants"][selectedIndex]);
  // });
  // upgradeBtns[2].addEventListener("click", () => {
  //   userData["plants"][selectedIndex]["stats"]["Range"] += 1;
  //   createDetailsDisplay(userData["plants"][selectedIndex]);
  // });
  // upgradeBtns[3].addEventListener("click", () => {
  //   userData["plants"][selectedIndex]["stats"]["ATK Speed"] += 1;
  //   createDetailsDisplay(userData["plants"][selectedIndex]);
  // });
}

if (window.location.pathname == "/Plants/index.html") {
  displayGallery();
} else if (window.location.pathname == "/Plants/plantDetail.html") {
  displayDetails();
}
