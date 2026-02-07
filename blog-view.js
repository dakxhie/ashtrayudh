import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function getBlogId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadBlog() {
  const blogId = getBlogId();

  const blogTitle = document.getElementById("blogTitle");
  const blogMeta = document.getElementById("blogMeta");
  const blogImage = document.getElementById("blogImage");
  const blogContent = document.getElementById("blogContent");

  if (!blogId) {
    blogTitle.innerText = "Blog not found";
    blogContent.innerHTML = "<p>Invalid blog ID.</p>";
    return;
  }

  try {
    const blogRef = doc(db, "blogs", blogId);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      blogTitle.innerText = "Blog not found";
      blogContent.innerHTML = "<p>This blog does not exist.</p>";
      return;
    }

    const blog = blogSnap.data();

    blogTitle.innerText = blog.title;
    blogMeta.innerText = `Published on ${blog.date}`;
    blogImage.src = `assets/${blog.image}`;

    let html = "";

    blog.content.forEach((block) => {
      if (block.type === "heading") {
        html += `<h2>${block.text}</h2>`;
      } else if (block.type === "paragraph") {
        html += `<p>${block.text}</p>`;
      } else if (block.type === "list") {
        html += `<ul>${block.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
      }
    });

    blogContent.innerHTML = html;

  } catch (error) {
    blogTitle.innerText = "Error loading blog";
    blogContent.innerHTML = "<p>Something went wrong.</p>";
    console.error(error);
  }
}

loadBlog();
