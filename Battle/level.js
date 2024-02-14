const game = document.getElementById("game");
const charSquares = document.querySelectorAll(".char-square");
const statDisplay = document.getElementById("stat-display");
const rightWrapper = document.querySelector(".right-wrapper");
const rows = 9;
const cols = 4;
let charPos = {}; // format is GRID POS: IMAGE ID
let ranges = {}; // format is IMAGE ID: [range]
const locked = [7, 12, 28, 32];
const enemiesPath = [1, 5, 9, 13, 17, 18, 22, 26, 30, 34];
const enemyFrames = [
  "../Assets/Battle/thunder2.png",
  "../Assets/Battle/thunder3.png",
  "../Assets/Battle/thunder4.png",
  "../Assets/Battle/thunder5.png",
];
let enemyCurr = 0;
let userData = JSON.parse(localStorage.getItem("userInfo"));

function loadPlants() {
  for (let i = 0; i < userData["plants"].length; ++i) {
    if (!userData["plants"][i].locked && userData["plants"][i].draw) {
      let img = document.createElement("img");
      img.src = userData["plants"][i]["image"];
      img.draggable = true;
      img.id = i.toString();
      charSquares[i].appendChild(img);
      // totalChar += 1;
    }
  }
}

function showRange(pos) {
  let r = Math.floor(pos / cols);
  let c = pos % cols;
  let rangeSquares = [];
  let directions = [
    [-1, -1],
    [-1, 0],
    [-1, +1],
    [0, -1],
    [0, +1],
    [+1, -1],
    [+1, 0],
    [+1, +1],
  ];

  for (let i = 0; i < directions.length; ++i) {
    if (
      r + directions[i][0] >= 0 &&
      r + directions[i][0] < rows &&
      c + directions[i][1] >= 0 &&
      c + directions[i][1] < cols
    ) {
      rangeSquares.push((r + directions[i][0]) * cols + (c + directions[i][1]));
    }
  }
  console.log(rangeSquares);
  return rangeSquares;
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
          !ev.target.classList.contains("enemy-curr") &&
          !ev.target.classList.contains("house")
        ) {
          var data = ev.dataTransfer.getData("text");
          ev.target.appendChild(document.getElementById(data));
          charPos[data] = i * rows + j;
          // update ranges for all
          ranges[data] = showRange(i * rows + j);

          for (let k = 0; k < Object.values(ranges).length; ++k) {
            for (let j = 0; j < Object.values(ranges)[k].length; ++j) {
              grids[Object.values(ranges)[k][j]].classList.add("show-range");
            }
          }
        } else {
          alert("You cannot place it here.");
        }
      });
      grid.addEventListener("dragover", (ev) => {
        dragover(ev);
      });
      game.appendChild(grid);
    }
  }
}

createGrid();
loadPlants();
const grids = document.querySelectorAll(".square");
const charGrids = document.querySelectorAll(".char-square");

function createEnemy(index, grid) {
  let charWrapper = document.createElement("div");

  const enemy = document.createElement("img");
  enemy.src = "../Assets/Battle/thunder.png";
  charWrapper.appendChild(enemy);
  charWrapper.classList.add("enemy-curr");

  // grid[enemiesPath[index]].classList.add("enemy-curr");
  grid[enemiesPath[index]].appendChild(charWrapper);
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
      console.log(ranges[image.id]);
      if (ranges[image.id] != undefined) {
        // remove previous range
        for (let j = 0; j < ranges[image.id].length; ++j) {
          grids[ranges[image.id][j]].classList.remove("show-range");
        }
      }
    });

    charGrids[i].addEventListener("drop", (ev) => {
      drop(ev);
    });

    charGrids[i].addEventListener("dragover", (ev) => {
      dragover(ev);
    });
    image.addEventListener("click", () => {
      // unblur all other plants
      for (let j = 0; j < charGrids.length; ++j) {
        charGrids[j].style.filter = "";
      }
      // get stat details
      let statsNames = Object.keys(userData["plants"][i].stats);
      statDisplay.classList.remove("hidden");
      statDisplay.childNodes[0].textContent = userData["plants"][i]["name"];
      statDisplay.style.top = (16 * i + 3).toString() + "%";
      // -1 for length so don't show level
      let statText = "";
      for (let j = 0; j < statsNames.length - 1; ++j) {
        statText +=
          statsNames[j] +
          ": " +
          userData["plants"][i]["stats"][statsNames[j]] +
          "\t";
      }
      rightWrapper.style.filter = "blur(3px)";
      for (let j = 0; j < charGrids.length; ++j) {
        if (j != i) charGrids[j].style.filter = "blur(3px)";
      }
      statDisplay.childNodes[1].textContent = statText;
      rightWrapper.addEventListener("click", removeStat);
    });
    function removeStat() {
      if (!statDisplay.classList.contains("hidden")) {
        statDisplay.classList.add("hidden");
        // unblur all other plants
        for (let j = 0; j < charGrids.length; ++j) {
          charGrids[j].style.filter = "";
        }
        rightWrapper.style.filter = "";
      }
      rightWrapper.removeEventListener("click", removeStat);
    }
  }
}

