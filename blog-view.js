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

  if (!blogTitle || !blogMeta || !blogImage || !blogContent) {
    console.error("Required DOM elements not found");
    return;
  }

  if (!blogId) {
    blogTitle.innerText = "Blog not found";
    blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>Invalid blog ID.</p>";
    return;
  }

  try {
    const blogRef = doc(db, "blogs", blogId);
    const blogSnap = await getDoc(blogRef);

    if (!blogSnap.exists()) {
      blogTitle.innerText = "Blog not found";
      blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This blog does not exist.</p>";
      return;
    }

    const blog = blogSnap.data();

    blogTitle.innerText = blog.title || "Untitled Blog";
    blogMeta.innerText = `Published on ${blog.date || "Unknown date"}`;
    
    if (blog.image) {
      blogImage.src = blog.image;
      blogImage.onerror = function() {
        this.src = "assets/default-blog.jpg";
      };
    }

    let html = "";

    if (blog.content && Array.isArray(blog.content)) {
      blog.content.forEach((block) => {
        if (block.type === "heading") {
          html += `<h2>${block.text || ""}</h2>`;
        } else if (block.type === "paragraph") {
          html += `<p>${block.text || ""}</p>`;
        } else if (block.type === "list" && block.items) {
          html += `<ul>${block.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
        }
      });
    } else {
      html = "<p>No content available.</p>";
    }

    blogContent.innerHTML = html || "<p>No content available.</p>";

  } catch (error) {
    console.error("Error loading blog:", error);
    blogTitle.innerText = "Error loading blog";
    blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>Something went wrong. Please refresh the page.</p>";
  }
}

loadBlog();
