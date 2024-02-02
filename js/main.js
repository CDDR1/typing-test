let intervalId = null;
let currentCharIndex = 0;
let wrongEnteredChars = 0;
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
      if (index > currentCharIndex) {
        return char;
      }

      let classList = "";
      if (correctLetterIndices.has(index)) {
        classList += "correct-key";
      }

      if (incorrectLetterIndices.has(index)) {
        classList += "incorrect-key";
      }

      if (index === currentCharIndex) {
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
  currentCharIndex = 0;
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

    // Calculate accuracy
    const correctlyEnteredCharacters = currentCharIndex - wrongEnteredChars;
    const accuracyPercentage = (correctlyEnteredCharacters * 100) / currentCharIndex;
    document.querySelector('.accuracy').textContent = `Accuracy: ${parseInt(accuracyPercentage)}%`
  }
};

const startTimer = () => {
  intervalId = setInterval(decrementTimer, 1000);
};

const checkKeydown = (event) => {
  const key = event.key;
  if (intervalId === null) {
    startTimer();
  }

  const text = wordsWrapper.innerText;

  if (key === "Backspace") {
    if (intervalId !== null && currentCharIndex > 0) {
      currentCharIndex--;
      if (correctLetterIndices.has(currentCharIndex)) correctLetterIndices.delete(currentCharIndex);
      if (incorrectLetterIndices.has(currentCharIndex)) incorrectLetterIndices.delete(currentCharIndex);
    }
  } else {
    if (key === text[currentCharIndex]) {
      correctLetterIndices.add(currentCharIndex);
    } else {
      incorrectLetterIndices.add(currentCharIndex);
      wrongEnteredChars++;
    }
    currentCharIndex++;
  }

  wordsWrapper.innerHTML = getUpdatedText();
};

const body = document.querySelector("body");
body.addEventListener("keydown", (event) => checkKeydown(event));
