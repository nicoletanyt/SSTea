const game = document.getElementById("game");
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
// let totalChar = 0;
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
    });
  }
}

const startBtn = document.querySelector("#start-btn");

startBtn.addEventListener("click", () => {
  startGame();
});

function startGame() {
  class Tower {
    constructor(health, pos, obj) {
      this.health = health;
      this.pos = pos;
      this.obj = obj;
    }

    attack() {
      // TODO: CHANGE THIS FUNCTION BASED ON STATS USING OBJ.STATS
      if (this.health > 0) {
        enemy.health -= 5;
      }
    }
  }

  class Enemy {
    constructor(health, pos, attackFrames = 0, isAttacking) {
      this.health = health;
      this.pos = pos; // pos is the index of enemiesPath
      this.attackFrames = attackFrames;
      this.isAttacking = isAttacking;
    }

    attack(player) {
      // attack if player on path or home
      this.isAttacking = true;
      player.health -= 10;

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
  let players = [];
  let enemy = new Enemy(100, 0);
  let homeHealth = 100;

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
      userData["plants"][parseInt(img.id)]
    );
    players.push(plant);
  }

  // Add enemy's health bar
  let charWrapper = document.querySelector(".enemy-curr");
  let healthBar = document.createElement("div");
  let val = document.createElement("div");
  val.classList.add("val");
  healthBar.classList.add("health-bar");
  healthBar.appendChild(val);
  charWrapper.appendChild(healthBar);

  let enemyMovement = setInterval(game, 2000); // repeat this function every x ms

  function game() {
    console.log(enemy.health);
    if (homeHealth <= 0 || enemy.health <= 0) {
      // game over & return to homepage
      clearInterval(enemyMovement);
      if (homeHealth <= 0) alert("Failed.");
      else alert("Level Cleared!");
      // window.location.pathname = "/SSTea/";
      window.location.pathname = "../";
    }
    if (enemy.pos != enemiesPath.length - 2 && !enemy.isAttacking) {
      enemy.move();
    } else {
      if (enemy.pos == enemiesPath.length - 2 && enemy.isAttacking) {
        homeHealth -= 10;
        console.log("Home Health: " + homeHealth);
      }
    }

    for (let i = 0; i < players.length; ++i) {
      players[i].attack();
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
        // dead
        squares[players[i].pos].removeChild(squares[players[i].pos].firstChild);
        console.log("dead");
        enemy.isAttacking = false;
        players.splice(i, 1);
        // TODO: UPDATE UI OF DEAD CHARACTERS
      }
    }
  }
}
