// import { data } from "../Data.js";
let data = JSON.parse(window.localStorage.getItem("userInfo"));

let userData = data;
let selectedColour = "#000000";
console.log(userData);

const createPlantDisplay = (plant) => {
  console.log(plant);
  let displayWrapper = document.createElement("div");
  displayWrapper.classList.add("plant-display");
  let icon = document.createElement("img");
  if (plant.locked) {
    icon.src = "../Assets/Gallery/Lock.png";
  } else {
    if (plant.draw) {
      icon.src = plant.image;
    } else {
      icon.src = "../Assets/Gallery/unlock.png"; // set unlocked img
    }
  }
  displayWrapper.appendChild(icon);
  return displayWrapper;
};

function displayDraw(i) {
  const drawWrapper = document.getElementById("draw-avatar");
  drawWrapper.classList.remove("hidden");
  const grid = document.getElementById("grid");
  const colourPicker = document.getElementById("colour-picker");
  const displayColour = document.getElementById("color-text");
  const doneBtn = document.getElementById("done-btn");
  displayColour.textContent = selectedColour;
  // create a 15 by 15 grid for drawing
  for (let i = 0; i < 14; ++i) {
    for (let j = 0; j < 14; ++j) {
      let square = document.createElement("div");
      square.classList.add("square");
      grid.appendChild(square);
    }
  }
  const squares = document.querySelectorAll(".square");
  for (let i = 0; i < squares.length; ++i) {
    squares[i].addEventListener("click", () => {
      console.log(selectedColour);
      squares[i].style.backgroundColor = selectedColour;
      // squares[i].style.backgroundColor = "#000000";
    });
  }
  function changeColour(event) {
    selectedColour = event.target.value;
    displayColour.textContent = selectedColour;
  }
  doneBtn.addEventListener("click", () => {
    html2canvas(grid).then((canvas) => {
      document.body.appendChild(canvas);
      let data = canvas.toDataURL("image/png");
      data.replace(/^data:image\/(png|jpg);base64,/, "");
      userData["plants"][i]["image"] = data;
      userData["plants"][i]["draw"] = true;
      saveToLS();
      alert("Saved.");
      // updates the image
      document.getElementById("gallery-wrapper").childNodes[i].firstChild.src =
        data;
      drawWrapper.classList.add("hidden");
    });
  });
  colourPicker.addEventListener("change", changeColour);
}

function displayGallery() {
  console.log("Display Gallery");
  const plantWrapper = document.querySelector("#gallery-wrapper");
  for (let i = 0; i < userData["plants"].length; i++) {
    let plantDiv = createPlantDisplay(userData["plants"][i]);
    plantWrapper.appendChild(plantDiv);

    if (!userData["plants"][i].locked) {
      plantDiv.addEventListener("click", () => {
        if (!userData["plants"][i].draw) {
          displayDraw(i);
        } else {
          window.localStorage.setItem("plantIndex", i);
          window.location.pathname = "/Plants/plantDetail.html"; // if github doesn't work, add /SSTea
        }
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
  console.log(userData);
  localStorage.setItem("userInfo", JSON.stringify(userData));
  console.log("finished saving");
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

// if github doesnt work, add ""
if (window.location.pathname.includes("/Plants/")) {
  displayGallery();
} else if (window.location.pathname.includes("/Plants/plantDetail.html")) {
  displayDetails();
}
