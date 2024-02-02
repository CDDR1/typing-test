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
      if (correctLetterIndices.has(index)) {
        return `<span class="correct-key">${char}</span>`;
      } else if (incorrectLetterIndices.has(index)) {
        return `<span class="incorrect-key">${char}</span>`;
      } else {
        return char;
      }
    })
    .join("");

  wordsWrapper.innerHTML = updatedText;
};

const body = document.querySelector("body");
body.addEventListener("keydown", (event) => checkKeydown(event));
