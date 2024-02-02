let intervalId = null;
let currentLetterIndex = 0;
const correctLetterIndices = new Set();
const incorrectLetterIndices = new Set();

const decrementTimer = (timer) => {
  const timerValue = parseInt(timer.textContent);
  if (timerValue === 1) {
    clearInterval(intervalId);
  }
  timer.textContent = timerValue - 1;
};

const startTimer = () => {
  const timer = document.querySelector(".timer");
  intervalId = setInterval(() => decrementTimer(timer), 1000);
};

const checkKeydown = (event) => {
  const key = event.key;
  if (key.match(/[a-z]/i) && intervalId === null) {
    startTimer();
  }

  const wordsWrapper = document.querySelector(".words-wrapper");
  const text = wordsWrapper.innerText;

  if (key === "Backspace") {
    if (intervalId !== null && currentLetterIndex > 0) {
      currentLetterIndex--;
      if (correctLetterIndices.has(currentLetterIndex)) correctLetterIndices.delete(currentLetterIndex);
      if (incorrectLetterIndices.has(currentLetterIndex)) incorrectLetterIndices.delete(currentLetterIndex);
    }
  } else {
    if (key === text[currentLetterIndex]) {
      correctLetterIndices.add(currentLetterIndex);
    } else {
      incorrectLetterIndices.add(currentLetterIndex);
    }
    currentLetterIndex++;
  }

  const updatedText = text
    .split("")
    .map((char, index) => {
      if (index > currentLetterIndex) {
        return char;
      }

      let classList = "";
      if (correctLetterIndices.has(index)) {
        classList += "correct-key";
      }

      if (incorrectLetterIndices.has(index)) {
        classList += "incorrect-key";
      }

      if (index === currentLetterIndex) {
        classList += "current-index-indicator";
      }

      return `<span class="${classList}">${char}</span>`;
    })
    .join("");

  wordsWrapper.innerHTML = updatedText;
};

const body = document.querySelector("body");
body.addEventListener("keydown", (event) => checkKeydown(event));
