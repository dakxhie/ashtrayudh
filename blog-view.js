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
    // Load from local JSON first
    let blog = null;
    
    try {
      const response = await fetch("blogs.json");
      if (response.ok) {
        const data = await response.json();
        const blogs = data.blogs || [];
        blog = blogs.find(b => b.id === blogId);
      }
    } catch (e) {
      console.warn("Could not load from JSON, trying Firestore...", e);
    }

    // Fallback to Firestore if JSON unavailable
    if (!blog) {
      try {
        const { db } = await import("./firebase.js");
        const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");
        const blogRef = doc(db, "blogs", blogId);
        const blogSnap = await getDoc(blogRef);
        if (blogSnap.exists()) {
          blog = blogSnap.data();
        }
      } catch (e) {
        console.warn("Firestore fetch failed", e);
      }
    }

    if (!blog) {
      blogTitle.innerText = "Blog not found";
      blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This blog does not exist.</p>";
      return;
    }

    blogTitle.innerText = blog.title || "Untitled Blog";
    blogMeta.innerText = `Published on ${blog.date || "Unknown date"}`;
    
    // Update breadcrumb early
    const bc = document.getElementById("blogBreadcrumbTitle");
    if (bc) bc.innerText = blog.title || "Blog";
    
    // Handle image loading
    const blogCoverDiv = document.querySelector(".blog-cover");
    if (blog.image) {
      const imagePath = blog.image.startsWith("http") || blog.image.startsWith("/") 
        ? blog.image 
        : `assets/${blog.image}`;
      blogImage.src = imagePath;
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

    // Estimate reading time (words / 200 wpm)
    try {
      const text = (blogContent.innerText || "").trim();
      const words = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 200));
      blogMeta.innerText = `Published on ${blog.date || "Unknown date"} • ${minutes} min read`;
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
    console.error("Error loading blog:", error);
    blogTitle.innerText = "Error loading blog";
    blogContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>Something went wrong. Please refresh the page.</p>";
  }
}

loadBlog();
