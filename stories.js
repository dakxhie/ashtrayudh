import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function loadStories() {
  const storiesGrid = document.getElementById("storiesGrid");
  storiesGrid.innerHTML = "";

  try {
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

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
    storiesGrid.innerHTML = `<p style="color:rgba(255,255,255,0.6);">Failed to load stories.</p>`;
  }
}

loadStories();
