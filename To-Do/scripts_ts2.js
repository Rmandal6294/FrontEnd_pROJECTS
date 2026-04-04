let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  showCurrentDate();
  renderTasks();
  renderHistory();

  document.getElementById("searchListedTask").addEventListener("input", () => {
    renderTasks();
  });

  document.getElementById("searchHistory").addEventListener("input", () => {
    renderHistory();
  });

  document.querySelector(".TaskContainer .search_find").addEventListener("click", () => renderTasks());
  document.querySelector(".taskHistoryContainer .search_find").addEventListener("click", () => renderHistory());
});

function showCurrentDate() {
  const now = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  document.getElementById("showDate").textContent = now.toLocaleDateString("en-US", options);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function addTask() {
  const titleInput = document.getElementById("taskTitle");
  const datetimeInput = document.getElementById("timeField");

  const title = titleInput.value.trim();
  const datetime = datetimeInput.value;

  if (!title) {
    alert("Please enter a task title.");
    titleInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    title: title,
    datetime: datetime,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  renderHistory();

  titleInput.value = "";
  datetimeInput.value = "";
  titleInput.focus();
}

function formatDatetime(datetimeStr) {
  if (!datetimeStr) return "No date set";
  const d = new Date(datetimeStr);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd} / ${mm} / ${yyyy}  At  ${hh}:${min}`;
}

function renderTasks() {
  const container = document.querySelector(".TaskContainer");
  const query = document.getElementById("searchListedTask").value.toLowerCase();

  container.querySelectorAll(".taskBox").forEach(el => el.remove());

  const filtered = tasks.filter(t =>
    !t.completed && t.title.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "emptyMsg";
    empty.textContent = query ? "No matching tasks found." : "No active tasks. Add one above!";
    container.appendChild(empty);
    return;
  }

  container.querySelectorAll(".emptyMsg").forEach(el => el.remove());

  filtered.forEach(task => {
    const box = document.createElement("div");
    box.className = "taskBox";
    box.dataset.id = task.id;

    box.innerHTML = `
      <div class="first">
        <p class="taskName ${task.completed ? "done" : ""}">${escapeHTML(task.title)}</p>
        <p class="taskDateTime">${formatDatetime(task.datetime)}</p>
      </div>
      <div class="second">
        <button class="markTask" onclick="markTask(${task.id})" title="Toggle Complete">✅</button>
        <button class="editTask" onclick="editTask(${task.id})" title="Edit Task">✒️</button>
        <button class="deleteTask" onclick="deleteTask(${task.id})" title="Delete Task">❌</button>
      </div>
    `;
    container.appendChild(box);
  });
}

function renderHistory() {
  const container = document.querySelector(".taskHistoryContainer");
  const query = document.getElementById("searchHistory").value.toLowerCase();

  container.querySelectorAll(".pastTaskS").forEach(el => el.remove());
  container.querySelectorAll(".emptyMsg").forEach(el => el.remove());

  const filtered = tasks.filter(t =>
    t.title.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className  = "emptyMsg";
    empty.textContent = query ? "No matching history." : "No task history yet.";
    container.appendChild(empty);
    return;
  }

  filtered.forEach(task => {
    const row = document.createElement("div");
    row.className  = "pastTaskS";
    row.dataset.id = task.id;

    row.innerHTML = `
      <p class="task_name ${task.completed ? "done" : ""}">${escapeHTML(task.title)}</p>
      <p class="task_DateTime">${formatDatetime(task.datetime)}</p>
      <p class="task_status">${task.completed ? "✅" : "⭕"}</p>
    `;

    container.appendChild(row);
  });
}

function markTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  renderHistory();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const newTitle = prompt("Edit task title:", task.title);
  if (newTitle === null) return;          
  if (!newTitle.trim()) {
    alert("Task title cannot be empty.");
    return;
  }

  const newDatetime = prompt(
    "Edit date & time (YYYY-MM-DDTHH:MM) or leave blank to keep current:",
    task.datetime || ""
  );

  task.title = newTitle.trim();
  if (newDatetime !== null && newDatetime.trim() !== "") {
    task.datetime = newDatetime.trim();
  }

  saveTasks();
  renderTasks();
  renderHistory();
}

function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  renderHistory();
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
