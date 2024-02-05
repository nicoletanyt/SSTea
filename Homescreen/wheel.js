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
  // show alert after its done spinning. duration should be == transition
  setTimeout(() => {
    alert(
      "You won " + rewards[parseInt(((number - deg) % 360) / deg) - 1] + "!"
    );
    // circle.style.transition = "0s";
    // circle.style.transform = "none";
  }, 5000);
});
