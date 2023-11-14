const taskInput = document.querySelector("#task-input");
const dateInput = document.querySelector("#date-input");
const addButton = document.querySelector("#add-button");
const editButton = document.querySelector("#edit-button");
const alerting = document.querySelector(".alert");
const table = document.querySelector(".table table tbody");
const deleteAll = document.querySelector("#delete-all");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateID = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 12)
  ).toString();
};

const showAlert = (type, message) => {
  alerting.innerHTML = "";
  const p = document.createElement("p");
  p.classList.add(type);
  p.innerText = message;
  alerting.append(p);
  setTimeout(() => {
    p.style.display = "none";
  }, 1000);
};

const addHandler = () => {
  const taskValue = taskInput.value;
  const dateValue = dateInput.value;
  const todo = {
    id: generateID(),
    task: taskValue,
    date: dateValue,
    completed: false,
  };

  if (taskValue) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();

    taskInput.value = "";
    dateInput.value = "";
    showAlert("success", "todo added successfully");
  } else {
    showAlert("error", "Please enter a todo!");
  }
};

const displayTodos = (data) => {
  const todoList = data ? data : todos;
  table.innerHTML = "";

  if (!todoList.length) {
    table.innerHTML = "<tr><td colspan='4'>no task found!</td></tr>";
  } else {
    todoList.forEach((todo) => {
      table.innerHTML += `
                <tr>
                <td>${todo.task}</td>
                <td>${todo.date || "No Date"}</td>
                <td>${todo.completed ? "completed" : "pending"}</td>
                <td>
                    <button onclick='editHandler("${todo.id}")'>Edit</button>
                    <button onclick="toggleHandler('${todo.id}')">${
        todo.completed ? "undo" : "do"
      }</button>
                    <button onclick="deleteHandler('${
                      todo.id
                    }')">delete</button>
                </td>
        
                </tr>
            `;
    });
  }
};
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("success", "All todos cleared");
  } else {
    showAlert("error", "no todos to clear");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("success", "Todo deleted successfully");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  editButton.style.display = "none";
  addButton.style.display = "inline-block";
  displayTodos();
};

const filterTodos = (event) => {
  const filter = event.target.dataset.filter;
  let filteredTodos = null;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

window.addEventListener("load", displayTodos());
editButton.addEventListener("click", applyEditHandler);
addButton.addEventListener("click", addHandler);
deleteAll.addEventListener("click", deleteAllHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterTodos);
});
