const main = document.getElementById("main");
const popup = document.getElementById("popup");
const shopItems = document.getElementById("items");

const leaf = document.querySelector(".leaf");
const oxygen = document.querySelector(".oxygen");
const glucose = document.querySelector(".glucose");

let userData = JSON.parse(localStorage.getItem("userInfo"));

// set the values from localStorage
function getValues() {
  const names = ["leaf", "glucose", "oxygen"];
  const elements = [leaf, glucose, oxygen];
  for (let i = 0; i < names.length; ++i) {
    elements[i].textContent = userData["currency"][names[i]];
  }
}

getValues();

const items = [
  {
    img: "../Assets/Shop/Glucose.png",
    item: "glucose",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Shop/Sun.png",
    item: "sunpower",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Shop/Oxygen.png",
    item: "oxygen",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Homepage/question.png",
    item: "leaf",
    desc: "Quiz",
    cost: "x3",
  },
];

for (let i = 0; i < items.length; ++i) {
  let itemWrapper = document.createElement("div");
  itemWrapper.classList.add("shop-item");
  let img = document.createElement("img");
  img.src = items[i].img;

  let rightWrapper = document.createElement("div");
  rightWrapper.classList.add("desc-wrapper");

  let desc = document.createElement("p");
  desc.textContent =
    items[i].item[0].toUpperCase() +
    items[i].item.substring(1) +
    ":  " +
    items[i].desc;

  // let costWrapper = document.createElement("div");
  // costWrapper.classList.add("cost");
  let cost = document.createElement("p");
  cost.textContent = items[i].cost + " leaf points";

  rightWrapper.appendChild(desc);
  rightWrapper.append(cost);
  itemWrapper.appendChild(img);

  itemWrapper.appendChild(rightWrapper);

  shopItems.appendChild(itemWrapper);

  itemWrapper.addEventListener("click", () => {
    // Detect leaf points
    if (parseInt(items[i].cost.substring(1)) <= parseInt(leaf.textContent)) {
      leaf.textContent =
        parseInt(leaf.textContent) - parseInt(items[i].cost.substring(1));
      userData["currency"]["leaf"] -= parseInt(items[i].cost.substring(1));
      userData["currency"][items[i].item] += parseInt(
        items[i].desc.substring(1)
      );
      console.log(items[i].desc.substring(1));
      alert("Purchase successful");
      getValues();
    } else {
      alert("You do not have enough leaf points");
    }

    if (desc.textContent == "Quiz") {
      // Open Quiz Popup
      main.classList.add("hide");
      popup.classList.remove("hide");
      popup.classList.add("show");

      const options = document.querySelectorAll(".option");
      const closeBtn = document.querySelector(".close-btn");
      let selected = false;

      function selectOption(i) {
        if (i == 1) {
          // The second option is the correct one. If expanding more questions, use a dictionary instead.
          alert("Correct! You get 3 leaf points.");
          leaf.textContent = parseInt(leaf.textContent) + 3;
          userData["currency"]["leaf"] += 3;
          getValues();
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

    // save to localStorage
    localStorage.setItem("userInfo", JSON.stringify(userData));
  });
}
