import { getBlogById, getPublishedBlogs } from "./firestoreService.js";
import { resolveBlogImage } from "./images.js";

const ICONS = {
  calendar: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
};

const DEFAULT_AUTHOR = {
  name: "Astrayudh",
  bio: "Creative studio sharing thoughtful apps, long-form blogs, and immersive stories — crafted with calm design.",
  initial: "A"
};

function getBlogId() {
  return new URLSearchParams(window.location.search).get("id");
}

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatDate(createdAt) {
  if (!createdAt) return "Unknown date";
  const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function estimateReadingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function renderContentBlocks(content) {
  if (!content) return "";

  if (typeof content === "string") {
    return content
      .split("\n\n")
      .filter((p) => p.trim())
      .map((para) => {
        const trimmed = para.trim();
        if (trimmed.startsWith("## ")) return `<h2>${trimmed.slice(3)}</h2>`;
        if (trimmed.startsWith("### ")) return `<h3>${trimmed.slice(4)}</h3>`;
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items = trimmed.split("\n").map((line) => `<li>${line.replace(/^[-*]\s*/, "")}</li>`);
          return `<ul>${items.join("")}</ul>`;
        }
        return `<p>${trimmed}</p>`;
      })
      .join("");
  }

  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (block.type === "heading") {
          const level = block.level === 3 ? "h3" : "h2";
          return `<${level}>${block.text || ""}</${level}>`;
        }
        if (block.type === "paragraph") return `<p>${block.text || ""}</p>`;
        if (block.type === "list" && block.items) {
          return `<ul>${block.items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
        }
        if (block.type === "image" && block.url) {
          const caption = block.caption ? `<figcaption>${block.caption}</figcaption>` : "";
          return `<figure><img src="${block.url}" alt="${block.alt || block.caption || ""}" loading="lazy" decoding="async"/>${caption}</figure>`;
        }
        return "";
      })
      .join("");
  }

  return "";
}

function enhanceProseImages(articleEl) {
  if (!articleEl) return;

  articleEl.querySelectorAll("img").forEach((img) => {
    if (img.closest("figure")) return;

    const figure = document.createElement("figure");
    const alt = img.getAttribute("alt");
    img.loading = "lazy";
    img.decoding = "async";
    img.parentNode.insertBefore(figure, img);
    figure.appendChild(img);

    if (alt) {
      const cap = document.createElement("figcaption");
      cap.textContent = alt;
      figure.appendChild(cap);
    }
  });
}

function insertArticleAds(articleEl) {
  if (!articleEl) return;

  const paragraphs = articleEl.querySelectorAll("p");
  if (paragraphs.length >= 4) {
    const mid = Math.floor(paragraphs.length / 2);
    const nativeSlot = document.createElement("div");
    nativeSlot.className = "ad-slot ad-slot--native-inline bv-ad-slot";
    nativeSlot.setAttribute("data-adsterra-native", "true");
    paragraphs[mid].after(nativeSlot);
  }

  const endBanner = document.createElement("div");
  endBanner.className = "ad-slot ad-slot--300x250 ad-slot--article-end bv-ad-slot";
  endBanner.setAttribute("data-adsterra-300x250", "true");
  articleEl.appendChild(endBanner);

  if (window.AdsterraPlacements) {
    window.AdsterraPlacements.mountExistingSlots();
  }
}

function buildMetaHtml(dateStr, minutes, author) {
  return `
    <span class="bv-meta__item">${ICONS.calendar}<time>${dateStr}</time></span>
    <span class="bv-meta__dot" aria-hidden="true"></span>
    <span class="bv-meta__item">${ICONS.clock}<span>${minutes} min read</span></span>
    <span class="bv-meta__dot" aria-hidden="true"></span>
    <span class="bv-meta__item">${ICONS.user}<span>${author}</span></span>
  `;
}

function buildTableOfContents(articleEl) {
  const tocAside = document.getElementById("blogToc");
  const tocNav = document.getElementById("tocNav");
  if (!articleEl || !tocAside || !tocNav) return;

  const headings = articleEl.querySelectorAll("h2, h3");
  if (headings.length < 2) {
    tocAside.hidden = true;
    document.querySelector(".bv-layout")?.classList.add("bv-layout--no-toc");
    return;
  }

  document.querySelector(".bv-layout")?.classList.remove("bv-layout--no-toc");

  tocAside.hidden = false;
  tocNav.innerHTML = `<p class="bv-toc__label">On this page</p>`;

  headings.forEach((heading, index) => {
    const id = heading.id || `section-${slugify(heading.textContent)}-${index}`;
    heading.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.className = `bv-toc__link${heading.tagName === "H3" ? " bv-toc__link--h3" : ""}`;
    link.textContent = heading.textContent;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    });
    tocNav.appendChild(link);
  });

  initTocScrollSpy(headings, tocNav);
}

function initTocScrollSpy(headings, tocNav) {
  const links = tocNav.querySelectorAll(".bv-toc__link");
  if (!headings.length || !links.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
  );

  headings.forEach((h) => observer.observe(h));
}

function initTocToggle() {
  const toggle = document.getElementById("tocToggle");
  const toc = document.getElementById("blogToc");
  if (!toggle || !toc) return;

  toggle.addEventListener("click", () => {
    const open = toc.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

function initReadingProgress() {
  const progressBar = document.getElementById("progressBar");
  const progressWrap = document.querySelector(".bv-progress");
  const article = document.getElementById("blogContent");
  if (!progressBar || !article) return;

  function updateProgress() {
    const rect = article.getBoundingClientRect();
    const articleTop = window.scrollY + rect.top;
    const articleHeight = article.offsetHeight;
    const viewportBottom = window.scrollY + window.innerHeight;
    const scrolled = viewportBottom - articleTop;
    const progress = Math.max(0, Math.min(1, scrolled / Math.max(1, articleHeight + rect.top)));
    const pct = Math.round(progress * 100);
    progressBar.style.width = `${pct}%`;
    if (progressWrap) progressWrap.setAttribute("aria-valuenow", String(pct));
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();
}

function initShare(title) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title || document.title);

  const shareX = document.getElementById("shareX");
  const shareLinkedIn = document.getElementById("shareLinkedIn");
  const shareFacebook = document.getElementById("shareFacebook");
  const shareCopy = document.getElementById("shareCopy");

  if (shareX) shareX.href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  if (shareLinkedIn) shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  if (shareFacebook) shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;

  if (shareCopy) {
    shareCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareCopy.classList.add("is-copied");
        shareCopy.setAttribute("aria-label", "Link copied");
        setTimeout(() => {
          shareCopy.classList.remove("is-copied");
          shareCopy.setAttribute("aria-label", "Copy link");
        }, 2000);
      } catch {
        /* clipboard unavailable */
      }
    });
  }
}

function renderAuthor(blog) {
  const authorName = document.getElementById("authorName");
  const authorBio = document.getElementById("authorBio");
  const avatar = document.querySelector(".bv-author__avatar span");
  if (!authorName || !authorBio) return;

  const author = blog.author || DEFAULT_AUTHOR.name;
  const bio = blog.authorBio || DEFAULT_AUTHOR.bio;
  const initial = author.charAt(0).toUpperCase();

  authorName.textContent = author;
  authorBio.textContent = bio;
  if (avatar) avatar.textContent = initial;
}

async function loadRelatedArticles(currentId) {
  const grid = document.getElementById("relatedArticles");
  if (!grid) return;

  try {
    const blogs = await getPublishedBlogs();
    const related = blogs.filter((b) => b.id !== currentId).slice(0, 3);

    if (!related.length) {
      grid.innerHTML = `<p class="bv-related__empty" style="color:var(--bv-text-secondary);grid-column:1/-1;">More articles coming soon.</p>`;
      return;
    }

    grid.innerHTML = related
      .map((blog) => {
        const img = resolveBlogImage(blog);
        const date = formatDate(blog.createdAt);
        const excerpt = blog.description || blog.subtitle || "";
        return `
          <a class="bv-related-card" href="blog-view.html?id=${blog.id}">
            <div class="bv-related-card__media">
              <img src="${img}" alt="" loading="lazy" decoding="async" width="400" height="180"/>
            </div>
            <div class="bv-related-card__body">
              <span class="bv-related-card__date">${date}</span>
              <h3 class="bv-related-card__title">${blog.title || "Untitled"}</h3>
              ${excerpt ? `<p class="bv-related-card__excerpt">${excerpt}</p>` : ""}
            </div>
          </a>
        `;
      })
      .join("");
  } catch {
    grid.innerHTML = "";
  }
}

function initFadeUpAnimations() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = document.querySelectorAll(".bv-animate:not(.is-visible)");
  if (!items.length) return;

  if (prefersReduced) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 0.07, 0.42)}s`;
    observer.observe(el);
  });
}

