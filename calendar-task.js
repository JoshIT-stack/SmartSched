

let tasksByDate = {};

let savedDates = new Set();



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
        </select>
      </div>
    </div>
    <div class="modal-buttons">
      <button id="saveTaskBtn" class="task-btn">Save</button>
      <button id="cancelModalBtn" class="task-btn cancel-btn">Cancel</button>
    </div>
  </div>
`;


function formatDateToInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


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



  #summaryModal {
  display: none;              /* hidden by default */
  position: fixed;            /* overlay entire viewport */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5); /* semi-transparent backdrop */
  display: flex;              /* use flexbox for centering */
  justify-content: center;    /* horizontal center */
  align-items: center;        /* vertical center */
  z-index: 10000;             /* above dashboard */
}

.summary-modal-content {
  background: var(--card);
  color: var(--text);
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

body.dark .summary-modal-content {
  background: #222;
  color: #eee;
}



`;
document.head.appendChild(style);

function loadParticipantsInto(selectId) {
  fetch("/SmartSched/users")
    .then(response => response.json())
    .then(users => {
      const select = document.getElementById(selectId);
      if (!select) return;
      select.innerHTML = '<option value="" disabled selected>Select a participant</option>';
      users.forEach(u => {
        const opt = document.createElement("option");
        opt.value = u.id;
        opt.textContent =  `${u.firstname} ${u.lastname}`;
        select.appendChild(opt);
      });
    })
    .catch(err => console.error("Error loading users into " + selectId, err));
}


// Call once when page loads
window.addEventListener("DOMContentLoaded", () => {

  loadSavedDates();
  loadParticipantsInto("participants");          // for event modal
  loadParticipantsInto("scheduleParticipants");  // for schedule modal
  loadParticipantsInto("taskParticipants");      // for task modal
});







