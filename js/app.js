// app.js - главный роутер приложения

const root = document.getElementById("root");

function router() {
  const hash = location.hash || "#users";
  const parts = hash.split("#").filter(Boolean);

  if (parts.length >= 4 && parts[0] === "users" && parts[1] === "posts" && parts[2] === "comments") {
    const postId = parts[3];
    return renderComments(root, postId);
  }
  
  if (parts.length >= 3 && parts[0] === "users" && parts[1] === "posts") {
    const userId = parts[2];
    return renderPosts(root, userId);
  }
  
  if (parts.length >= 3 && parts[0] === "users" && parts[1] === "todos") {
    const userId = parts[2];
    return renderTodos(root, userId);
  }
  
  return renderUsers(root);
}

window.addEventListener("hashchange", router);
router();
