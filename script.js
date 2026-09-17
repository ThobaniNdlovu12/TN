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

const formSuccess = document.querySelector("[data-form-success]");
const query = new URLSearchParams(window.location.search);

if (formSuccess && query.get("message") === "sent") {
  formSuccess.hidden = false;
  window.history.replaceState({}, "", `${window.location.pathname}#contact`);
}

const thoughtsGrid = document.querySelector("[data-thoughts-grid]");
const feedStatus = document.querySelector("[data-feed-status]");

if (thoughtsGrid) {
  const feedUrl = thoughtsGrid.dataset.substackFeed;
  const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error("Feed unavailable");
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data.items) || data.items.length === 0) return;

      const posts = data.items
        .filter((post) => {
          try {
            const url = new URL(post.link);
            return url.protocol === "https:" && (url.hostname === "substack.com" || url.hostname.endsWith(".substack.com"));
          } catch {
            return false;
          }
        })
        .slice(0, 3);
      if (posts.length === 0) return;
      thoughtsGrid.replaceChildren();

      posts.forEach((post, index) => {
        const card = document.createElement("a");
        card.className = `article-card${index === 0 ? " article-card-featured" : ""}`;
        card.href = post.link;
        card.target = "_blank";
        card.rel = "noreferrer";

        const meta = document.createElement("p");
        meta.className = "article-meta";
        const published = new Date(post.pubDate);
        meta.textContent = Number.isNaN(published.getTime())
          ? "My Thoughts"
          : `My Thoughts · ${published.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}`;

        const title = document.createElement("h3");
        title.textContent = post.title;

        const summary = document.createElement("p");
        const temporary = document.createElement("div");
        temporary.innerHTML = post.description || post.content || "";
        const plainText = temporary.textContent.replace(/\s+/g, " ").trim();
        summary.textContent = plainText.length > 180 ? `${plainText.slice(0, 177).trim()}…` : plainText;

        card.append(meta, title, summary);
        thoughtsGrid.append(card);
      });

      if (feedStatus) feedStatus.textContent = "Latest posts from Substack";
    })
    .catch(() => {
      if (feedStatus) feedStatus.textContent = "Read the latest posts on Substack.";
    });
}
