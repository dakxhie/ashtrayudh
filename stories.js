import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function loadStories() {
  const storiesGrid = document.getElementById("storiesGrid");
  if (!storiesGrid) {
    console.error("storiesGrid element not found");
    return;
  }
  storiesGrid.innerHTML = "";

  try {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      storiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;"><p style="color:rgba(255,255,255,0.6); font-size: 16px;">No stories available yet.</p></div>`;
      return;
    }

    snapshot.forEach((docSnap) => {
      const story = docSnap.data();
      const id = docSnap.id;

      const title = story.title || "Untitled Story";
      const description = story.description || "No description available.";
      const date = story.createdAt || "Unknown date";
      const cover = story.cover || "assets/default-story.jpg";

      const card = document.createElement("div");
      card.className = "content-card";

      card.innerHTML = `
        <div class="card-image" style="background-image:url('${cover}')"></div>
        <div class="card-body">
          <h2 class="card-title">${title}</h2>
          <p class="card-desc">${description}</p>

          <div class="card-meta">
            <span>${date}</span>
            <span class="card-btn">Open →</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `story-view.html?id=${id}`;
      });

      storiesGrid.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading stories:", error);
    storiesGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color:rgba(255,255,255,0.6);">Failed to load stories. Please refresh the page.</p></div>`;
  }
}

loadStories();
