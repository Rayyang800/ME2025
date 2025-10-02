let answer = Math.floor(Math.random() * 101); // 0~100 隨機數
let attempts = 0; // 猜測次數
let startTime = null; // 開始時間
let timerInterval = null; // 計時器

function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(() => {
    let elapsed = Math.floor((new Date() - startTime) / 1000);
    document.getElementById("timer").textContent = "計時：" + elapsed + " 秒";
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function checkGuess() {
  let guess = document.getElementById("guessInput").value;
  guess = Number(guess);
  let message = document.getElementById("message");
  attempts++;

  if (attempts === 1 && !startTime) {
    startTimer();
  }

  if (isNaN(guess) || guess < 0 || guess > 100) {
    alert("請輸入 0~100 的整數！");
    return;
  }

  if (guess > answer) {
    alert("太大了！");
  } else if (guess < answer) {
    alert("太小了！");
  } else {
       // 答對
    let elapsed = Math.floor((new Date() - startTime) / 1000);
    message.textContent = "答對了！總共猜了 " + attempts + " 次，耗時 " + elapsed + " 秒。";
    stopTimer();

    // 新增紀錄
    let li = document.createElement("li");
    li.textContent = "次數：" + attempts + "，耗時：" + elapsed + " 秒，時間：" + new Date().toLocaleTimeString();
    document.getElementById("history").appendChild(li);

    // 遊戲重置
    answer = Math.floor(Math.random() * 101);
    attempts = 0;
    startTime = null;
    document.getElementById("timer").textContent = "計時：0 秒";
  }
}
