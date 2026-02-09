import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

let allStories = []; // Store all stories for filtering
let filteredStories = []; // Filtered and sorted stories
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
    const date = story.createdAt || "Unknown date";
    const cover = story.cover || "assets/default-story.jpg";

    card.innerHTML = `
      <div class="card-image" style="background-image:url('${cover}')"></div>
      <div class="card-body">
        <span class="card-category">Story</span>
        <h2 class="card-title">${title}</h2>
        <p class="card-desc">${description}</p>
        <div class="card-meta">
          <span class="card-date">${date}</span>
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
    filteredStories.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (sortValue === "oldest") {
    filteredStories.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
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
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    allStories = [];
    snapshot.forEach((docSnap) => {
      const story = docSnap.data();
      allStories.push({
        id: docSnap.id,
        ...story
      });
    });

    // Initialize filtered list
    filteredStories = [...allStories];

    // Attach event listeners
    document.getElementById("searchInput").addEventListener("input", filterAndSortStories);
    document.getElementById("sortSelect").addEventListener("change", filterAndSortStories);
    document.getElementById("loadMoreBtn").addEventListener("click", () => {
      renderStories(currentPage);
    });

    // Initial render
    renderStories(0);

  } catch (error) {
    console.error("Error loading stories:", error);
    storiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color:rgba(255,255,255,0.6);">Failed to load stories. Please refresh the page.</p></div>`;
  }
}

loadStories();

loadStories();
