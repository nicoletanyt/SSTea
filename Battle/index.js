const popup = document.getElementById("popup");
const main = document.getElementById("main");
const levels = document.querySelectorAll(".level-label");
const closeBtn = document.querySelector(".close-btn");

for (let i = 0; i < levels.length; i++) {
  levels[i].addEventListener("click", () => {
    localStorage.setItem("level", levels[i].textContent);
    popup.classList.remove("hidden");
    popup.classList.add("show");
    main.classList.add("hidden");
  });
}
closeBtn.addEventListener("click", () => {
  window.location.pathname = "/Battle/level.html";
});
