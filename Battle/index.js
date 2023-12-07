function selectLevels() {
  const levels = document.querySelectorAll(".level-label");

  for (let i = 0; i < levels.length; i++) {
    levels[i].addEventListener("click", () => {
      localStorage.setItem("level", i + 1);
      window.location.pathname = "/Battle/selectCharacter.html";
    });
  }
}

function selectChar() {
  const availableChars = document.querySelectorAll(".available");
  // currTeam and selectedIndex should have the same length
  const currTeam = document.querySelectorAll(".selected-char");
  let selectedIndex = [];

  for (let i = 0; i < availableChars.length; i++) {
    if (selectedIndex.length < 4) {
      availableChars[i].addEventListener("click", () => {
        // Add available
        let index = selectedIndex.findIndex((j) => {
          return j == i;
        });
        if (index == -1) {
          selectedIndex.push(i);
          currTeam[selectedIndex.length - 1].textContent = i;
        }
      });
    }
  }

  for (let i = 0; i < currTeam.length; i++) {
    currTeam[i].addEventListener("click", () => {
      // Remove
      if (selectedIndex.length > 0 && i == selectedIndex.length - 1) {
        selectedIndex.splice(i, 1);
        currTeam[i].textContent = "";
        console.log(selectedIndex);
      }
    });
  }

  const enterBtn = document.querySelector("#enter-btn");
  enterBtn.addEventListener("click", () => {
    if (selectedIndex.length == 4) {
      localStorage.setItem("teamIndex", JSON.stringify(selectedIndex));
      window.location.pathname = "/Battle/level.html";
    } else {
      alert("Minimum 4 characters"); // TBC
    }
  });
}

if (document.location.pathname == "/Battle/selectCharacter.html") {
  selectChar();
} else {
  selectLevels();
}
