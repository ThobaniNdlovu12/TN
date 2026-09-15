const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.querySelector("span").textContent = isOpen ? "Menu" : "Close";
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector("span").textContent = "Menu";
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  });
}

const year = document.querySelector("[data-year]");
if (year) year.textContent = new Date().getFullYear();
