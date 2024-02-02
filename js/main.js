let intervalId = null;
let currentLetterIndex = 0;
const correctLetterIndices = new Set();
const incorrectLetterIndices = new Set();
const wordsWrapper = document.querySelector(".words-wrapper");
const stats = document.querySelector(".stats");
const timer = document.querySelector(".timer");

const getUpdatedText = () => {
  const text = wordsWrapper.innerText;

  return text
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

      return `<span class=${classList}>${char}</span>`;
    })
    .join("");
};

document.querySelector(".start-again-btn").addEventListener("click", () => {
  wordsWrapper.classList.remove("dont-display");
  stats.classList.add("dont-display");
  timer.textContent = 30;
  currentLetterIndex = 0;
  correctLetterIndices.clear();
  incorrectLetterIndices.clear();
  wordsWrapper.innerHTML = getUpdatedText();
});

const decrementTimer = () => {
  const timerValue = parseInt(timer.textContent);
  if (timerValue === 1) {
    clearInterval(intervalId);
  }

  const newTimerValue = timerValue - 1;
  timer.textContent = newTimerValue;

  if (newTimerValue === 0) {
    wordsWrapper.classList.add("dont-display");
    stats.classList.remove("dont-display");
  }
};

const startTimer = () => {
  intervalId = setInterval(decrementTimer, 1000);
};

const checkKeydown = (event) => {
  const key = event.key;
  if (key.match(/[a-z]/i) && intervalId === null) {
    startTimer();
  }

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

  wordsWrapper.innerHTML = getUpdatedText();
};

const body = document.querySelector("body");
body.addEventListener("keydown", (event) => checkKeydown(event));
