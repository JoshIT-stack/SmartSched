const isAdmin = true;
let tasksByDate = {};

const calendarGrid = document.getElementById("calendarGrid");

const optionsModal = document.createElement("div");
optionsModal.id = "optionsModal";
optionsModal.innerHTML = `
  <div class="options-modal-content">
    <h3 id="optionsModalDateTitle"></h3>
    <div class="options-modal-buttons">
      <button id="createScheduleBtn" class="options-btn">Create Schedule</button>
      <button id="createTaskBtn" class="options-btn">Create Task</button>
      <button id="createEventBtn" class="options-btn">Create Event</button>
      <button id="cancelOptionsModalBtn" class="options-btn cancel-btn">Cancel</button>
    </div>
  </div>
`;
document.body.appendChild(optionsModal);

const modal = document.createElement("div");
modal.id = "taskModal";
modal.innerHTML = `
  <div class="task-modal-content">
    <h3 id="modalDateTitle"></h3>
    <div id="taskDetails">
      <div class="time-selection">
        <label for="startTime">Start Time:</label>
        <select id="startTime" class="time-select"></select>
      </div>
      <div class="time-selection">
        <label for="endTime">End Time:</label>
        <select id="endTime" class="time-select"></select>
      </div>
      <div class="event-name">
        <label for="eventName">Event Name:</label>
        <input type="text" id="eventName" placeholder="Enter event name">
      </div>
      <div class="notes">
        <textarea id="eventNotes" placeholder="Enter notes..."></textarea>
      </div>
      <div class="participants">
        <label for="participants">Participants:</label>
        <div id="participantsContainer" class="pills-container"></div>
        <select id="participants">
          <option value="" disabled selected>Select a participant</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>
    </div>
    <div class="modal-buttons">
      <button id="saveTaskBtn" class="task-btn">Save</button>
      <button id="cancelModalBtn" class="task-btn cancel-btn">Cancel</button>
    </div>
  </div>
`;
document.body.appendChild(modal);

const style = document.createElement("style");
style.textContent = `
  #taskModal, #optionsModal {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  #modalDateTitle, #optionsModalDateTitle {
    margin-bottom: 25px;
    text-align: center;
  }

  .task-modal-content, .options-modal-content {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .options-modal-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .options-btn {
    background: #4267b2;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
  }


  body.dark .task-modal-content, body.dark .options-modal-content {
    background: #222;
    color: #eee;
  }

  .time-selection, .event-name, .notes, .participants {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input[type="text"], textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: white;
    color: #333;
  }
  
  body.dark input, body.dark textarea, body.dark select {
    background: #333;
    border-color: #555;
    color: #eee;
  }

  textarea {
    height: 80px;
    resize: vertical;
  }

  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }

  .task-btn {
    background: #4267b2;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    margin-left: 10px;
  }

  .cancel-btn {
    background: #999;
  }

  .pills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
  }

  .participant-pill {
    background: #e0e0e0;
    color: #333;
    border-radius: 15px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    font-size: 0.9em;
  }

  body.dark .participant-pill {
    background: #555;
    color: #eee;
  }

  .remove-pill-btn {
    background: none;
    border: none;
    color: #999;
    margin-left: 8px;
    cursor: pointer;
    font-weight: bold;
  }

  body.dark .task-btn {
    background: #5b8dfc;
  }
  
  body.dark .options-btn {
    background: #5b8dfc;
  }

  body.dark .cancel-btn {
    background: #666;
  }
`;
document.head.appendChild(style);

