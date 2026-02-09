import { getPublishedStories } from "./firestoreService.js";

let allStories = [];
let filteredStories = [];
let currentPage = 0;
const itemsPerPage = 6;

function renderStories(startIndex = 0) {
  const storiesGrid = document.getElementById("storiesGrid");
  if (!storiesGrid) {
    console.error("storiesGrid element not found");
    return;
  }

  if (filteredStories.length === 0) {
    storiesGrid.innerHTML = "";
    document.getElementById("emptyState").style.display = "block";
    document.getElementById("paginationSection").style.display = "none";
    document.getElementById("resultsCount").style.display = "none";
    return;
  }

  document.getElementById("emptyState").style.display = "none";
  document.getElementById("resultsCount").style.display = "block";
  document.getElementById("resultNum").textContent = filteredStories.length;

  // Pagination
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStories.length);
  const visibleStories = filteredStories.slice(0, endIndex);

  storiesGrid.innerHTML = "";

  visibleStories.forEach((story, index) => {
    const card = document.createElement("div");
    card.className = "content-card";
    card.setAttribute("data-aos", "fade-up");
    card.style.opacity = "0";
    card.style.animation = `fadeIn 0.6s ease forwards`;
    card.style.animationDelay = `${(index % itemsPerPage) * 0.1}s`;

    const title = story.title || "Untitled Story";
    const description = story.description || "No description available.";
    
    // Format date
    let dateStr = "Unknown date";
    if (story.createdAt) {
      if (story.createdAt.toDate) {
        // Firestore timestamp
        dateStr = new Date(story.createdAt.toDate()).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } else {
        // String date
        dateStr = new Date(story.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    const cover = story.coverImageUrl || "assets/default-story.jpg";

    card.innerHTML = `
      <div class="card-image" style="background-image:url('${cover}')"></div>
      <div class="card-body">
        <span class="card-category">Story</span>
        <h2 class="card-title">${title}</h2>
        <p class="card-desc">${description}</p>
        <div class="card-meta">
          <span class="card-date">${dateStr}</span>
          <span class="card-btn">Open →</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `story-view.html?id=${story.id}`;
    });

    storiesGrid.appendChild(card);
  });

  // Show/hide load more button
  const paginationSection = document.getElementById("paginationSection");
  if (endIndex < filteredStories.length) {
    paginationSection.style.display = "block";
    currentPage = endIndex;
  } else {
    paginationSection.style.display = "none";
  }
}

function filterAndSortStories() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const sortValue = document.getElementById("sortSelect").value;

  // Filter
  filteredStories = allStories.filter(story => {
    const title = (story.title || "").toLowerCase();
    const description = (story.description || "").toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
  });

  // Sort
  if (sortValue === "newest") {
    filteredStories.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  } else if (sortValue === "oldest") {
    filteredStories.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
      return dateA - dateB;
    });
  } else if (sortValue === "a-z") {
    filteredStories.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }

  currentPage = 0;
  renderStories(0);
}

async function loadStories() {
  const storiesGrid = document.getElementById("storiesGrid");
  if (!storiesGrid) {
    console.error("storiesGrid element not found");
    return;
  }

  storiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><p style="color:rgba(255,255,255,0.6); font-size: 16px;">Loading stories...</p></div>`;

  try {
    console.log("[STORIES] 🔄 Starting to load published stories from Firestore...");
    // Fetch published stories from Firestore
    allStories = await getPublishedStories();
    console.log(`[STORIES] ✅ Successfully fetched ${allStories.length} published stories from Firestore`);
    console.log("[STORIES] Story samples:", allStories.slice(0, 2));

    // Initialize filtered list
    filteredStories = [...allStories];

    // Attach event listeners
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");
    const loadMoreBtn = document.getElementById("loadMoreBtn");

    if (searchInput) {
      searchInput.addEventListener("input", filterAndSortStories);
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", filterAndSortStories);
    }
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        renderStories(currentPage);
      });
    }

    // Initial render
    renderStories(0);

  } catch (error) {
    console.error("[STORIES] ❌ Error loading stories:", error);
    console.error("[STORIES] Error message:", error.message);
    console.error("[STORIES] Error code:", error.code);
    storiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color:rgba(255,255,255,0.6);">Failed to load stories. Please refresh the page.</p></div>`;
  }
}

loadStories();
