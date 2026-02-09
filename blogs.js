import { getPublishedBlogs } from "./firestoreService.js";

let allBlogs = [];
let filteredBlogs = [];
let currentPage = 0;
const itemsPerPage = 6;

function renderBlogs(startIndex = 0) {
  const blogsGrid = document.getElementById("blogsGrid");
  if (!blogsGrid) {
    console.error("blogsGrid element not found");
    return;
  }

  if (filteredBlogs.length === 0) {
    blogsGrid.innerHTML = "";
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("paginationSection").style.display = "none";
    document.getElementById("resultsCount").style.display = "none";
    return;
  }

  document.getElementById("emptyState").style.display = "none";
  document.getElementById("resultsCount").style.display = "block";
  document.getElementById("resultNum").textContent = filteredBlogs.length;

  // Pagination
  const endIndex = Math.min(startIndex + itemsPerPage, filteredBlogs.length);
  const visibleBlogs = filteredBlogs.slice(0, endIndex);

  blogsGrid.innerHTML = "";

  visibleBlogs.forEach((blog, index) => {
    const card = document.createElement("div");
    card.className = "content-card";
    card.setAttribute("data-aos", "fade-up");
    card.style.opacity = "0";
    card.style.animation = `fadeIn 0.6s ease forwards`;
    card.style.animationDelay = `${(index % itemsPerPage) * 0.1}s`;

    const image = blog.imageUrl || "assets/default-blog.jpg";
    const title = blog.title || "Untitled Blog";
    const subtitle = blog.subtitle || "No subtitle";
    
    // Format date if it's a timestamp
    let dateStr = "Unknown date";
    if (blog.createdAt) {
      if (blog.createdAt.toDate) {
        // Firestore timestamp
        dateStr = new Date(blog.createdAt.toDate()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else {
        // String date
        dateStr = new Date(blog.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }

    card.innerHTML = `
      <div class="card-image" style="background-image:url('${image}')"></div>
      <div class="card-body">
        <span class="card-category">Blog</span>
        <h2 class="card-title">${title}</h2>
        <p class="card-desc">${subtitle}</p>
        <div class="card-meta">
          <span class="card-date">${dateStr}</span>
          <span class="card-btn">Read →</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `blog-view.html?id=${blog.id}`;
    });

    blogsGrid.appendChild(card);
  });

  // Show/hide load more button
  const paginationSection = document.getElementById("paginationSection");
  if (endIndex < filteredBlogs.length) {
    paginationSection.style.display = "block";
    currentPage = endIndex;
  } else {
    paginationSection.style.display = "none";
  }
}

function filterAndSortBlogs() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortValue = document.getElementById("sortSelect").value;

  // Filter
  filteredBlogs = allBlogs.filter(blog => {
    const title = (blog.title || "").toLowerCase();
    const subtitle = (blog.subtitle || "").toLowerCase();
    const description = (blog.description || "").toLowerCase();
    return title.includes(searchTerm) || subtitle.includes(searchTerm) || description.includes(searchTerm);
  });

  // Sort
  if (sortValue === "newest") {
    filteredBlogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } else if (sortValue === "oldest") {
    filteredBlogs.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateA - dateB;
    });
  } else if (sortValue === "a-z") {
    filteredBlogs.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  currentPage = 0;
  renderBlogs(0);
}

async function loadBlogs() {
  const blogsGrid = document.getElementById("blogsGrid");
  if (!blogsGrid) {
    console.error("blogsGrid element not found");
    return;
  }

  blogsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><p style="color:rgba(255,255,255,0.6); font-size: 16px;">Loading blogs...</p></div>`;

  try {
    // Fetch published blogs from Firestore
    allBlogs = await getPublishedBlogs();

    // Initialize filtered list
    filteredBlogs = [...allBlogs];

    // Attach event listeners
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    if (searchInput) {
      searchInput.addEventListener("input", filterAndSortBlogs);
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", filterAndSortBlogs);
    }
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        renderBlogs(currentPage);
      });
    }

    // Initial render
    renderBlogs(0);

  } catch (error) {
    console.error("Error loading blogs:", error);
    blogsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color:rgba(255,255,255,0.6);">Failed to load blogs. Please refresh the page.</p></div>`;
  }
}

loadBlogs();
