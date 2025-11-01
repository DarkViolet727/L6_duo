let allComments = [];

async function renderComments(root, postId = null) {
  const container = createElement("div", { class: "container" });
  
  const header = createElement("header", {},
    createElement("div", { class: "logo" },
      createElement("div", { class: "logo-icon" }, "C"),
      createElement("div", { class: "logo-title" }, "Comment Manager")
    )
  );

  const card = createElement("div", { class: "card" });
  
  const title = createElement("h2", {}, "💬 Комментарии к постам");
  const crumbs = renderBreadcrumbs("#users#posts#comments");

  const controls = createElement(
    "div",
    { class: "controls" },
    createElement("input", {
      type: "search",
      placeholder: "Поиск по имени или содержанию",
      oninput: debounce((e) => searchComments(e.target.value, root), 300),
    }),
    createElement("button", { class: "btn", onclick: () => loadComments(root, postId) }, "🔄")
  );

  const list = createElement("div", { class: "list" }, "Загрузка...");

  card.append(crumbs, title, controls, list);
  container.append(header, card);
  
  root.innerHTML = "";
  root.append(container);

  await loadComments(root, postId);
  renderCommentList(allComments, root);
}

async function loadComments(root, postId = null) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/comments");
    const data = await res.json();
    
    let filteredData = data;
    if (postId) {
      filteredData = data.filter(comment => comment.postId === parseInt(postId));
    }
    
    allComments = filteredData;
    renderCommentList(allComments, root);
  } catch (error) {
    console.error("Ошибка загрузки комментариев:", error);
    renderCommentList(allComments, root);
  }
}

function renderCommentList(comments, root) {
  const list = document.querySelector(".list");
  if (!list) return;
  
  list.innerHTML = "";
  if (!comments.length) {
    list.append(createElement("div", { class: "empty" }, "Нет комментариев"));
    return;
  }
  
  comments.forEach(comment => {
    const commentElement = createElement(
      "div",
      { class: "comment" },
      createElement("div", { class: "name" }, comment.name),
      createElement("div", { class: "body" }, comment.body),
      createElement("div", { class: "email", style: "font-size: 12px; color: #666; margin-top: 5px;" }, comment.email)
    );
    list.append(commentElement);
  });
}

function searchComments(query, root) {
  const q = query.toLowerCase();
  const filtered = allComments.filter(comment =>
    comment.name.toLowerCase().includes(q) ||
    comment.body.toLowerCase().includes(q)
  );
  renderCommentList(filtered, root);
}
