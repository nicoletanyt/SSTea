const levelLabel = document.querySelector("#level-label");
levelLabel.textContent = "Level " + localStorage.getItem("level");

const main = document.querySelector("#game");
const rows = 9;
const cols = 11;
let charPos = {}; // format is ID : GRID POS

for (let i = 0; i < cols; i++) {
  for (let j = 0; j < rows; j++) {
    let grid = document.createElement("div");
    grid.classList.add("square");
    grid.addEventListener("drop", (ev) => {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("text");
      ev.target.appendChild(document.getElementById(data));
      charPos[data] = i * rows + j;
    });
    grid.addEventListener("dragover", (ev) => {
      dragover(ev);
    });
    main.appendChild(grid);
  }
}

const grids = document.querySelectorAll(".square");
const teamIndex = JSON.parse(localStorage.getItem("teamIndex"));
const charGrids = document.querySelectorAll(".char-square");

function dragStart(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function dragover(ev) {
  ev.preventDefault();
}

for (let i = 0; i < charGrids.length; i++) {
  let image = charGrids[i].childNodes[1];

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

const startBtn = document.querySelector("#start-btn");
startBtn.addEventListener("click", () => {
  if (charPos.length != teamIndex.length) {
    alert("You have characters that are not deployed.");
  } else {
    // Remove drag-drop of chars
    for (let i = 0; i < charGrids.length; i++) {
      charGrids[i].classList.add("remove-click");
    }
    for (let i = 0; i < grids.length; i++) {
      grids[i].classList.add("remove-click");
    }
  }
});
