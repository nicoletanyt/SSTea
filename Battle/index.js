const popup = document.getElementById("popup");
const main = document.getElementById("main");
const levels = document.querySelectorAll(".level-label");
const closeBtn = document.querySelector(".close-btn");

const sunpower = document.querySelector(".sunpower");
const glucose = document.querySelector(".glucose");
const oxygen = document.querySelector(".oxygen");

let userData = JSON.parse(localStorage.getItem("userInfo"));
sunpower.textContent = userData["currency"]["sunpower"].toString() + "/30";
glucose.textContent = userData["currency"]["glucose"];
oxygen.textContent = userData["currency"]["oxygen"];

for (let i = 0; i < levels.length; i++) {
  levels[i].addEventListener("click", () => {
    if (levels[i].classList.contains("#1")) {
      localStorage.setItem("level", levels[i].textContent);
      popup.classList.remove("hidden");
      popup.classList.add("show");
      main.classList.add("hidden");
    } else {
      alert("Level locked");
    }
  });
}
closeBtn.addEventListener("click", () => {
  if (window.location.hostname == "nicoletanyt.github.io") {
    window.location.pathname = "/SSTea/Battle/level.html";
  } else {
    window.location.pathname = "/Battle/level.html";
  }
});
