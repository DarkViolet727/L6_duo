let allUsers = [];
let localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];

async function renderUsers(root) {
  const container = createElement("div", { class: "container" });
  
  const header = createElement("header", {},
    createElement("div", { class: "logo" },
      createElement("div", { class: "logo-icon" }, "U"),
      createElement("div", { class: "logo-title" }, "User Manager")
    )
  );

  const card = createElement("div", { class: "card" });
  
  const title = createElement("h2", {}, "👥 Список пользователей");
  const crumbs = renderBreadcrumbs("#users");

  const controls = createElement(
    "div",
    { class: "controls" },
    createElement("input", {
      type: "search",
      placeholder: "Поиск по имени или email",
      oninput: debounce((e) => searchUsers(e.target.value, root), 300),
    }),
    createElement("button", { class: "btn", onclick: () => loadUsers(root) }, "🔄")
  );

  const list = createElement("div", { class: "list" }, "Загрузка...");

  const addForm = createElement(
    "div",
    { class: "add-user" },
    createElement("input", { id: "newName", type: "text", placeholder: "Имя" }),
    createElement("input", { id: "newEmail", type: "text", placeholder: "Email" }),
    createElement("button", { class: "btn", onclick: () => addUser(root) }, "➕ Добавить")
  );

  card.append(crumbs, title, controls, list, addForm);
  container.append(header, card);
  
  root.innerHTML = "";
  root.append(container);

  await loadUsers(root);
  renderUserList(allUsers, root);
}

async function loadUsers(root) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await res.json();
    allUsers = [...data, ...localUsers];
    renderUserList(allUsers, root);
  } catch (error) {
    console.error("Ошибка загрузки пользователей:", error);
    renderUserList(allUsers, root);
  }
}

function renderUserList(users, root) {
  const list = document.querySelector(".list");
  if (!list) return;
  
  list.innerHTML = "";
  if (!users.length) {
    list.append(createElement("div", { class: "empty" }, "Нет данных"));
    return;
  }
  
  users.forEach(user => {
    const card = createElement(
      "div",
      { class: "user", onclick: () => navigateToUser(user.id) },
      createElement("div", { class: "avatar" }, user.name[0].toUpperCase()),
      createElement("div", { class: "meta" },
        createElement("div", { class: "name" }, user.name),
        createElement("div", { class: "email" }, user.email)
      ),
      user.local
        ? createElement("button", { 
            class: "delete-btn", 
            onclick: (e) => {
              e.stopPropagation();
              deleteUser(user.email, root);
            }
          }, "🗑")
        : createElement("div", { class: "actions" },
            createElement("button", { 
              class: "btn", 
              onclick: (e) => {
                e.stopPropagation();
                location.hash = `#users#todos#${user.id}`;
              }
            }, "📝 Todos"),
            createElement("button", { 
              class: "btn", 
              onclick: (e) => {
                e.stopPropagation();
                location.hash = `#users#posts#${user.id}`;
              }
            }, "📄 Posts")
          )
    );
    list.append(card);
  });
}

function searchUsers(query, root) {
  const q = query.toLowerCase();
  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  );
  renderUserList(filtered, root);
}

function addUser(root) {
  const name = document.getElementById("newName").value.trim();
  const email = document.getElementById("newEmail").value.trim();
  if (!name || !email) return alert("Введите имя и email");

  const newUser = { 
    id: Date.now(), 
    name, 
    email, 
    local: true 
  };
  localUsers.push(newUser);
  localStorage.setItem("localUsers", JSON.stringify(localUsers));
  allUsers.push(newUser);
  renderUserList(allUsers, root);

  document.getElementById("newName").value = "";
  document.getElementById("newEmail").value = "";
}

function deleteUser(email, root) {
  localUsers = localUsers.filter(u => u.email !== email);
  localStorage.setItem("localUsers", JSON.stringify(localUsers));
  allUsers = allUsers.filter(u => u.email !== email);
  renderUserList(allUsers, root);
}

function navigateToUser(userId) {
  console.log("Переход к пользователю:", userId);
}
