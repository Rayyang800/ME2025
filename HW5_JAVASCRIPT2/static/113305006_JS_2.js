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
      if (qty < stock) {
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