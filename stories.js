import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function loadStories() {
  const storiesContainer = document.getElementById("storiesContainer");

  storiesContainer.innerHTML = `<p style="color:rgba(255,255,255,0.6);">Loading stories...</p>`;

  try {
    const snapshot = await getDocs(collection(db, "stories"));

    if (snapshot.empty) {
      storiesContainer.innerHTML = `<p style="color:rgba(255,255,255,0.6);">No stories yet. Coming soon...</p>`;
      return;
    }

    let html = "";

    snapshot.forEach((docSnap) => {
      const story = docSnap.data();

      html += `
        <article class="story-card">
          <div class="story-content">
            <h2>${story.title}</h2>
            <p class="story-desc">${story.description}</p>

            <p class="story-meta">
              Chapters: ${story.chapters ? story.chapters.length : 0}
            </p>

            <a class="btn primary" href="story-view.html?id=${docSnap.id}">
              Read Story →
            </a>
          </div>
        </article>
      `;
    });

    storiesContainer.innerHTML = html;

  } catch (error) {
    storiesContainer.innerHTML = `<p style="color:#ff3d6e;">❌ Failed to load stories.</p>`;
    console.error(error);
  }
}

loadStories();
