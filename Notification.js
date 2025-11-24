const notifications = [
  { sender: "Juan Dela Cruz", role: "Employee", time: "Nov 26, 2025 - 10:00 AM", message: "" },
  { sender: "Maria Santos", role: "Manager", time: "Nov 20, 2025 - 2:30 PM", message: "" },
  { sender: "Carlos Reyes", role: "HR", time: "Nov 19, 2025 - 9:15 AM", message: "" },
  { sender: "", role: "", time: "Nov 19, 2025 - 9:15 AM", message: "Your leave request has been approved." }
];

const popup = document.getElementById("notificationPopup");
const list = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const closePopup = document.getElementById("closePopup");

function showNotifications() {
  popup.classList.remove("hidden");
  renderNotifications("");
}

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

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};const notifications = [
  { sender: "Juan Dela Cruz", role: "Employee", time: "Nov 26, 2025 - 10:00 AM", message: "" },
  { sender: "Maria Santos", role: "Manager", time: "Nov 20, 2025 - 2:30 PM", message: "" },
  { sender: "Carlos Reyes", role: "HR", time: "Nov 19, 2025 - 9:15 AM", message: "" },
  { sender: "", role: "", time: "Nov 19, 2025 - 9:15 AM", message: "Your leave request has been approved." }
];

const popup = document.getElementById("notificationPopup");
const list = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const closePopup = document.getElementById("closePopup");

function showNotifications() {
  popup.classList.remove("hidden");
  renderNotifications("");
}

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

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};const notifications = [
  { sender: "Juan Dela Cruz", role: "Employee", time: "Nov 26, 2025 - 10:00 AM", message: "" },
  { sender: "Maria Santos", role: "Manager", time: "Nov 20, 2025 - 2:30 PM", message: "" },
  { sender: "Carlos Reyes", role: "HR", time: "Nov 19, 2025 - 9:15 AM", message: "" },
  { sender: "", role: "", time: "Nov 19, 2025 - 9:15 AM", message: "Your leave request has been approved." }
];

const popup = document.getElementById("notificationPopup");
const list = document.getElementById("notificationList");
const searchInput = document.getElementById("searchInput");
const closePopup = document.getElementById("closePopup");

function showNotifications() {
  popup.classList.remove("hidden");
  renderNotifications("");
}

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

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};

// Hook sidebar link
document.querySelector('.sidebar-link[href="notification.html"]').onclick = (e) => {
  e.preventDefault();
  showNotifications();
};
  showNotifications();
};
