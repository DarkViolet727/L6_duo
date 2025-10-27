// todos.js - управление задачами

let allTodos = [];
let localTodos = JSON.parse(localStorage.getItem("localTodos")) || [];

async function renderTodos(root, userId = null) {
  const container = createElement("div", { class: "container" });
  
  const header = createElement("header", {},
    createElement("div", { class: "logo" },
      createElement("div", { class: "logo-icon" }, "T"),
      createElement("div", { class: "logo-title" }, "Todo Manager")
    )
  );

  const card = createElement("div", { class: "card" });
  
  const title = createElement("h2", {}, "📝 Список задач (Todos)");
  const crumbs = renderBreadcrumbs("#users#todos");

  const controls = createElement(
    "div",
    { class: "controls" },
    createElement("input", {
      type: "search",
      placeholder: "Поиск по названию задачи",
      oninput: debounce((e) => searchTodos(e.target.value, root), 300),
    }),
    createElement("button", { class: "btn", onclick: () => loadTodos(root, userId) }, "🔄")
  );

  const list = createElement("div", { class: "list" }, "Загрузка...");

  const addForm = createElement(
    "div",
    { class: "add-user" },
    createElement("input", { id: "newTodo", type: "text", placeholder: "Новая задача" }),
    createElement("button", { class: "btn", onclick: () => addTodo(root, userId) }, "➕ Добавить")
  );

  card.append(crumbs, title, controls, list, addForm);
  container.append(header, card);
  
  root.innerHTML = "";
  root.append(container);

  await loadTodos(root, userId);
  renderTodoList(allTodos, root);
}

async function loadTodos(root, userId = null) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await res.json();
    
    let filteredData = data;
    if (userId) {
      filteredData = data.filter(todo => todo.userId === parseInt(userId));
    }
    
    allTodos = [...filteredData, ...localTodos];
    renderTodoList(allTodos, root);
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
    renderTodoList(allTodos, root);
  }
}

function renderTodoList(todos, root) {
  const list = document.querySelector(".list");
  if (!list) return;
  
  list.innerHTML = "";
  if (!todos.length) {
    list.append(createElement("div", { class: "empty" }, "Нет задач"));
    return;
  }
  
  todos.forEach(todo => {
    const todoElement = createElement(
      "div",
      { class: "todo" },
      createElement("span", { 
        class: todo.completed ? "done" : "",
        onclick: () => toggleTodo(todo.id, root)
      }, todo.title),
      todo.local ? createElement("button", { 
        class: "delete-btn", 
        onclick: (e) => {
          e.stopPropagation();
          deleteTodo(todo.id, root);
        }
      }, "🗑") : null
    );
    list.append(todoElement);
  });
}

function searchTodos(query, root) {
  const q = query.toLowerCase();
  const filtered = allTodos.filter(todo =>
    todo.title.toLowerCase().includes(q)
  );
  renderTodoList(filtered, root);
}

function addTodo(root, userId = null) {
  const title = document.getElementById("newTodo").value.trim();
  if (!title) return alert("Введите название задачи");

  const newTodo = { 
    id: Date.now(), 
    title, 
    completed: false,
    userId: userId ? parseInt(userId) : 1,
    local: true 
  };
  localTodos.push(newTodo);
  localStorage.setItem("localTodos", JSON.stringify(localTodos));
  allTodos.push(newTodo);
  renderTodoList(allTodos, root);
  
  // Очищаем поле
  document.getElementById("newTodo").value = "";
}

function toggleTodo(todoId, root) {
  const todo = allTodos.find(t => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    if (todo.local) {
      const localIndex = localTodos.findIndex(t => t.id === todoId);
      if (localIndex !== -1) {
        localTodos[localIndex].completed = todo.completed;
        localStorage.setItem("localTodos", JSON.stringify(localTodos));
      }
    }
    renderTodoList(allTodos, root);
  }
}

function deleteTodo(todoId, root) {
  localTodos = localTodos.filter(t => t.id !== todoId);
  localStorage.setItem("localTodos", JSON.stringify(localTodos));
  allTodos = allTodos.filter(t => t.id !== todoId);
  renderTodoList(allTodos, root);
}
