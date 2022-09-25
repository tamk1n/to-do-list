// On app load, get all tasks from localStorage
window.onload = loadTasks;

// On form submit add task
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // check if localStorage has any tasks
  // if not then return
  if (localStorage.getItem("tasks") == null) return;

  // Get the tasks from localStorage and convert it to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // Loop through the tasks and add them to the list
  tasks.forEach(task => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
      <input id="inp" type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onblur="editTask(this)" onfocus="getCurrentTask(this)" ${task.x ? 'disabled': ''}><p class="${task.completed ? 'completed' : ''}">${task.priority}</p>
      <i class="fa fa-trash ${task.completed ? 'completed' : ''}" onclick="removeTask(this)"></i><i class="fa fa-pen ${task.completed ? 'completed' : ''}" onclick="toggleEnabled(this)"></i>`;
    list.insertBefore(li, list.children[0]);
    console.log(task.x);
    
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const priority = document.querySelector("form select");
  const list = document.querySelector("ul");
  const x = true;
  // return if task is empty
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // check is task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }

  // add task to local storage
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, priority: priority.value, completed: false, x: true }]));

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
  <input id="inp" type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)" ${x ? 'disabled': ''}><p class="priority">${priority.value}</p>
  <i class="fa fa-trash ${task.completed ? 'completed' : ''}" onclick="removeTask(this)"></i><i id="pen" class="fa fa-pen ${task.completed ? 'completed' : ''}" onclick="toggleEnabled(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
  console.log(x);
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
      console.log(task.completed);
      if(!task.completed){
        event.parentElement.classList.remove("completed");
      }
      
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  let input = event.nextElementSibling;
  let p = input.nextElementSibling;
  let trashcan = p.nextElementSibling;
  let pen = trashcan.nextElementSibling;

  input.classList.toggle("completed");
  p.classList.toggle("completed");
  trashcan.classList.toggle("completed");
  pen.classList.toggle("completed");

  
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}

function toggleEnabled(event){
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value){
      task.x = false;
      console.log(task);
      console.log(task.x);
      console.log(event.parentNode.children[1]);
      event.parentNode.children[1].removeAttribute("disabled");
    }
  })
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // task already exist
  tasks.forEach(task => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currentTask;
      return;
    }
  });
  // update task
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
      task.x = true;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}