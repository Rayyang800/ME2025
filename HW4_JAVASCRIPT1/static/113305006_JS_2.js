// 建立輸入框
document.write('<input type="text" id="display" readonly><br><br>');

// 數字按鈕 (0~9，用迴圈)
for (let i = 0; i <= 9; i++) {
  document.write('<button onclick="addChar(' + i + ')">' + i + '</button>');
  if (i % 3 === 2) document.write('<br>'); // 每三個數字換行
}

// 運算符號按鈕 (+ - * /)
let operators = ["+", "-", "*", "/"];
for (let op of operators) {
  document.write('<button onclick="addChar(\'' + op + '\')">' + op + '</button>');
}
document.write('<br>');

// = 按鈕 與 Clear 按鈕
document.write('<button onclick="calculate()">=</button>');
document.write('<button onclick="clearDisplay()">Clear</button>');

function addChar(c) {
  document.getElementById("display").value += c;
}

function calculate() {
  let expr = document.getElementById("display").value;
  if (expr === "") return;
  try {
    let result = eval(expr);
    alert(expr + " = " + result);
    document.getElementById("display").value = result; // 更新輸入框為答案
  } catch (e) {
    alert("算式錯誤，請重新輸入！");
  }
}

function clearDisplay() {
  document.getElementById("display").value = "";
}
