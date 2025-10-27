function createElement(tag, props = {}, ...children) {
  const el = document.createElement(tag);

  for (const key in props) {
    if (key.startsWith("on") && typeof props[key] === "function") {
      el.addEventListener(key.substring(2).toLowerCase(), props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }

  children.flat().forEach(child => {
    if (typeof child === "string") el.appendChild(document.createTextNode(child));
    else if (child instanceof Node) el.appendChild(child);
  });

  return el;
}

const root = document.getElementById("root");

let allUsers = [];
let localUsers = JSON.parse(localStorage.getItem("localUsers")) || [];

function UserCard(user) {
  return createElement(
    "div",
    { class: "user" },
    createElement("div", { class: "avatar" }, user.name[0].toUpperCase()),
    createElement(
      "div",
      { class: "meta" },
      createElement("div", { class: "name" }, user.name),
      createElement("div", { class: "email" }, user.email)
    ),
    user.local
      ? createElement(
          "button",
          {
            class: "delete-btn",
            onclick: () => deleteUser(user.email),
          },
          "🗑"
        )
      : null
  );
}

function renderUsers(users) {
  const list = createElement(
    "div",
    { class: "list" },
    users.length
      ? users.map(UserCard)
      : createElement("div", { class: "empty" }, "Нет данных")
  );

  const addForm = createElement(
    "div",
    { class: "add-user" },
    createElement("input", {
      id: "newName",
      type: "text",
      placeholder: "Имя пользователя",
    }),
    createElement("input", {
      id: "newEmail",
      type: "text",
      placeholder: "Email пользователя",
    }),
    createElement(
      "button",
      { class: "btn", onclick: addUser },
      "➕ Добавить"
    )
  );

  root.innerHTML = "";
  root.append(
    createElement(
      "div",
      { class: "container" },
      createElement(
        "header",
        {},
        createElement("div", { class: "logo" },
          createElement("div", { class: "logo-icon" }, "JS"),
          createElement("div", { class: "logo-title" }, "CoolApp")
        )
      ),
      createElement(
        "div",
        { class: "card" },
        createElement(
          "div",
          { class: "controls" },
          createElement("input", {
            type: "search",
            placeholder: "Поиск по имени или email",
            oninput: (e) => searchUsers(e.target.value),
          }),
          createElement("button", { class: "btn", onclick: loadUsers }, "🔄")
        ),
        list,
        addForm
      )
    )
  );
}

async function loadUsers() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const remoteUsers = await res.json();
    allUsers = [...remoteUsers, ...localUsers];
    renderUsers(allUsers);
  } catch (e) {
    root.innerHTML = "<p>Ошибка загрузки данных 😢</p>";
  }
}

// --- Поиск пользователей ---
function searchUsers(query) {
  const q = query.toLowerCase();
  const filtered = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  renderUsers(filtered);
}


function addUser() {
  const name = document.getElementById("newName").value.trim();
  const email = document.getElementById("newEmail").value.trim();

  if (!name || !email) {
    alert("Введите имя и email пользователя!");
    return;
  }

  const newUser = { name, email, local: true };
  localUsers.push(newUser);
  localStorage.setItem("localUsers", JSON.stringify(localUsers));
  allUsers.push(newUser);

  renderUsers(allUsers);

  document.getElementById("newName").value = "";
  document.getElementById("newEmail").value = "";
}

function deleteUser(email) {
  localUsers = localUsers.filter((u) => u.email !== email);
  localStorage.setItem("localUsers", JSON.stringify(localUsers));
  allUsers = allUsers.filter((u) => u.email !== email);
  renderUsers(allUsers);
}

loadUsers();
