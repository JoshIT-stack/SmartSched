const isAdmin = true;
let tasksByDate = {};

const calendarGrid = document.getElementById("calendarGrid");

const modal = document.createElement("div");
modal.id = "taskModal";
modal.innerHTML = `
  <div class="task-modal-content">
    <h3 id="modalDateTitle">Tasks for </h3>
    <div id="taskList" style="margin-top: 10px;"></div>
    ${
      isAdmin
        ? `
      <div id="taskInputContainer" style="margin-top:15px;">
        <input type="text" id="newTaskInput" placeholder="Enter new task" class="task-input">
        <button id="addTaskBtn" class="task-btn">Add Task</button>
      </div>
      `
        : ""
    }
    <button id="closeModalBtn" class="close-btn">Close</button>
  </div>
`;
document.body.appendChild(modal);

const style = document.createElement("style");
style.textContent = `
  #taskModal {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .task-modal-content {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    width: 350px;
    max-height: 80vh;
    overflow-y: auto;
  }

  body.dark .task-modal-content {
    background: #222;
    color: #eee;
  }

  .task-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    color: #333;
  }

  body.dark .task-input {
    background: #333;
    border-color: #555;
    color: #eee;
  }

  .task-btn {
    margin-top: 10px;
    background: #4267b2;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
  }

  .close-btn {
    margin-top: 15px;
    background: #999;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
  }

  body.dark .task-btn {
    background: #5b8dfc;
  }

  body.dark .close-btn {
    background: #666;
  }
`;
document.head.appendChild(style);

function openTaskModal(dateKey) {
  const modalDateTitle = document.getElementById("modalDateTitle");
  const taskList = document.getElementById("taskList");
  modalDateTitle.textContent = `Tasks for ${dateKey}`;
  taskList.innerHTML = "";
  const tasks = tasksByDate[dateKey] || [];
  if (tasks.length === 0) {
    taskList.innerHTML = `<p style="font-style:italic;">No tasks yet.</p>`;
  } else {
    tasks.forEach(task => {
      const p = document.createElement("p");
      p.textContent = "• " + task;
      taskList.appendChild(p);
    });
  }
  modal.style.display = "flex";
  if (isAdmin) {
    document.getElementById("addTaskBtn").onclick = () => {
      const input = document.getElementById("newTaskInput");
      const newTask = input.value.trim();
      if (newTask !== "") {
        if (!tasksByDate[dateKey]) tasksByDate[dateKey] = [];
        tasksByDate[dateKey].push(newTask);
        input.value = "";
        openTaskModal(dateKey);
      }
    };
  }
}

document.getElementById("closeModalBtn").onclick = () => {
  modal.style.display = "none";
};

calendarGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("day")) {
    const selectedDay = e.target.textContent;
    const currentMonthYear = document.getElementById("monthYear").textContent;
    const dateKey = `${currentMonthYear} - ${selectedDay}`;
    openTaskModal(dateKey);
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
