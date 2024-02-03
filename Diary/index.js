const main = document.getElementById("img-wrapper");
let imgData = JSON.parse(localStorage.getItem("userInfo"))["diary"];
console.log(imgData);
// date: img

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