function loadSavedDates() {
  fetch("/SmartSched/SavedDatesServlet")
    .then(res => res.json())
    .then(dateList => {

      savedDates = new Set();
      dateList.forEach(dateStr => {
        const d = new Date(dateStr);
        const key = formatDateToInputValue(d);
        savedDates.add(key);
      });

      console.log("✅ Converted savedDates:", Array.from(savedDates));
      renderCalendar(); // re-render with highlights
    })
    .catch(err => console.error("Error loading saved dates:", err));
}




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
  // ✅ Show modal
  modal.style.display = "flex";

  // ✅ Cancel button logic (placed immediately after showing modal)
  const cancelBtn = modal.querySelector("#cancelModalBtn");
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

  // ✅ Click outside to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ✅ Save button logic
  document.getElementById("saveTaskBtn").onclick = () => {
    const dateObj = new Date(dateKey);
    const dateStr = formatDateToInputValue(dateObj);

    function toIsoDateTime(dateStr, timeStr) {
      const [time, ampm] = timeStr.split(" ");
      let [hour, minute] = time.split(":").map(Number);
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }

    const startTimeVal = document.getElementById("startTime").value;
    const endTimeVal = document.getElementById("endTime").value;

    const startDateTime = toIsoDateTime(dateStr, startTimeVal);
    const endDateTime = toIsoDateTime(dateStr, endTimeVal);

    console.log("startTime:", startTimeVal);
    console.log("endTime:", endTimeVal);
    console.log("startDateTime:", startDateTime);
    console.log("endDateTime:", endDateTime);

    const eventName = document.getElementById("eventName").value;
    const notes = document.getElementById("eventNotes").value;
    const participantIds = Array.from(selectedParticipants).join(",");

    const data = new URLSearchParams();
    data.append("itemType", "EVENT");
    data.append("eventName", eventName);
    data.append("startDateTime", startDateTime);
    data.append("endDateTime", endDateTime);
    data.append("notes", notes);
    data.append("createdByUserId", "1");
    data.append("participantIds", participantIds);

    fetch("/SmartSched/EventServlet", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data
    })
    .then(response => response.text().then(text => {
      console.log("Server response:", text);
      if (response.ok) {
        alert("✅ Event saved successfully!");
      } else {
        alert("⚠️ Failed to save event.\n" + text);
      }
      modal.style.display = "none"; // close modal after response
    }))
    .catch(err => {
      console.error("Error saving event:", err);
      alert("⚠️ Server error while saving event.");
      modal.style.display = "none";
    });
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
        </select>
      </div>
      <div class="modal-buttons">
        <button id="saveScheduleBtn" class="task-btn">Save</button>
        <button id="cancelScheduleModalBtn" class="task-btn cancel-btn">Cancel</button>
      </div>
    </div>
  `;
document.body.appendChild(scheduleModal);
loadParticipantsInto("scheduleParticipants");

// ✅ Use Date object directly instead of splitting strings
const date = new Date(dateKey);

const scheduleModalDateTitle = document.getElementById("scheduleModalDateTitle");
const options = { year: 'numeric', month: 'long', day: 'numeric' };
scheduleModalDateTitle.textContent = "Create Schedule for " + date.toLocaleDateString('en-US', options);

// ✅ show the modal centered

// ✅ pre-fill start/end date inputs
document.getElementById('startDate').value = formatDateToInputValue(date);
document.getElementById('endDate').value = formatDateToInputValue(date);




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

    const cancelBtn = scheduleModal.querySelector("#cancelScheduleModalBtn");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        scheduleModal.style.display = "none";
        document.body.removeChild(scheduleModal);
      };
    }

    scheduleModal.addEventListener("click", (e) => {
      if (e.target === scheduleModal) {
        scheduleModal.style.display = "none";
        document.body.removeChild(scheduleModal);
      }
    });



document.getElementById("saveScheduleBtn").onclick = () => {
  
  const data = new URLSearchParams();
  data.append("startDate", document.getElementById("startDate").value);
  data.append("endDate", document.getElementById("endDate").value);
  data.append("shiftStart", document.getElementById("shiftStart").value);
  data.append("shiftEnd", document.getElementById("shiftEnd").value);
  Array.from(selectedParticipants).forEach(p => data.append("employees", p));


  fetch("/SmartSched/ScheduleServlet", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: data
})

  
  .then(res => {
    if (res.ok) alert("✔ Schedule saved!");
    else alert("❌ Failed to save schedule");
  })
  .catch(err => console.error("Schedule save error:", err));

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
  loadParticipantsInto("taskParticipants");

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

    #summaryModal {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.summary-modal-content {
  background: white;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}
body.dark .summary-modal-content {
  background: #222;
  color: #eee;
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

      // Cancel button
    const cancelBtn = taskCreatorModal.querySelector("#cancelTaskCreatorModalBtn");
    if (cancelBtn) {
      cancelBtn.onclick = () => {
        taskCreatorModal.style.display = "none";
        document.body.removeChild(taskCreatorModal);
      };
    }

    // Click outside to close
    taskCreatorModal.addEventListener("click", (e) => {
      if (e.target === taskCreatorModal) {
        taskCreatorModal.style.display = "none";
        document.body.removeChild(taskCreatorModal);
      }
    });

document.getElementById("saveTasksBtn").onclick = () => {

  const tasks = [];
  document.querySelectorAll('.task-list-item span')
    .forEach(item => tasks.push(item.textContent));

const data = new URLSearchParams();
data.append("date", formatDateToInputValue(new Date(dateKey)));
data.append("taskTime", document.getElementById("taskTime").value);

tasks.forEach(t => data.append("tasks", t));
Array.from(selectedParticipants).forEach(p => data.append("employees", p));

fetch("/SmartSched/TaskServlet", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: data
})



  .then(res => {
    if (res.ok) alert("✔ Tasks saved!");
    else alert("❌ Failed to save tasks");
  })
  .catch(err => console.error("Task save error:", err));

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

  const cancelBtn = document.getElementById("cancelOptionsModalBtn");
if (cancelBtn) {
  cancelBtn.onclick = () => {
    optionsModal.style.display = "none";
  };
}

optionsModal.addEventListener("click", (e) => {
  if (e.target === optionsModal) {
    optionsModal.style.display = "none";
  }
});


  // ✅ Delay binding until modal is visible and DOM is ready
  setTimeout(() => {
    const scheduleBtn = document.getElementById("createScheduleBtn");
    const taskBtn = document.getElementById("createTaskBtn");
    const eventBtn = document.getElementById("createEventBtn");

    if (scheduleBtn) {
      scheduleBtn.onclick = () => {
        optionsModal.style.display = "none";
        openScheduleModal(dateKey);
      };
    }

    if (taskBtn) {
      taskBtn.onclick = () => {
        optionsModal.style.display = "none";
        openTaskCreatorModal(dateKey);
      };
    }

    if (eventBtn) {
      eventBtn.onclick = () => {
        optionsModal.style.display = "none";
        openTaskModal(dateKey);
      };
    }
  }, 0); // ✅ ensures DOM is ready
}



document.getElementById("cancelModalBtn").onclick = () => {
  modal.style.display = "none";
};

document.getElementById("cancelOptionsModalBtn").onclick = () => {
  optionsModal.style.display = "none";
};








modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

optionsModal.addEventListener("click", (e) => {
    if (e.target === optionsModal) {
        optionsModal.style.display = "none";
    }
}
);
