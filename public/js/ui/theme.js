export function initTheme() {
  document.documentElement.dataset.theme =
    localStorage.getItem("theme") || "light";
}

export function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("theme", next);
}
