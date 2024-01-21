import { userData } from "../Data.js";
// let userData = JSON.parse(localStorage.getItem("userInfo"));

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
  const name = document.querySelectorAll(".name");
  const level = document.querySelector("#level");
  const stats = document.querySelectorAll(".stat-val");

  // plantImg.src = plant["img"];
  name[0].textContent = plant["name"]; // two labels
  name[1].textContent = plant["name"];
  level.textContent = "Level " + plant["stats"]["level"];

  stats[0].children[1].textContent = plant["stats"]["HP"];
  stats[1].children[1].textContent = plant["stats"]["ATK"];
  stats[2].children[1].textContent = plant["stats"]["Range"];
};

function displayDetails() {
  let selectedIndex = window.localStorage.getItem("plantIndex");
  createDetailsDisplay(userData["plants"][selectedIndex]);

  const upgradeBtns = document.querySelectorAll(".upgrade-btn");
  const levelBtn = document.querySelector(".level-btn");

  for (let i = 0; i < upgradeBtns.length; ++i) {
    upgradeBtns[i].addEventListener("click", () => {
      displayLevelUp(upgradeBtns[i].getAttribute("stat"));
    });
  }

  levelBtn.addEventListener("click", () => {
    updateDetails(userData, "level", selectedIndex);
  });
}

const displayLevelUp = (stat) => {
  const main = document.querySelector("#main");
  const popUp = document.querySelector("#popup");
  const closeBtn = document.querySelector(".close-btn");
  main.classList.add("blur");
  popUp.classList.add("visible");

  closeBtn.addEventListener("click", () => {
    main.classList.remove("blur");
    popUp.classList.remove("visible");
  });
};

if (window.location.pathname == "/Plants/index.html") {
  displayGallery();
} else if (window.location.pathname == "/Plants/plantDetail.html") {
  displayDetails();
}
