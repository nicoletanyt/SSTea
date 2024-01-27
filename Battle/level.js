const main = document.getElementById("game");
const rows = 9;
const cols = 4;
let charPos = {}; // format is ID : GRID POS
const locked = [7, 12, 28, 32];
const enemiesPath = [1, 5, 9, 13, 17, 18, 22, 26, 30, 34];

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
      main.appendChild(grid);
    }
  }
}

createGrid();
const grids = document.querySelectorAll(".square");
const charGrids = document.querySelectorAll(".char-square");

// Make house
const house = document.createElement("img");
house.src = "../Assets/Battle/house.png";
house.classList.add("house");
grids[34].appendChild(house);

// set locked grids
for (let i = 0; i < locked.length; ++i) {
  grids[locked[i]].classList.add("locked");
}
// set enemies path
for (let i = 0; i < enemiesPath.length; ++i) {
  grids[enemiesPath[i]].classList.add("enemy");
}

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
  }
}

const startBtn = document.querySelector("#start-btn");
