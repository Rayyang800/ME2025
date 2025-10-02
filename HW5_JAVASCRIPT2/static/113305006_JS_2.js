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