const decrementTimer = (timer) => {
  const timerValue = parseInt(timer.textContent);
  if (timerValue === 1) {
    clearInterval(intervalId);
  }
  timer.textContent = timerValue - 1;
};

let intervalId;

const startTimer = () => {
  const timer = document.querySelector(".timer");
  intervalId = setInterval(() => decrementTimer(timer), 1000);
};
