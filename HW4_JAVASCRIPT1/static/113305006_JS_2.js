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