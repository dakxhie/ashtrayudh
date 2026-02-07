import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function loadBlogs() {
  const blogsGrid = document.getElementById("blogsGrid");
  blogsGrid.innerHTML = "";

  try {
    const q = query(collection(db, "blogs"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {
      const blog = docSnap.data();
      const id = docSnap.id;

      const image = blog.image || "assets/default-blog.jpg";
      const title = blog.title || "Untitled Blog";
      const excerpt = blog.excerpt || "No excerpt available.";
      const date = blog.date || "Unknown date";

      const card = document.createElement("div");
      card.className = "content-card";

      card.innerHTML = `
        <div class="card-image" style="background-image:url('${image}')"></div>
        <div class="card-body">
          <h2 class="card-title">${title}</h2>
          <p class="card-desc">${excerpt}</p>

          <div class="card-meta">
            <span>${date}</span>
            <span class="card-btn">Read →</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href = `blog-view.html?id=${id}`;
      });

      blogsGrid.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading blogs:", error);
    blogsGrid.innerHTML = `<p style="color:rgba(255,255,255,0.6);">Failed to load blogs.</p>`;
  }
}

loadBlogs();
