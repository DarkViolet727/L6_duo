// posts.js - управление постами

let allPosts = [];

async function renderPosts(root, userId = null) {
  const container = createElement("div", { class: "container" });
  
  const header = createElement("header", {},
    createElement("div", { class: "logo" },
      createElement("div", { class: "logo-icon" }, "P"),
      createElement("div", { class: "logo-title" }, "Post Manager")
    )
  );

  const card = createElement("div", { class: "card" });
  
  const title = createElement("h2", {}, "📄 Список постов");
  const crumbs = renderBreadcrumbs("#users#posts");

  const controls = createElement(
    "div",
    { class: "controls" },
    createElement("input", {
      type: "search",
      placeholder: "Поиск по заголовку или содержанию",
      oninput: debounce((e) => searchPosts(e.target.value, root), 300),
    }),
    createElement("button", { class: "btn", onclick: () => loadPosts(root, userId) }, "🔄")
  );

  const list = createElement("div", { class: "list" }, "Загрузка...");

  card.append(crumbs, title, controls, list);
  container.append(header, card);
  
  root.innerHTML = "";
  root.append(container);

  await loadPosts(root, userId);
  renderPostList(allPosts, root);
}

async function loadPosts(root, userId = null) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    
    let filteredData = data;
    if (userId) {
      filteredData = data.filter(post => post.userId === parseInt(userId));
    }
    
    allPosts = filteredData;
    renderPostList(allPosts, root);
  } catch (error) {
    console.error("Ошибка загрузки постов:", error);
    renderPostList(allPosts, root);
  }
}

function renderPostList(posts, root) {
  const list = document.querySelector(".list");
  if (!list) return;
  
  list.innerHTML = "";
  if (!posts.length) {
    list.append(createElement("div", { class: "empty" }, "Нет постов"));
    return;
  }
  
  posts.forEach(post => {
    const postElement = createElement(
      "div",
      { class: "post" },
      createElement("div", { class: "title" }, post.title),
      createElement("div", { class: "body" }, post.body),
      createElement("button", { 
        class: "btn", 
        onclick: () => location.hash = `#users#posts#comments#${post.id}`,
        style: "margin-top: 10px;"
      }, "💬 Комментарии")
    );
    list.append(postElement);
  });
}

function searchPosts(query, root) {
  const q = query.toLowerCase();
  const filtered = allPosts.filter(post =>
    post.title.toLowerCase().includes(q) ||
    post.body.toLowerCase().includes(q)
  );
  renderPostList(filtered, root);
}