function setHeroImage(url, title) {
  const heroImg = document.getElementById("blogHeroImg");
  if (!heroImg) return;

  heroImg.src = url;
  heroImg.alt = title ? `${title} cover image` : "Article cover image";
  heroImg.onerror = function onHeroError() {
    heroImg.onerror = null;
    heroImg.src = resolveBlogImage({ title }, 1);
  };
}

async function loadBlog() {
  const blogId = getBlogId();
  const blogTitle = document.getElementById("blogTitle");
  const blogMeta = document.getElementById("blogMeta");
  const blogContent = document.getElementById("blogContent");

  if (!blogTitle || !blogMeta || !blogContent) {
    console.error("Required DOM elements not found");
    return;
  }

  initTocToggle();

  if (!blogId) {
    blogTitle.textContent = "Blog not found";
    blogContent.innerHTML = "<p>Invalid blog ID.</p>";
    initFadeUpAnimations();
    return;
  }

  try {
    const blog = await getBlogById(blogId);

    if (!blog) {
      blogTitle.textContent = "Blog not found";
      blogContent.innerHTML = "<p>This blog does not exist.</p>";
      return;
    }

    if (!blog.published) {
      blogTitle.textContent = "Blog not published";
      blogContent.innerHTML = "<p>This blog is still in draft status.</p>";
      return;
    }

    const title = blog.title || "Untitled Blog";
    const dateStr = formatDate(blog.createdAt);
    const author = blog.author || DEFAULT_AUTHOR.name;

    document.title = `${title} | Astrayudh Blog`;
    blogTitle.textContent = title;

    const bc = document.getElementById("blogBreadcrumbTitle");
    if (bc) bc.textContent = title;

    const coverImage = resolveBlogImage(blog);
    setHeroImage(coverImage, title);

    const html = renderContentBlocks(blog.content);
    blogContent.innerHTML = html || "<p>No content available.</p>";

    enhanceProseImages(blogContent);
    insertArticleAds(blogContent);

    const minutes = estimateReadingTime(blogContent.innerText);
    blogMeta.innerHTML = buildMetaHtml(dateStr, minutes, author);

    buildTableOfContents(blogContent);
    initReadingProgress();
    initShare(title);
    renderAuthor(blog);
    await loadRelatedArticles(blogId);
    initFadeUpAnimations();
  } catch (error) {
    console.error("[BLOG-VIEW] Error loading blog:", error);
    blogTitle.textContent = "Error loading blog";
    blogContent.innerHTML = "<p>Something went wrong. Please refresh the page.</p>";
  }
}

loadBlog();
