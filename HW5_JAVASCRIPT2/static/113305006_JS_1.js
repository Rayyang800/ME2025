let answer = Math.floor(Math.random() * 101); // 0~100 隨機數
let attempts = 0; // 猜測次數

function checkGuess() {
  let guess = document.getElementById("guessInput").value;
  guess = Number(guess);
  attempts++;

  if (isNaN(guess) || guess < 0 || guess > 100) {
    alert("請輸入 0~100 的整數！");
    return;
  }

  if (guess > answer) {
    alert("太大了！");
  } else if (guess < answer) {
    alert("太小了！");
  } else {
    alert("答對了！你總共猜了 " + attempts + " 次。\n遊戲重新開始！");
    // 重新生成答案與計數
    answer = Math.floor(Math.random() * 101);
    attempts = 0;
  }
}
