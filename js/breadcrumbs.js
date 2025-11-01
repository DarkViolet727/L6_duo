const breadcrumbLabels = {
  users: { text: "Пользователи", icon: "👥" },
  todos: { text: "Задачи", icon: "📝" },
  posts: { text: "Посты", icon: "📄" },
  comments: { text: "Комментарии", icon: "💬" }
};

function renderBreadcrumbs(path) {
  const parts = path.split("#").filter(Boolean);
  if (!parts.length) return null;

  const crumbs = [];
  let currentPath = "";

  parts.forEach((part, i) => {
    currentPath += (i === 0 ? "#" : "#") + part;
    const labelData = breadcrumbLabels[part] || { text: part, icon: "📁" };

    let displayText = labelData.text;
    if (i === 2 && parts[0] === "users" && parts[1] === "todos") {
      displayText += ` (ID: ${part})`;
    } else if (i === 2 && parts[0] === "users" && parts[1] === "posts") {
      displayText += ` (ID: ${part})`;
    } else if (i === 3 && parts[0] === "users" && parts[1] === "posts" && parts[2] === "comments") {
      displayText += ` (ID: ${part})`;
    }
    
    crumbs.push(
      createElement(
        "a",
        { href: currentPath, class: "breadcrumb-link" },
        createElement("span", {}, labelData.icon),
        createElement("span", {}, displayText)
      )
    );
    if (i < parts.length - 1)
      crumbs.push(createElement("span", { class: "breadcrumb-sep" }, "→"));
  });

  return createElement("div", { class: "breadcrumbs" }, crumbs);
}
