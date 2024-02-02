let intervalId = null;
let currentCharIndex = 0;
let wrongEnteredChars = 0;
const correctLetterIndices = new Set();
const incorrectLetterIndices = new Set();
const wordsWrapper = document.querySelector(".words-wrapper");
const stats = document.querySelector(".stats");
const timer = document.querySelector(".timer");
const API_URL = "https://random-word-api.herokuapp.com/word?number=150";

const loadingSpinner = `
<div class="loading-spinner dont-displa">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>`;

const getRandomWords = async () => {
  const response = await fetch(API_URL);
  const words = await response.json();
  return words;
};

const populateRandomWordsInHTML = async () => {
  const words = await getRandomWords();
  const formattedWords = words
    .map((word, index) => (index === 0 ? `<span class="current-index-indicator">${word.charAt(0)}</span>${word.slice(1)}` : word))
    .join(" ");
  wordsWrapper.innerHTML = formattedWords;
};

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
  intervalId = null;
  wordsWrapper.classList.remove("dont-display");
  stats.classList.add("dont-display");
  timer.textContent = 30;
  currentCharIndex = 0;
  correctLetterIndices.clear();
  incorrectLetterIndices.clear();
  wordsWrapper.innerHTML = loadingSpinner;
  wrongEnteredChars = 0;
  timer.classList.remove("dont-display");
  populateRandomWordsInHTML();
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
    timer.classList.add("dont-display");
    stats.classList.remove("dont-display");

    // Calculate Words Per Minute
    const words = wordsWrapper.textContent;
    let correctlyTypedWords = 0;
    let isCorrectlyTypedWord = true;

    for (let i = 0; i < words.length; i++) {
      if (i === currentCharIndex) {
        break;
      }
      if (words[i] === " ") {
        if (isCorrectlyTypedWord) {
          correctlyTypedWords++;
        } else {
          isCorrectlyTypedWord = true;
        }
      }
      if (incorrectLetterIndices.has(i)) {
        isCorrectlyTypedWord = false;
      }
    }

    wordsWrapper.innerHTML = "";

    const wpm = (correctlyTypedWords / 30) * 60;
    document.querySelector(".words-per-minute").innerHTML = `<h3 class="stat-title">WPM</h3><span class="stat-description">${parseInt(wpm)}</span>`;

    // Calculate accuracy
    const correctlyEnteredCharacters = currentCharIndex - wrongEnteredChars;
    const accuracyPercentage = (correctlyEnteredCharacters * 100) / currentCharIndex;
    document.querySelector(".accuracy").innerHTML = `<h3 class="stat-title">Accuracy</h3><span class="stat-description">${parseInt(
      accuracyPercentage
    )}%</span>`;

    // Time used
    document.querySelector(".time").innerHTML = `<h3 class="stat-title">Time Elapsed</h3><span class="stat-description">30s</span>`;

    // Total characters typed
    const totalCharactersTyped = currentCharIndex;
    document.querySelector(
      ".total-characters-typed"
    ).innerHTML = `<h3 class="stat-title">Total Characters Typed</h3><span class="stat-description"><span class="stat-description">${totalCharactersTyped}</span>`;
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

  if (key === " ") {
    event.preventDefault();
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
populateRandomWordsInHTML();
