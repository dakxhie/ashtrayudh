const blogsContainer = document.getElementById("blogsContainer");
const searchInput = document.getElementById("searchInput");

let blogsData = [];

// Load blogs from JSON
async function loadBlogs() {
  try {
    const response = await fetch("blogs.json");
    const data = await response.json();

    blogsData = data.blogs;
    renderBlogs(blogsData);
  } catch (error) {
    blogsContainer.innerHTML = `
      <div class="card">
        <h3>Error Loading Blogs</h3>
        <p>blogs.json file not found or invalid. Please check your file setup.</p>
      </div>
    `;
  }
}

// Render blog cards
function renderBlogs(blogs) {
  blogsContainer.innerHTML = "";

  if (blogs.length === 0) {
    blogsContainer.innerHTML = `
      <div class="card">
        <h3>No Blogs Found</h3>
        <p>Try searching something else.</p>
      </div>
    `;
    return;
  }

  blogs.forEach((blog) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("card");

    blogCard.innerHTML = `
      <img src="${blog.image}" alt="${blog.title}" class="blog-img">
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <a href="blog-view.html?id=${blog.id}" class="btn primary" style="margin-top: 18px; display:inline-block;">
        Read More
      </a>
    `;

    blogsContainer.appendChild(blogCard);
  });
}

// Search feature
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filteredBlogs = blogsData.filter((blog) =>
    blog.title.toLowerCase().includes(query) ||
    blog.excerpt.toLowerCase().includes(query)
  );

  renderBlogs(filteredBlogs);
});

// Init
loadBlogs();
