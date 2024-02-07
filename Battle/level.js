const selectGrid = document
  .querySelector(".right-wrapper")
  .querySelector(".game");
const game = document.getElementById("middle-wrapper").querySelector(".game");
const selectWrapper = document.querySelector(".game-wrapper");
const gameWrapper = document.querySelector(".game-wrapper-actual");
const charSquares = document.querySelectorAll(".char-square");
const rows = 9;
const cols = 4;
let charPos = {}; // format is ID : GRID POS
const locked = [7, 12, 28, 32];
const enemiesPath = [1, 5, 9, 13, 17, 18, 22, 26, 30, 34];
const enemyFrames = [
  "../Assets/Battle/thunder2.png",
  "../Assets/Battle/thunder3.png",
  "../Assets/Battle/thunder4.png",
  "../Assets/Battle/thunder5.png",
];
let enemyCurr = 0;
let totalChar = 0;
let userData = JSON.parse(localStorage.getItem("userInfo"));

function loadPlants() {
  for (let i = 0; i < userData["plants"].length; ++i) {
    if (!userData["plants"][i].locked && userData["plants"][i].draw) {
      let img = document.createElement("img");
      img.src = userData["plants"][i]["image"];
      img.draggable = true;
      img.id = "char-" + (totalChar + 1).toString();
      charSquares[totalChar].appendChild(img);
      totalChar += 1;
    }
  }
}

function createGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let grid = document.createElement("div");
      grid.classList.add("square");
      grid.addEventListener("drop", (ev) => {
        ev.preventDefault();
        if (
          !ev.target.classList.contains("locked") &&
          !ev.target.classList.contains("enemy") &&
          !ev.target.classList.contains("house")
        ) {
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data));
          charPos[data] = i * rows + j;
        } else {
          alert("You cannot place it here.");
        }
      });
      grid.addEventListener("dragover", (ev) => {
        dragover(ev);
      });
      selectGrid.appendChild(grid);
    }
  }
}

createGrid();
loadPlants();
const grids = document.querySelectorAll(".square");
const charGrids = document.querySelectorAll(".char-square");

function createEnemy(index, grid) {
  const enemy = document.createElement("img");
  enemy.src = "../Assets/Battle/thunder.png";
  grid[enemiesPath[index]].classList.add("enemy-curr");
  grid[enemiesPath[index]].appendChild(enemy);
}

function createEntities(grid) {
  // Make house
  const house = document.createElement("img");
  house.src = "../Assets/Battle/house.png";
  house.classList.add("house");
  grid[34].appendChild(house);

  // set locked grids
  for (let i = 0; i < locked.length; ++i) {
    grid[locked[i]].classList.add("locked");
  }
  // set enemies path
  for (let i = 0; i < enemiesPath.length; ++i) {
    grid[enemiesPath[i]].classList.add("enemy");
  }
  // add enemy
  createEnemy(0, grid);
}

createEntities(grids);

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();

  var data = ev.dataTransfer.getData("text");
  if (
    !ev.target.classList.contains("locked") &&
    !ev.target.classList.contains("enemy") &&
    !ev.target.classList.contains("house")
  ) {
    ev.target.appendChild(document.getElementById(data));
  } else {
    alert("You cannot place it here.");
  }
}

function dragover(ev) {
  ev.preventDefault();
}

for (let i = 0; i < charGrids.length; i++) {
  if (charGrids[i].hasChildNodes()) {
    let image = charGrids[i].children[0];

    image.addEventListener("dragstart", (ev) => {
      dragStart(ev);
      charPos[image.id] = -1;
    });

    charGrids[i].addEventListener("drop", (ev) => {
      drop(ev);
    });

    charGrids[i].addEventListener("dragover", (ev) => {
      dragover(ev);
    });
    image.addEventListener("click", () => {
      // get stat details
      console.log("!");
      let details = charGrids[i].parentNode;
      console.log(details);
      for (
        let j = 0;
        j < Object.keys(userData["plants"][i].stats).length;
        ++j
      ) {
        details.textContent += Object.keys(userData["plants"][i].stats)[j];
      }
      console.log();
    });
  }
}

function createGameGrid() {
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let grid = document.createElement("div");
      grid.classList.add("game-square");
      game.appendChild(grid);
    }
  }
}

const startBtn = document.querySelector("#start-btn");

startBtn.addEventListener("click", () => {
  selectWrapper.classList.add("hidden");
  gameWrapper.classList.remove("hidden");
  gameWrapper.classList.add("show");
  startGame();
});

function startGame() {
  createGameGrid();
  const squares = document.querySelectorAll(".game-square");
  const enemyH = document.getElementById("enemy-health").querySelector(".val");
  const homeH = document.getElementById("home-health").querySelector(".val");
  let enemyHealth = 100;
  let homeHealth = 100;

  // Add player's plants
  for (let key in charPos) {
    squares[charPos[key]].appendChild(document.getElementById(key));
  }

  createEntities(squares);
  enemyH.style.height = enemyHealth.toString() + "%";
  homeH.style.height = homeHealth.toString() + "%";

  let enemyMovement = setInterval(moveEnemy, 2000); // repeat this function every x ms
  function moveEnemy() {
    squares[enemiesPath[enemyCurr]].classList.remove("enemy-curr");
    squares[enemiesPath[enemyCurr]].removeChild(
      squares[enemiesPath[enemyCurr]].lastChild
    ); // removes the image
    enemyCurr += 1;
    createEnemy(enemyCurr, squares);

    function shootEnemy() {
      // minus health from enemy
      // modify according to plant stats
      enemyHealth -= 10;
      enemyH.style.height = enemyHealth.toString() + "%";

      if (enemyHealth <= 0) {
        // end game and return to homepage
        endGame();
        // window.location.pathname = "/SSTea/";
        window.location.pathname = "../";
      }
    }

    function endGame() {
      clearInterval(enemyMovement);
      alert("Level cleared!");
    }

    if (Object.keys(charPos).length != 0) shootEnemy();

    if (enemyCurr == enemiesPath.length - 2) {
      clearInterval(enemyMovement);

      let enemyAttack = setInterval(attack, 2000);
      let attackFrames = 0;
      let img = squares[enemiesPath[enemyCurr]].children[0];

      function attack() {
        homeHealth -= 10;
        homeH.style.height = homeHealth.toString() + "%"; // attack

        if (Object.keys(charPos).length != 0) shootEnemy();

        if (homeHealth == 0) {
          clearInterval(enemyAttack);
          alert("Failed.");
        }

        img.src = enemyFrames[attackFrames];
        if (attackFrames < enemyFrames.length - 1) {
          attackFrames += 1;
        }
      }
    }
  }
}