function openTaskModal(dateKey) {
  const modalDateTitle = document.getElementById("modalDateTitle");
  
  const date = new Date(dateKey);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  modalDateTitle.textContent = date.toLocaleDateString('en-US', options);

  function populateTimeDropdowns() {
    const timeSelectors = ['startTime', 'endTime'];
    
    timeSelectors.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.innerHTML = '';
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            
            const time_hour = `${hour}:00 ${ampm}`;
            let option = document.createElement('option');
            option.value = time_hour;
            option.textContent = time_hour;
            select.appendChild(option);

            const time_half = `${hour}:30 ${ampm}`;
            option = document.createElement('option');
            option.value = time_half;
            option.textContent = time_half;
            select.appendChild(option);
        }
    });
  }

  populateTimeDropdowns();

  const participantsSelect = document.getElementById("participants");
  const participantsContainer = document.getElementById("participantsContainer");

  const selectedParticipants = new Set();

  function addParticipantPill(value, text) {
    if (selectedParticipants.has(value)) return;

    selectedParticipants.add(value);

    const pill = document.createElement("div");
    pill.className = "participant-pill";
    pill.dataset.value = value;
    pill.innerHTML = `
      <span>${text}</span>
      <button class="remove-pill-btn">x</button>
    `;

    pill.querySelector(".remove-pill-btn").addEventListener("click", () => {
      selectedParticipants.delete(value);
      pill.remove();
      participantsSelect.querySelector(`option[value="${value}"]`).style.display = "block";
    });

    participantsContainer.appendChild(pill);
    participantsSelect.querySelector(`option[value="${value}"]`).style.display = "none";
    participantsSelect.value = "";
  }
  
  participantsSelect.addEventListener('change', () => {
      const selectedOption = participantsSelect.options[participantsSelect.selectedIndex];
      if (selectedOption.value) {
        addParticipantPill(selectedOption.value, selectedOption.text);
      }
  });


  const task = tasksByDate[dateKey];
  if (task) {
    document.getElementById("startTime").value = task.startTime;
    document.getElementById("endTime").value = task.endTime;
    document.getElementById("eventName").value = task.eventName;
    document.getElementById("eventNotes").value = task.notes;
    
    // Clear previous pills and restore options
    participantsContainer.innerHTML = '';
    participantsSelect.querySelectorAll('option').forEach(opt => opt.style.display = 'block');
    selectedParticipants.clear();

    if (task.participants) {
        task.participants.forEach(p => {
            const option = participantsSelect.querySelector(`option[value="${p}"]`);
            if(option) addParticipantPill(p, option.text);
        });
    }

  }

  modal.style.display = "flex";

  document.getElementById("saveTaskBtn").onclick = () => {
    const newTask = {
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      eventName: document.getElementById("eventName").value,
      notes: document.getElementById("eventNotes").value,
      participants: Array.from(selectedParticipants),
    };
    tasksByDate[dateKey] = newTask;
    modal.style.display = "none";
  };
}

