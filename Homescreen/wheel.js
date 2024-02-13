import { loadValues } from "./index.js";

const spinBtn = document.getElementById("spin-btn");
const quizPopup = document.getElementById("quizPopup");

const circle = document.getElementById("circle");
const dot = document.getElementById("dot");
const sections = 4;
const deg = parseInt(360 / sections);
const rewards = ["10 Glucose", "10 Leaf Points", "10 Oxygen", "10 Sunpower"];
let number = Math.ceil(Math.random() * 1000);
const parts = document.querySelectorAll(".quadrant");
const closeBtn = document.querySelector(".close-btn");

closeBtn.addEventListener("click", () => {
  quizPopup.classList.add("hide");
  dot.classList.add("hide");
  for (let i = 0; i < parts.length; ++i) {
    parts[i].classList.add("hide");
  }
});

spinBtn.addEventListener("click", () => {
  quizPopup.classList.remove("hide");
  dot.classList.remove("hide");
  for (let i = 0; i < parts.length; ++i) {
    parts[i].classList.remove("hide");
  }
});

circle.addEventListener("click", () => {
  let dateNow = new Date();
  if (
    localStorage.getItem("lastSpun") == undefined ||
    JSON.parse(localStorage.getItem("lastSpun")) != dateNow.toDateString()
  ) {
    localStorage.setItem("lastSpun", JSON.stringify(dateNow.toDateString()));
    console.log(number);
    circle.style.transform = "rotate(" + number + "deg)";
    // number += Math.ceil(Math.random() * 1000);
    // show alert after its done spinning. duration should be == transition
    let index = parseInt((number % 360) / deg);
    if (index < 0) index = 0;
    let prize = rewards[index];
    setTimeout(() => {
      quizPopup.classList.add("hide");
      dot.classList.add("hide");
      for (let i = 0; i < parts.length; ++i) {
        parts[i].classList.add("hide");
      }
      alert(
        "You won " + prize + "! Answer a question correctly to get the prize!"
      );
      showQuestion(prize);
    }, 5000);
  } else {
    alert("You have spun the wheel once today.");
  }
});

function showQuestion(prize) {
  const popup = document.getElementById("popup");
  const options = document.querySelectorAll(".option");
  const closeBtn = document.querySelector(".close-btn");
  let userData = JSON.parse(localStorage.getItem("userInfo"));
  let selected = false;

  // Open Quiz Popup
  // quizPopup.classList.add("hide");
  popup.classList.remove("hide");
  popup.classList.add("show");

  function selectOption(i) {
    if (i == 1) {
      // The second option is the correct one. If expanding more questions, use a dictionary instead.
      alert("Correct!");
      let parts = prize.split(/[ ]+/);
      userData["currency"][parts[1].toLowerCase()] += parseInt(parts[0]);
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
    loadValues();
    main.classList.remove("hide");
    main.classList.add("show");
    popup.classList.add("hide");
  });
}
