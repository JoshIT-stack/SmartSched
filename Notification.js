const modal = document.getElementById("notificationModal");
const btn = document.getElementById("notificationBtn");

btn.onclick = function () {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}
///hehe