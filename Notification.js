


let notifications = [];

function showNotifications() {
  popup.classList.remove("hidden");

  fetch("/SmartSched/NotificationServlet")
    .then(res => res.json())
    .then(data => {
      notifications = data;
      renderNotifications("");
    })
    .catch(err => {
      console.error("⚠️ Failed to load notifications:", err);
      list.innerHTML = `<p style="text-align:center;">⚠️ Unable to load notifications</p>`;
    });
}






const popup = document.getElementById("notificationPopup");
const list = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const closePopup = document.getElementById("closePopup");

function renderNotifications(filter) {
  list.innerHTML = "";
  notifications
    .filter(n => n.sender.toLowerCase().includes(filter.toLowerCase()))
    .forEach(n => {
      const item = document.createElement("div");
      item.classList.add("notification-item");
      item.innerHTML = `
        <h4>${n.sender || "System Notification"}</h4>
        <p>${n.role}</p>
        <p>${n.time}</p>
        <p>${n.message}</p>
      `;
      item.onclick = () => {
        alert(`Notification from ${n.sender || "System"}:\n${n.message || "No message."}`);
      };
      list.appendChild(item);
    });
}

searchInput.oninput = () => renderNotifications(searchInput.value);
closePopup.onclick = () => popup.classList.add("hidden");

document.getElementById("notificationsLink").onclick = (e) => {
  e.preventDefault();
  showNotifications();
};
