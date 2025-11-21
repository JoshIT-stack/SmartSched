const isAdmin = true;
let tasksByDate = {};

const calendarGrid = document.getElementById("calendarGrid");

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

  #modalDateTitle {
    margin-bottom: 25px;
  }

  .task-modal-content {
    background: white;
    color: #333;
    padding: 20px;
    border-radius: 10px;
    width: 400px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  body.dark .task-modal-content {
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

  body.dark .task-btn {
    background: #5b8dfc;
  }

  body.dark .cancel-btn {
    background: #666;
  }
`;
document.head.appendChild(style);

function populateTimeDropdowns() {
    const timeSelectors = ['startTime', 'endTime'];
    
    timeSelectors.forEach(id => {
        const select = document.getElementById(id);
        
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

function openTaskModal(dateKey) {
  const modalDateTitle = document.getElementById("modalDateTitle");
  
  const date = new Date(dateKey);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  modalDateTitle.textContent = date.toLocaleDateString('en-US', options);

  const task = tasksByDate[dateKey];
  if (task) {
    document.getElementById("startTime").value = task.startTime;
    document.getElementById("endTime").value = task.endTime;
    document.getElementById("eventName").value = task.eventName;
    document.getElementById("eventNotes").value = task.notes;
    document.getElementById("participants").value = task.participants;
  }

  modal.style.display = "flex";

  document.getElementById("saveTaskBtn").onclick = () => {
    const newTask = {
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      eventName: document.getElementById("eventName").value,
      notes: document.getElementById("eventNotes").value,
      participants: document.getElementById("participants").value,
    };
    tasksByDate[dateKey] = newTask;
    modal.style.display = "none";
  };
}

document.getElementById("cancelModalBtn").onclick = () => {
  modal.style.display = "none";
};

calendarGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("day")) {
    const selectedDay = e.target.textContent;
    const currentMonthYear = document.getElementById("monthYear").textContent;
    const dateKey = `${currentMonthYear.split(" ")[0]} ${selectedDay}, ${currentMonthYear.split(" ")[1]}`;
    openTaskModal(dateKey);
  }
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

populateTimeDropdowns();
///hehe
