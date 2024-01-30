const main = document.getElementById("main");
const popup = document.getElementById("popup");
const shopItems = document.getElementById("items");

const leaf = document.querySelector(".leaf");
const oxygen = document.querySelector(".oxygen");
const glucose = document.querySelector(".glucose");

// set the values from localStorage
function getValues() {
  const names = ["SSTea-Leaf", "SSTea-Glucose", "SSTea-Oxygen"];
  const elements = [leaf, glucose, oxygen];
  for (let i = 0; i < names.length; ++i) {
    if (localStorage.getItem(names[i]) == undefined) {
      elements[i].textContent = 10;
    } else {
      elements[i].textContent = localStorage.getItem(names[i]);
    }
  }
}

getValues();

const items = [
  {
    img: "../Assets/Homepage/glucose.png",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Homepage/sun.png",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Homepage/oxygen.png",
    desc: "x10",
    cost: "x1",
  },
  {
    img: "../Assets/Homepage/question.png",
    desc: "Quiz",
    cost: "x3",
  },
];

function save() {
  // save the details to localStorage
  localStorage.setItem("SSTea-Leaf", leaf.textContent);
  localStorage.setItem("SSTea-Glucose", glucose.textContent);
  localStorage.setItem("SSTea-Oyxgen", oxygen.textContent);
}

for (let i = 0; i < items.length; ++i) {
  let itemWrapper = document.createElement("div");
  itemWrapper.classList.add("shop-item");
  let img = document.createElement("img");
  img.src = items[i].img;

  let desc = document.createElement("p");
  desc.textContent = items[i].desc;

  let costWrapper = document.createElement("div");
  costWrapper.classList.add("cost");
  let cost = document.createElement("p");
  cost.textContent = items[i].cost;

  let leafImg = document.createElement("img");
  leafImg.src = "../Assets/Homepage/leaf.png";

  itemWrapper.appendChild(img);
  itemWrapper.appendChild(desc);
  itemWrapper.appendChild(cost);

  costWrapper.appendChild(leafImg);
  costWrapper.appendChild(cost);
  itemWrapper.appendChild(costWrapper);

  shopItems.appendChild(itemWrapper);

  itemWrapper.addEventListener("click", () => {
    // Detect leaf points
    if (parseInt(items[i].cost.substring(1)) <= parseInt(leaf.textContent)) {
      leaf.textContent =
        parseInt(leaf.textContent) - parseInt(items[i].cost.substring(1));
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

    save();
  });
}
