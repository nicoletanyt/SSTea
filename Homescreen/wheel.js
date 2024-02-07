const circle = document.getElementById("circle");
const dot = document.getElementById("dot");
const sections = 4;
const deg = parseInt(360 / sections);
const rewards = ["Quiz", "20 Leaf Points", "Quiz", "10 Glucose"];
const colours = ["#f404b6", "white", "blue", "yellow"];
let number = Math.ceil(Math.random() * 1000);

for (let i = 0; i < sections; ++i) {
  let part = document.createElement("div");
  part.classList.add("number");
  part.style.transform = "rotate(" + (i * deg).toString() + "deg)";
  part.style.backgroundColor = colours[i];
  part.textContent = rewards[i];
  circle.appendChild(part);
}

circle.addEventListener("click", () => {
  console.log(number);
  circle.style.transform = "rotate(" + number + "deg)";
  number += Math.ceil(Math.random() * 1000);
  // show alert after its done spinning. duration should be == transition
  let index = parseInt(((number - deg) % 360) / deg) - 1;
  if (index < 0) index = 0;
  setTimeout(() => {
    alert("You won " + rewards[index] + "!");
    if (rewards[index] == "Quiz") {
      console.log("quiz!");
      showQuestion();
    }
    // circle.style.transition = "0s";
    // circle.style.transform = "none";
  }, 5000);
});

function showQuestion() {
  const main = document.getElementById("spin-wrapper");
  const popup = document.getElementById("popup");
  const options = document.querySelectorAll(".option");
  const closeBtn = document.querySelector(".close-btn");
  let userData = JSON.parse(localStorage.getItem("userInfo"));
  let selected = false;

  // Open Quiz Popup
  main.classList.add("hide");
  popup.classList.remove("hide");
  popup.classList.add("show");

  function selectOption(i) {
    if (i == 1) {
      // The second option is the correct one. If expanding more questions, use a dictionary instead.
      alert("Correct! You get 3 leaf points.");
      //   leaf.textContent = parseInt(leaf.textContent) + 3;
      userData["currency"]["leaf"] += 3;
      localStorage.setItem("userInfo", JSON.stringify(userData));
    } else {
      alert("Wrong.");
    }

    // set the background colour of all to red
    for (let j = 0; j < options.length; ++j) {
      options[j].style.backgroundColor = "#ECA595";
    }
    // set the background colour for option 1 to green
    options[1].style.backgroundColor = "#B4EC95";
    selected = true;
  }

  for (let i = 0; i < options.length; ++i) {
    options[i].addEventListener("click", () => {
      if (!selected) selectOption(i);
    });
  }

  closeBtn.addEventListener("click", () => {
    main.classList.remove("hide");
    main.classList.add("show");
    popup.classList.add("hide");
  });
}
