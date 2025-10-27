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

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
  