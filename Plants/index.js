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

  for (let i = 0; i < data.plants.length; i++) {
    let plantDiv = createPlantDisplay(data.plants[i].locked);
    plantWrapper.appendChild(plantDiv);

    if (!data.plants[i].locked) {
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
  createDetailsDisplay(data.plants[selectedIndex]);

  const upgradeBtns = document.querySelectorAll(".upgrade-btn");
  // upgradeBtns[0].addEventListener("click", () => {
  //   data.plants[selectedIndex]["stats"]["HP"] += 1;
  //   createDetailsDisplay(data.plants[selectedIndex]);
  // });
  // upgradeBtns[1].addEventListener("click", () => {
  //   data.plants[selectedIndex]["stats"]["ATK"] += 1;
  //   createDetailsDisplay(data.plants[selectedIndex]);
  // });
  // upgradeBtns[2].addEventListener("click", () => {
  //   data.plants[selectedIndex]["stats"]["Range"] += 1;
  //   createDetailsDisplay(data.plants[selectedIndex]);
  // });
  // upgradeBtns[3].addEventListener("click", () => {
  //   data.plants[selectedIndex]["stats"]["ATK Speed"] += 1;
  //   createDetailsDisplay(data.plants[selectedIndex]);
  // });
}

if (window.location.pathname == "/Plants/index.html") {
  displayGallery();
} else if (window.location.pathname == "/Plants/plantDetail.html") {
  displayDetails();
}
