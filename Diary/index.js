const main = document.getElementById("main");
let imgData = JSON.parse(localStorage.getItem("imgData"));
console.log(imgData);

for (let i = 0; i < Object.keys(imgData).length; ++i) {
  const wrapper = document.createElement("div");
  const title = document.createElement("h3");
  const pic = document.createElement("img");

  title.textContent = new Date(Object.keys(imgData)[i]).toDateString();
  pic.src = imgData[Object.keys(imgData)[i]];

  wrapper.appendChild(title);
  wrapper.appendChild(pic);

  main.appendChild(wrapper);
}
