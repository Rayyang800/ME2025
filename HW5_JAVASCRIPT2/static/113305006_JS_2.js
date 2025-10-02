document.addEventListener("DOMContentLoaded", () => {
  const checkboxAll = document.getElementById("checkbox_all");
  const checkboxes = document.querySelectorAll(".item-checkbox");
  const checkoutBtn = document.getElementById("checkout");
  const totalSpan = document.getElementById("total");
  const checkoutResult = document.getElementById("checkout-result");

  // 計算總金額
  function calculateTotal() {
    let total = 0;
    document.querySelectorAll("tbody tr").forEach(row => {
      const checkbox = row.querySelector(".item-checkbox");
      const subtotal = parseInt(row.querySelector(".subtotal").textContent);
      if (checkbox.checked) total += subtotal;
    });
    totalSpan.textContent = total;
  }

  // 更新小計
  function updateSubtotal(row) {
    const price = parseInt(row.querySelector(".price").dataset.price);
    const qty = parseInt(row.querySelector(".quantity").value);
    row.querySelector(".subtotal").textContent = price * qty;
    calculateTotal();
  }

  // 全選/全不選
  checkboxAll.addEventListener("change", () => {
    const checked = checkboxAll.checked;
    checkboxes.forEach(cb => cb.checked = checked);
    calculateTotal();
  });

  // 單個 checkbox 點擊
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const allChecked = [...checkboxes].every(c => c.checked);
      checkboxAll.checked = allChecked;
      calculateTotal();
    });
  });

  // 數量增減按鈕
  document.querySelectorAll("tbody tr").forEach(row => {
    const input = row.querySelector(".quantity");
    const stock = parseInt(input.dataset.stock);

    row.querySelector(".increase").addEventListener("click", () => {
      let qty = parseInt(input.value);
      if (qty < parseInt(input.dataset.stock)) {
        input.value = qty + 1;
        updateSubtotal(row);
      }
    });

    row.querySelector(".decrease").addEventListener("click", () => {
      let qty = parseInt(input.value);
      if (qty > 1) {
        input.value = qty - 1;
        updateSubtotal(row);
      }
    });

    // 輸入框 blur 驗證
    input.addEventListener("blur", () => {
      let qty = parseInt(input.value);
      const stockNow = parseInt(input.dataset.stock);
      if (isNaN(qty) || qty < 1) qty = 1;
      if (qty > stockNow) qty = stockNow;
      input.value = qty;
      updateSubtotal(row);
    });
  });

// 結帳
checkoutBtn.addEventListener("click", () => {
  let total = parseInt(totalSpan.textContent);
  if (total <= 0) return;

  let resultHtml = "<h3>結帳明細</h3><ul>";
  let finalTotal = 0;

  document.querySelectorAll("tbody tr").forEach(row => {
    const checkbox = row.querySelector(".item-checkbox");
    const input = row.querySelector(".quantity");
    let stock = parseInt(input.dataset.stock);
    const name = row.cells[2].textContent;
    const price = parseInt(row.querySelector(".price").dataset.price);
    const qty = parseInt(input.value);

    if (checkbox.checked && qty > 0) {
      const subtotal = price * qty;
      resultHtml += `<li>${name} x ${qty} = $${subtotal}</li>`;
      finalTotal += subtotal;

      // ✅ 更新庫存
      stock -= qty;
      if (stock < 0) stock = 0;
      input.dataset.stock = stock;
      row.querySelector(".stock").textContent = stock;

      // ✅ 更新數量顯示
      if (stock > 0) {
        input.value = 1;
      } else {
        input.value = 0;
      }
      updateSubtotal(row);
    }

    // ✅ 結帳後取消勾選
    checkbox.checked = false;
  });

  resultHtml += `</ul><strong>總金額 = $${finalTotal}</strong>`;
  checkoutResult.innerHTML = resultHtml;
  checkoutResult.style.display = "block";
  checkboxAll.checked = false;
  calculateTotal();
});
});
