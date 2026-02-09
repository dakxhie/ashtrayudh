import { getBlogById } from "./firestoreService.js";

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
    console.error("[BLOG-VIEW] ❌ No blog ID found in URL");
    return;
  }

  try {
    console.log("[BLOG-VIEW] 🔄 Loading blog with ID:", blogId);
    // Fetch blog from Firestore
    const blog = await getBlogById(blogId);
    console.log("[BLOG-VIEW] ✅ Blog fetched:", blog);

    if (!blog) {
      blogTitle.innerText = "Blog not found";
      blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This blog does not exist.</p>";
      console.warn("[BLOG-VIEW] Blog document not found in Firestore");
      return;
    }

    // Check if blog is published
    if (!blog.published) {
      blogTitle.innerText = "Blog not published";
      blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This blog is still in draft status.</p>";
      console.warn(`[BLOG-VIEW] Blog ${blogId} is not published (published=${blog.published})`);
      return;
    }

    console.log("[BLOG-VIEW] ✅ Blog is published, rendering content...");

    blogTitle.innerText = blog.title || "Untitled Blog";
    
    // Format date
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
    
    blogMeta.innerText = `Published on ${dateStr}`;
    
    // Update breadcrumb
    const bc = document.getElementById("blogBreadcrumbTitle");
    if (bc) bc.innerText = blog.title || "Blog";
    
    // Handle image loading
    const blogCoverDiv = document.querySelector(".blog-cover");
    if (blog.imageUrl) {
      blogImage.src = blog.imageUrl;
      blogImage.alt = blog.title || "Blog cover image";
      blogImage.onerror = function() {
        if (blogCoverDiv) blogCoverDiv.style.display = "none";
      };
      blogImage.onload = function() {
        if (blogCoverDiv) blogCoverDiv.style.display = "block";
      };
    } else {
      // Hide image container if no image
      if (blogCoverDiv) blogCoverDiv.style.display = "none";
    }

    // Render content
    let html = "";
    
    if (blog.content) {
      // If content is a string, render as paragraphs
      if (typeof blog.content === "string") {
        const paragraphs = blog.content.split("\n\n").filter(p => p.trim());
        paragraphs.forEach((para) => {
          if (para.trim()) {
            html += `<p>${para.trim()}</p>`;
          }
        });
      } else if (Array.isArray(blog.content)) {
        // If content is array of objects
        blog.content.forEach((block) => {
          if (block.type === "heading") {
            html += `<h2>${block.text || ""}</h2>`;
          } else if (block.type === "paragraph") {
            html += `<p>${block.text || ""}</p>`;
          } else if (block.type === "list" && block.items) {
            html += `<ul>${block.items.map(item => `<li>${item}</li>`).join("")}</ul>`;
          }
        });
      }
    }

    blogContent.innerHTML = html || "<p>No content available.</p>";

    // Estimate reading time (words / 200 wpm)
    try {
      const text = (blogContent.innerText || "").trim();
      const words = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 200));
      blogMeta.innerText = `Published on ${dateStr} • ${minutes} min read`;
    } catch (e) {
      // ignore
    }

    // Reading progress
    const progressBar = document.getElementById("progressBar");
    function updateProgress() {
      const article = document.getElementById("blogContent");
      if (!article || !progressBar) return;
      const articleTop = article.getBoundingClientRect().top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const winCentre = window.scrollY + window.innerHeight / 2;
      let progress = (winCentre - articleTop) / Math.max(1, articleHeight);
      progress = Math.max(0, Math.min(1, progress));
      progressBar.style.width = (progress * 100) + "%";
    }

    window.addEventListener("scroll", updateProgress);
    window.addEventListener("resize", updateProgress);
    setTimeout(updateProgress, 300);

  } catch (error) {
    console.error("[BLOG-VIEW] ❌ Error loading blog:", error);
    console.error("[BLOG-VIEW] Error message:", error.message);
    console.error("[BLOG-VIEW] Error code:", error.code);
    blogTitle.innerText = "Error loading blog";
    blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>Something went wrong. Please refresh the page.</p>";
  }
}

loadBlog();
