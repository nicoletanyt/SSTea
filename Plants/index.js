// import { data } from "../Data.js";
let data = JSON.parse(localStorage.getItem("userInfo"));

let userData = data;
console.log(userData);

const createPlantDisplay = (plant) => {
  let displayWrapper = document.createElement("div");
  displayWrapper.classList.add("plant-display");
  let icon = document.createElement("img");
  if (plant.locked) {
    icon.src = "../Assets/Gallery/Lock.png";
  } else {
    icon.src = plant.image;
  }
  displayWrapper.appendChild(icon);
  return displayWrapper;
};

function displayGallery() {
  const plantWrapper = document.querySelector("#gallery-wrapper");
  for (let i = 0; i < userData["plants"].length; i++) {
    let plantDiv = createPlantDisplay(userData["plants"][i]);
    plantWrapper.appendChild(plantDiv);

    if (!userData["plants"][i].locked) {
      plantDiv.addEventListener("click", () => {
        window.localStorage.setItem("plantIndex", i);
        window.location.pathname = "/SSTea/Plants/plantDetail.html";
      });
    }
  }
}

const createDetailsDisplay = (plant) => {
  const plantImg = document.querySelector("#plantImg");
  const name = document.querySelectorAll(".name");
  const level = document.querySelector("#level");
  const stats = document.querySelectorAll(".stat-val");

  plantImg.src = plant["image"];
  name[0].textContent = "Plants Gallery";
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

  for (let i = 0; i < upgradeBtns.length; ++i) {
    upgradeBtns[i].addEventListener("click", () => {
      displayLevelUp(
        upgradeBtns[i].getAttribute("stat"),
        userData["plants"][selectedIndex]
      );
    });
  }
}

function saveToLS() {
  localStorage.setItem("userInfo", JSON.stringify(userData));
}

const displayLevelUp = (upgradeStat, plant) => {
  const main = document.querySelector("#main");
  const popUp = document.querySelector("#popup");
  const closeBtn = document.querySelector(".close-btn");
  const levelUpBtn = document.querySelector("#level-up-btn");
  const beforeVal = document.querySelector(".before-val");
  const afterVal = document.querySelector(".after-val");

  main.classList.add("blur");
  popUp.classList.add("visible");

  // set values
  beforeVal.textContent = plant["stats"][upgradeStat];
  afterVal.textContent = plant["stats"][upgradeStat] + 200;

  closeBtn.addEventListener("click", () => {
    main.classList.remove("blur");
    popUp.classList.remove("visible");
  });

  function upgrade() {
    if (
      // just example vals
      userData["currency"]["glucose"] >= 3 &&
      userData["currency"]["oxygen"] >= 3 &&
      userData["currency"]["leaf"] >= 1
    ) {
      // available upgrade
      userData["currency"]["glucose"] -= 3;
      userData["currency"]["oxygen"] -= 3;
      userData["currency"]["leaf"] -= 1;

      // upgrade json of plant stats
      plant["stats"][upgradeStat] = parseInt(afterVal.textContent);
      plant["stats"]["level"] += 1;
      createDetailsDisplay(plant);
      saveToLS();

      // close popup
      main.classList.remove("blur");
      popUp.classList.remove("visible");
    } else {
      // e.stopImmediatePropagation();
      alert("You do not have enough materials to upgrade.");
    }
    levelUpBtn.removeEventListener("click", upgrade);
  }

  levelUpBtn.addEventListener("click", upgrade);
};

if (window.location.pathname == "SSTea/Plants/") {
  displayGallery();
} else if (window.location.pathname == "SSTea/Plants/plantDetail.html") {
  displayDetails();
}