function openScheduleModal(dateKey) {
  const scheduleModal = document.createElement("div");
  scheduleModal.id = "scheduleModal";
  scheduleModal.innerHTML = `
    <div class="schedule-modal-content">
      <h3 id="scheduleModalDateTitle"></h3>
      <div class="date-range">
        <label for="startDate">Start Date:</label>
        <input type="date" id="startDate">
        <label for="endDate">End Date:</label>
        <input type="date" id="endDate">
      </div>
      <div class="time-selection">
        <label for="shiftStart">Start of shift:</label>
        <select id="shiftStart" class="time-select"></select>
      </div>
      <div class="time-selection">
        <label for="shiftEnd">End of shift:</label>
        <select id="shiftEnd" class="time-select"></select>
      </div>
      <div class="participants">
        <label for="scheduleParticipants">Employees:</label>
        <div id="scheduleParticipantsContainer" class="pills-container"></div>
        <select id="scheduleParticipants">
          <option value="" disabled selected>Select an employee</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>
      <div class="modal-buttons">
        <button id="saveScheduleBtn" class="task-btn">Save</button>
        <button id="cancelScheduleModalBtn" class="task-btn cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(scheduleModal);

  const scheduleStyle = document.createElement("style");
  scheduleStyle.textContent = `
    #scheduleModal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }
    .schedule-modal-content {
      background: white;
      color: #333;
      padding: 20px;
      border-radius: 10px;
      width: 450px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    body.dark .schedule-modal-content {
        background: #222;
        color: #eee;
    }
    #scheduleModalDateTitle {
      margin-bottom: 20px;
      text-align: center;
    }
    .date-range {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .date-range label {
      margin-right: 5px;
    }
    .date-range input[type="date"] {
        width: 45%;
    }
  `;
  document.head.appendChild(scheduleStyle);
  
  const scheduleModalDateTitle = document.getElementById("scheduleModalDateTitle");
  const date = new Date(dateKey);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  scheduleModalDateTitle.textContent = "Create Schedule for " + date.toLocaleDateString('en-US', options);

  document.getElementById('startDate').valueAsDate = date;
  document.getElementById('endDate').valueAsDate = date;


  function populateScheduleTimeDropdowns() {
    const timeSelectors = ['shiftStart', 'shiftEnd'];
    
    timeSelectors.forEach(id => {
        const select = document.getElementById(id);
        if (!select) return;
        select.innerHTML = '';
        for (let i = 0; i < 24; i++) {
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? 'AM' : 'PM';
            
            const time_hour = `${hour}:00 ${ampm}`;
            let option = document.createElement('option');
            option.value = time_hour;
            option.textContent = time_hour;
            select.appendChild(option);
        }
    });
  }

  populateScheduleTimeDropdowns();

  const participantsSelect = document.getElementById("scheduleParticipants");
  const participantsContainer = document.getElementById("scheduleParticipantsContainer");
  const selectedParticipants = new Set();

  function addParticipantPill(value, text) {
    if (selectedParticipants.has(value)) return;

    selectedParticipants.add(value);

    const pill = document.createElement("div");
    pill.className = "participant-pill";
    pill.dataset.value = value;
    pill.innerHTML = `
      <span>${text}</span>
      <button class="remove-pill-btn">x</button>
    `;

    pill.querySelector(".remove-pill-btn").addEventListener("click", () => {
      selectedParticipants.delete(value);
      pill.remove();
      participantsSelect.querySelector(`option[value="${value}"]`).style.display = "block";
    });

    participantsContainer.appendChild(pill);
    participantsSelect.querySelector(`option[value="${value}"]`).style.display = "none";
    participantsSelect.value = "";
  }
  
  participantsSelect.addEventListener('change', () => {
      const selectedOption = participantsSelect.options[participantsSelect.selectedIndex];
      if (selectedOption.value) {
        addParticipantPill(selectedOption.value, selectedOption.text);
      }
  });

  scheduleModal.style.display = "flex";

  document.getElementById("saveScheduleBtn").onclick = () => {
    // Logic to save schedule will be added here
    console.log(Array.from(selectedParticipants));
    scheduleModal.style.display = "none";
    document.body.removeChild(scheduleModal);
  };

  document.getElementById("cancelScheduleModalBtn").onclick = () => {
    scheduleModal.style.display = "none";
    document.body.removeChild(scheduleModal);
  };
  
  scheduleModal.addEventListener("click", (e) => {
    if (e.target === scheduleModal) {
      scheduleModal.style.display = "none";
      document.body.removeChild(scheduleModal);
    }
  });
}

function openTaskCreatorModal(dateKey) {
  const taskCreatorModal = document.createElement("div");
  taskCreatorModal.id = "taskCreatorModal";
  taskCreatorModal.innerHTML = `
    <div class="task-creator-modal-content">
      <h3 id="taskCreatorModalDateTitle"></h3>
      <div class="participants">
        <label for="taskParticipants">Scheduled Employees:</label>
        <div id="taskParticipantsContainer" class="pills-container"></div>
        <select id="taskParticipants">
          <option value="" disabled selected>Select an employee</option>
          <option value="user1">User 1</option>
          <option value="user2">User 2</option>
          <option value="user3">User 3</option>
        </select>
      </div>
      <div class="time-selection">
        <label for="taskTime">Time for task:</label>
        <select id="taskTime" class="time-select"></select>
      </div>
      <div id="taskListContainer"></div>
      <div class="task-input">
          <label for="taskInput">New Task:</label>
          <input type="text" id="taskInput" placeholder="Enter a task">
      </div>
      <button id="addTaskBtn" class="task-btn">Add Task</button>
      <div class="modal-buttons">
        <button id="saveTasksBtn" class="task-btn">Done</button>
        <button id="cancelTaskCreatorModalBtn" class="task-btn cancel-btn">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(taskCreatorModal);

  const taskCreatorStyle = document.createElement("style");
  taskCreatorStyle.textContent = `
    #taskCreatorModal {
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }
    .task-creator-modal-content {
      background: white;
      color: #333;
      padding: 20px;
      border-radius: 10px;
      width: 450px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    body.dark .task-creator-modal-content {
        background: #222;
        color: #eee;
    }
    #taskCreatorModalDateTitle {
      margin-bottom: 20px;
      text-align: center;
    }
    #addTaskBtn {
        margin: 10px 0;
    }
    .task-input {
        margin-bottom: 10px;
    }
    #taskListContainer {
        margin-bottom: 15px;
    }
    .task-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f0f0f0;
        padding: 5px 10px;
        border-radius: 5px;
        margin-bottom: 5px;
    }
    body.dark .task-list-item {
        background: #333;
    }
    .remove-task-btn {
        background: #ff4d4d;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        cursor: pointer;
        line-height: 20px;
        text-align: center;
    }
  `;
  document.head.appendChild(taskCreatorStyle);
  
  const taskCreatorModalDateTitle = document.getElementById("taskCreatorModalDateTitle");
  const date = new Date(dateKey);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  taskCreatorModalDateTitle.textContent = "Create Task for " + date.toLocaleDateString('en-US', options);

  function populateTaskTimeDropdown() {
    const select = document.getElementById('taskTime');
    if (!select) return;
    select.innerHTML = '';
    for (let i = 0; i < 24; i++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const ampm = i < 12 ? 'AM' : 'PM';
        
        const time_hour = `${hour}:00 ${ampm}`;
        let option = document.createElement('option');
        option.value = time_hour;
        option.textContent = time_hour;
        select.appendChild(option);
    }
  }
  
  populateTaskTimeDropdown();

  const participantsSelect = document.getElementById("taskParticipants");
  const participantsContainer = document.getElementById("taskParticipantsContainer");
  const selectedParticipants = new Set();

  function addParticipantPill(value, text) {
    if (selectedParticipants.has(value)) return;

    selectedParticipants.add(value);

    const pill = document.createElement("div");
    pill.className = "participant-pill";
    pill.dataset.value = value;
    pill.innerHTML = `
      <span>${text}</span>
      <button class="remove-pill-btn">x</button>
    `;

    pill.querySelector(".remove-pill-btn").addEventListener("click", () => {
      selectedParticipants.delete(value);
      pill.remove();
      participantsSelect.querySelector(`option[value="${value}"]`).style.display = "block";
    });

    participantsContainer.appendChild(pill);
    participantsSelect.querySelector(`option[value="${value}"]`).style.display = "none";
    participantsSelect.value = "";
  }
  
  participantsSelect.addEventListener('change', () => {
      const selectedOption = participantsSelect.options[participantsSelect.selectedIndex];
      if (selectedOption.value) {
        addParticipantPill(selectedOption.value, selectedOption.text);
      }
  });

  document.getElementById("addTaskBtn").onclick = () => {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskListContainer = document.getElementById("taskListContainer");
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-list-item");
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <button class="remove-task-btn">x</button>
        `;
        taskItem.querySelector('.remove-task-btn').onclick = () => {
            taskItem.remove();
        };
        taskListContainer.appendChild(taskItem);
        taskInput.value = "";
    }
  };

  taskCreatorModal.style.display = "flex";

  document.getElementById("saveTasksBtn").onclick = () => {
    const tasks = [];
    document.querySelectorAll('.task-list-item span').forEach(item => {
        tasks.push(item.textContent);
    });
    // Logic to save tasks will be added here
    console.log(tasks); // For debugging
    console.log(Array.from(selectedParticipants));
    taskCreatorModal.style.display = "none";
    document.body.removeChild(taskCreatorModal);
  };

  document.getElementById("cancelTaskCreatorModalBtn").onclick = () => {
    taskCreatorModal.style.display = "none";
    document.body.removeChild(taskCreatorModal);
  };
  
  taskCreatorModal.addEventListener("click", (e) => {
    if (e.target === taskCreatorModal) {
      taskCreatorModal.style.display = "none";
      document.body.removeChild(taskCreatorModal);
    }
  });
}

function openOptionsModal(dateKey) {
    const optionsModalDateTitle = document.getElementById("optionsModalDateTitle");
    const date = new Date(dateKey);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    optionsModalDateTitle.textContent = date.toLocaleDateString('en-US', options);
    
    optionsModal.style.display = "flex";

    document.getElementById("createScheduleBtn").onclick = () => {
        optionsModal.style.display = "none";
        openScheduleModal(dateKey);
    };

    document.getElementById("createTaskBtn").onclick = () => {
        optionsModal.style.display = "none";
        openTaskCreatorModal(dateKey);
    };

    document.getElementById("createEventBtn").onclick = () => {
        optionsModal.style.display = "none";
        openTaskModal(dateKey);
    };
}


document.getElementById("cancelModalBtn").onclick = () => {
  modal.style.display = "none";
};

document.getElementById("cancelOptionsModalBtn").onclick = () => {
  optionsModal.style.display = "none";
};

calendarGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("day")) {
    const selectedDay = e.target.textContent;
    const currentMonthYear = document.getElementById("monthYear").textContent;
    const dateKey = `${currentMonthYear.split(" ")[0]} ${selectedDay}, ${currentMonthYear.split(" ")[1]}`;
    openOptionsModal(dateKey);
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

optionsModal.addEventListener("click", (e) => {
    if (e.target === optionsModal) {
        optionsModal.style.display = "none";
    }
});
