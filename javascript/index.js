let startgameButton = document.querySelector(".controll-buttons .startgame");
let controllButtons = document.querySelector(".controll-buttons");
let spanName = document.querySelector(".name span");
let blocksContainer = document.querySelector(".memory-game");
let triesSpan = document.querySelector(".tries span");
let tryAginDiv = document.querySelector(".tryagin");
let timerSection = document.querySelector(".timersection");
let timerDiv = document.querySelector(".timerdiv");
let timerSpan = document.querySelector(".timerspan");
let historyDiv = document.querySelector(".history");
let backgroundSound = document.querySelector(".backgroundsound");
let successSound = document.querySelector(".success");
let invalidSound = document.querySelector(".invalid");
let clearHistoryButton = document.querySelector(".clearhistory");
// Initialize empty array to store usernames
let userDataArray = [];
let yourName;
let timerSectionWidth = 100;
// Start Button Function
startgameButton.onclick = function () {
  // Play Background Sound
  backgroundSound.play();
  backgroundSound.loop = true;
  yourName = prompt("Whats Your Name?");
  if (yourName == null || yourName == "") {
    spanName.append("Unknown");
    controllButtons.remove();
  } else {
    spanName.append(yourName);
    controllButtons.remove();
  }
  timerF();
  timerSection.classList.remove("hide");
};
let duration = 1000;
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];
shuffle(orderRange);
blocks.forEach((block, index) => {
  block.style.order = orderRange[index];
  //   Add  Event  click
  block.addEventListener("click", function () {
    // Trigger The fipBlock Function
    flipBlock(block);
  });
});
// Flip Block Function
function flipBlock(selectedBlock) {
  // Add Class is-flipped
  selectedBlock.classList.add("is-flipped");
  // Collect All Flipped Cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );
  // If Theres Tow Selected Blocks
  if (allFlippedBlocks.length === 2) {
    // Trigger Stop Clicking Function
    stopClicking();
    // Trigger "checkMatechBlocks"
    checkMatechBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}
// Top Clicking Function
function stopClicking() {
  // Add Class No clicking On Main Container
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => {
    // Remove Class  no Clicking  After The Duration
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}
function checkMatechBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    //Play Success Sound
    successSound.play();
    // Remove Class "is-flipped"
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");
    // Add Class has-match
    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
  } else {
    // Play invalid Sound
    invalidSound.play();
    triesSpan.innerHTML = parseInt(triesSpan.innerHTML) + 1;
    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);
  }
}
// Shuffle Function
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    // Save Current Element In Stach
    temp = array[current];
    // Current Element = Random Element
    array[current] = array[random];
    // Random Element  = Get Element Form Stach
    array[random] = temp;
  }
  return array;
}
function timerF() {
  let timer = setInterval(() => {
    timerSectionWidth--;
    timerDiv.style.width = `${timerSectionWidth}%`;
    if (timerSectionWidth == "0") {
      clearInterval(timer);
      blocksContainer.classList.add("timecompleted");
      tryAginDiv.classList.add("gametimecompleted");
      timerSection.classList.add("hide");
      // Hide  "blocksContainer"
      blocksContainer.style.display = "none";
      // pause in the background  Sound
      backgroundSound.pause();
      // Get existing users from local storage and parse to an array
      let storedUsers = localStorage.getItem("username");
      if (storedUsers) {
        userDataArray = JSON.parse(storedUsers);
      }
      // Check if the username is already in the array
      let found = false;
      for (let i = 0; i < userDataArray.length; i++) {
        if (userDataArray[i].name === yourName) {
          found = true;
          // If the username is found, update the number of errors
          userDataArray[i].errors = parseInt(triesSpan.innerHTML);
          break;
        }
      }
      // If the username is not found, add it to the array
      if (!found) {
        userDataArray.push({
          name: yourName,
          errors: parseInt(triesSpan.innerHTML),
        });
      }
      // Store the updated array in local storage
      localStorage.setItem("username", JSON.stringify(userDataArray));
      // Looping on userDataArray And  Add User Data To History Div
      for (let i = 0; i < userDataArray.length; i++) {
        let userDataDiv = document.createElement("div");
        let userWrongTries = document.createElement("span");
        let userWrongTriesText = document.createTextNode(
          userDataArray[i].errors
        );
        userWrongTries.appendChild(userWrongTriesText);
        userWrongTries.order = -1;
        userDataDiv.appendChild(userWrongTries);
        let userDataDivText = document.createTextNode(
          `${
            userDataArray[i].name ? userDataArray[i].name : "Unknown"
          }  Wrong tries `
        );
        userDataDiv.appendChild(userDataDivText);
        historyDiv.appendChild(userDataDiv);
      }
      // Clear Local Storage Button
      clearHistoryButton.style.display = "block";
      clearHistoryButton.addEventListener("click", () => {
        localStorage.clear();
        historyDiv.remove();
      });
    }
  }, duration);
}
// Add Event To reload The page On Clcik on "TryAginDiv"
tryAginDiv.addEventListener("click", () => {
  window.location.reload();
});
