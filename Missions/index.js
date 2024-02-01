const main = document.getElementById("main");
const popup = document.getElementById("popup");
const missions = document.querySelectorAll(".mission");
const closeButton = document.querySelector(".close-btn");
const missionList = {
  "take-img": missions[0],
  "water-plant": missions[1],
  "3-battles": missions[2],
};

let userData = JSON.parse(localStorage.getItem("userInfo"));

function takePlant() {
  const width = 320; // scale photo to this
  let height = 0; // computed

  let streaming = false;

  const video = document.getElementById("video");
  const canvas = document.getElementById("output");
  const startButton = document.getElementById("start-button");

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  function startup() {
    if (showViewLiveResultButton()) {
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
        alert("Please enable camera settings");
      });

    video.addEventListener(
      "canplay",

      (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width);

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.setAttribute("width", width);
          video.setAttribute("height", height);
          canvas.setAttribute("width", width);
          canvas.setAttribute("height", height);
        }
      },
      false
    );

    startButton.addEventListener(
      "click",
      (ev) => {
        takepicture();
        startButton.textContent = "Waiting...";
        ev.preventDefault();
        imageRecognition();
      },
      false
    );

    clearphoto();
  }

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    } else {
      clearphoto();
    }
  }

  function imageRecognition() {
    let isPlant = false;
    const possible = ["vase", "flowerpot", "pot"];
    closeButton.classList.add("hidden");
    mobilenet.load().then((model) => {
      // Classify the image.
      model.classify(canvas).then((predictions) => {
        console.log("Predictions: ");
        console.log(predictions);
        for (let i = 0; i < predictions.length; ++i) {
          for (let j = 0; j < possible.length; ++j) {
            if (predictions[i].className.includes(possible[j])) {
              console.log("Object is a plant");
              isPlant = true;
              stopVideo();

              const data = canvas.toDataURL("image/png");
              saveToDiary(data);
              alert("Mission Completed! The image is saved to your diary.");
              popup.classList.add("hidden");
              main.classList.remove("overlay");

              // save progress to local storage
              userData["completedMissions"].push("water-plant");
              localStorage.setItem("userInfo", JSON.stringify(userData));
              listMissions();
              return;
            }
          }
        }
        if (!isPlant) {
          alert("Plant not detected. Please retake.");
          startButton.textContent = "Snap";
        }
        closeButton.classList.remove("hidden");
      });
    });
  }

  function saveToDiary(data) {
    data.replace(/^data:image\/(png|jpg);base64,/, "");
    let imgData = JSON.parse(localStorage.getItem("imgData"));
    if (imgData == null) imgData = {};
    imgData[new Date(Date.now())] = data;
    localStorage.setItem("imgData", JSON.stringify(imgData));
  }

  startup();
}

function listMissions() {
  let completedMissions = userData["completedMissions"];
  // since there's not many missions/there's a fixed number, just use indexing
  for (let i = 0; i < completedMissions.length; ++i) {
    missionList[completedMissions[i]].classList.add("untoggled");
  }
}

function stopVideo() {
  const video = document.getElementById("video");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((mediaStream) => {
      const stream = mediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      console.log("Stop Camera");
    });

  video.srcObject = null;

  // console.log(localStorage.getItem("imgData"));
}

// since there's not many missions/there's a fixed number, just use indexing
missionList["take-img"].addEventListener("click", () => {
  popup.classList.remove("hidden");
  main.classList.add("overlay");
  closeButton.addEventListener("click", () => {
    popup.classList.add("hidden");
    main.classList.remove("overlay");
    stopVideo();
  });

  stopVideo();

  takePlant();
});