const startBtn = document.querySelector("#start-btn");

startBtn.addEventListener("click", () => {
  startGame();
});

function startGame() {
  class Tower {
    constructor(health, pos, obj, img) {
      this.health = health;
      this.pos = pos;
      this.obj = obj;
      this.img = img;
    }

    attack() {
      if (
        this.health > 0 &&
        Math.abs((enemiesPath[enemy.pos] % 4) - (this.pos % 4)) <=
          this.obj["stats"]["Range"] &&
        Math.abs(
          Math.floor(enemiesPath[enemy.pos] / 4) - Math.floor(this.pos / 4)
        ) <= this.obj["stats"]["Range"]
      ) {
        enemy.health -= this.obj["stats"]["ATK"];
        console.log(this.obj.name);
      }
    }
    spin() {
      if (
        this.health > 0 &&
        Math.abs((enemiesPath[enemy.pos] % 4) - (this.pos % 4)) <=
          this.obj["stats"]["Range"] &&
        Math.abs(
          Math.floor(enemiesPath[enemy.pos] / 4) - Math.floor(this.pos / 4)
        ) <= this.obj["stats"]["Range"]
      ) {
        let tx = this.pos % cols;
        let ty = Math.floor(this.pos / cols);
        let ex = enemiesPath[enemy.pos] % cols;
        let ey = Math.floor(enemiesPath[enemy.pos] / cols);
        let angle = 0;

        if (ey == ty) {
          if (tx > ex) angle = -Math.PI / 2;
          else angle = Math.PI / 2;
        } else if (ex == tx) {
          if (ey > ty) angle = Math.PI;
          else angle = 0;
        } else if (this.pos > enemiesPath[enemy.pos]) {
          let o = ty - ey;
          let a = tx - ex;
          if (ty > ey) {
            angle = -Math.atan(o / a);
          } else {
            angle = Math.atan(o / a);
          }
        } else {
          let o = tx - ex;
          let a = ty - ey;
          if (ty > ey) angle = Math.atan(o / a) + Math.PI;
          else angle = -(Math.atan(o / a) + Math.PI);
        }

        this.img.style.rotate = angle.toString() + "rad";
      } else {
        this.img.style.rotate = "0rad";
      }
    }
  }

  class Enemy {
    constructor(health, pos, attackFrames = 0, isAttacking = false) {
      this.health = health;
      this.pos = pos; // pos is the index of enemiesPath
      this.attackFrames = attackFrames;
      this.isAttacking = isAttacking;
    }

    attack(player) {
      // attack if player on path or home
      this.isAttacking = true;
      player.health -= 20 / (player.obj["stats"]["HP"] / 100);

      let img = squares[enemiesPath[this.pos]].children[0].children[0];

      img.src = enemyFrames[this.attackFrames];
      if (this.attackFrames < enemyFrames.length - 1) {
        this.attackFrames += 1;
      } else {
        this.attackFrames = 0; // restart the cycle
      }
    }

    move() {
      charWrapper.children[0].src = "../Assets/Battle/thunder.png";

      this.pos += 1;
      squares[enemiesPath[this.pos]].appendChild(charWrapper);
    }
  }

  const squares = document.querySelectorAll(".square");
  const lifeLeft = document.querySelector(".life-left");
  const enemiesLeft = document.querySelector(".enemies-left");
  const characters = document.getElementById("character-wrapper");
  let players = [];
  let enemy = new Enemy(100, 0);
  let lives = 3;

  // hide confirm button
  startBtn.classList.add("hidden");

  // Add placed plants on the side
  characters.innerHTML = "";

  // Add player's plants
  for (let key in charPos) {
    let charWrapper = document.createElement("div");
    let healthBar = document.createElement("div");
    let val = document.createElement("div");
    let img = document.getElementById(key);
    val.classList.add("val");
    healthBar.classList.add("health-bar");
    healthBar.appendChild(val);

    charWrapper.appendChild(img);
    charWrapper.appendChild(healthBar);

    squares[charPos[key]].appendChild(charWrapper);
    let plant = new Tower(
      100,
      charPos[key],
      userData["plants"][parseInt(img.id)],
      img
    );
    players.push(plant);

    let imgCopy = document.createElement("img");
    imgCopy.src = img.src;
    let imgWrapper = document.createElement("div");
    let cWrapper = document.createElement("div");
    cWrapper.classList.add("char-wrapper");
    imgWrapper.classList.add("char-square");

    imgWrapper.appendChild(imgCopy);
    cWrapper.appendChild(imgWrapper);

    characters.appendChild(cWrapper);
  }

  // Add enemy's health bar
  let charWrapper = document.querySelector(".enemy-curr");
  let healthBar = document.createElement("div");
  let val = document.createElement("div");
  val.classList.add("val");
  healthBar.classList.add("health-bar");
  healthBar.appendChild(val);
  charWrapper.appendChild(healthBar);

  // remove all red squares
  const withRange = document.querySelectorAll(".show-range");
  for (let i = 0; i < withRange.length; ++i) {
    withRange[i].classList.remove("show-range");
  }

  let enemyMovement = setInterval(game, 2000); // repeat this function every x ms

  function game() {
    console.log(enemy.health);
    if (lives <= 0 || enemy.health <= 0) {
      // game over & return to homepage
      clearInterval(enemyMovement);
      if (lives <= 0) alert("Failed.");
      else {
        enemiesLeft.textContent = "0/1";
        alert("Level Cleared!");
      }
      if (window.location.hostname == "nicoletanyt.github.io") {
        window.location.pathname = "/SSTea/";
      } else {
        window.location.pathname = "../";
      }
    }
    if (enemy.pos != enemiesPath.length - 2 && !enemy.isAttacking) {
      enemy.move();
    } else {
      if (enemy.pos == enemiesPath.length - 2 && lives > 0) {
        // attacking home base
        lives -= 1;
        lifeLeft.textContent = lives.toString() + "/3";
        console.log("Life Left: " + lives.toString());
      }
    }

    for (let i = 0; i < players.length; ++i) {
      players[i].attack();
      players[i].spin();
      if (players[i].pos == enemiesPath[enemy.pos + 1]) {
        // enemy to attack this player
        console.log(players[i].health);
        enemy.attack(players[i]);
        // update health bars
        squares[
          players[i].pos
        ].childNodes[0].childNodes[1].childNodes[0].style.height =
          players[i].health.toString() + "%";
      }
      squares[
        enemiesPath[enemy.pos]
      ].childNodes[0].childNodes[1].childNodes[0].style.height =
        enemy.health.toString() + "%";
      if (players[i].health <= 0) {
        // greyscale the dead plants on the sidebar
        for (let i = 0; i < characters.childNodes.length; ++i) {
          if (
            characters.childNodes[i].firstChild.firstChild.src ==
            squares[players[i].pos].firstChild.firstChild.src
          ) {
            characters.childNodes[i].firstChild.style.filter = "grayscale()";
          }
        }
        squares[players[i].pos].removeChild(squares[players[i].pos].firstChild);
        enemy.isAttacking = false;
        players.splice(i, 1);
      }
    }
  }
}
