import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function loadBlogs() {
  const blogsContainer = document.getElementById("blogsContainer");

  blogsContainer.innerHTML = `<p style="color:rgba(255,255,255,0.6);">Loading blogs...</p>`;

  try {
    const blogsQuery = query(collection(db, "blogs"), orderBy("date", "desc"));
    const snapshot = await getDocs(blogsQuery);

    if (snapshot.empty) {
      blogsContainer.innerHTML = `<p style="color:rgba(255,255,255,0.6);">No blogs yet. Coming soon...</p>`;
      return;
    }

    let html = "";

    snapshot.forEach((docSnap) => {
      const blog = docSnap.data();

      html += `
        <article class="blog-card">
          <div class="blog-image">
            <img src="assets/${blog.image}" alt="${blog.title}">
          </div>

          <div class="blog-content">
            <h2>${blog.title}</h2>
            <p class="blog-excerpt">${blog.excerpt}</p>
            <p class="blog-date">${blog.date}</p>

            <a class="btn primary" href="blog-view.html?id=${docSnap.id}">
              Read More →
            </a>
          </div>
        </article>
      `;
    });

    blogsContainer.innerHTML = html;

  } catch (error) {
    blogsContainer.innerHTML = `<p style="color:#ff3d6e;">❌ Failed to load blogs.</p>`;
    console.error(error);
  }
}

loadBlogs();
