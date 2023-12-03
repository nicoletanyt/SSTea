import { database } from "../Firebase.js";
import {
  set,
  ref,
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
  level.textContent = "Level " + plant["stats"]["level"];
  stats[0].textContent = plant["stats"]["HP"];
  stats[1].textContent = plant["stats"]["ATK"];
  stats[2].textContent = plant["stats"]["Range"];
  stats[3].textContent = plant["stats"]["ATK Speed"];
};

function updateDetails(userData, stat, selectedIndex) {
  userData["plants"][selectedIndex]["stats"][stat] += 1;
  localStorage.setItem("userInfo", JSON.stringify(userData));

  set(
    ref(
      database,
      "users/" +
        localStorage.getItem("SSTea-UID") +
        "/plants/" +
        selectedIndex +
        "/stats/" +
        stat
    ),
    userData["plants"][selectedIndex]["stats"][stat]
  )
    .then(() => {
      createDetailsDisplay(userData["plants"][selectedIndex]);
      alert("Stat upgraded!");
    })
    .catch((error) => {
      console.log(error.code);
    });
}

function displayDetails() {
  let selectedIndex = window.localStorage.getItem("plantIndex");
  let userData = JSON.parse(localStorage.getItem("userInfo"));
  createDetailsDisplay(userData["plants"][selectedIndex]);

  const upgradeBtns = document.querySelectorAll(".upgrade-btn");
  const levelBtn = document.querySelector(".level-btn");

  upgradeBtns[0].addEventListener("click", () => {
    updateDetails(userData, "HP", selectedIndex);
  });
  upgradeBtns[1].addEventListener("click", () => {
    updateDetails(userData, "ATK", selectedIndex);
  });
  upgradeBtns[2].addEventListener("click", () => {
    updateDetails(userData, "Range", selectedIndex);
  });
  upgradeBtns[3].addEventListener("click", () => {
    updateDetails(userData, "ATK Speed", selectedIndex);
  });

  levelBtn.addEventListener("click", () => {
    updateDetails(userData, "level", selectedIndex);
  });
}

if (window.location.pathname == "/Plants/index.html") {
  displayGallery();
} else if (window.location.pathname == "/Plants/plantDetail.html") {
  displayDetails();
}
