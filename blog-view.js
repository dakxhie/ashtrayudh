const blogTitle = document.getElementById("blogTitle");
const blogDate = document.getElementById("blogDate");
const blogImage = document.getElementById("blogImage");
const blogContent = document.getElementById("blogContent");

// Get blog id from URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

async function loadBlog() {
  try {
    const response = await fetch("blogs.json");
    const data = await response.json();

    const blog = data.blogs.find((b) => b.id === blogId);

    if (!blog) {
      blogTitle.innerText = "Blog Not Found";
      blogContent.innerHTML = "<p>This blog does not exist.</p>";
      return;
    }

    // Fill content
    blogTitle.innerText = blog.title;
    blogDate.innerText = `Published: ${blog.date}`;
    blogImage.src = blog.image;

    blogContent.innerHTML = "";

    blog.content.forEach((block) => {
      if (block.type === "heading") {
        const h2 = document.createElement("h2");
        h2.innerText = block.text;
        blogContent.appendChild(h2);
      }

      if (block.type === "paragraph") {
        const p = document.createElement("p");
        p.innerText = block.text;
        blogContent.appendChild(p);
      }

      if (block.type === "list") {
        const ul = document.createElement("ul");

        block.items.forEach((item) => {
          const li = document.createElement("li");
          li.innerText = item;
          ul.appendChild(li);
        });

        blogContent.appendChild(ul);
      }
    });

  } catch (error) {
    blogTitle.innerText = "Error Loading Blog";
    blogContent.innerHTML = "<p>Could not load blog data.</p>";
  }
}

loadBlog();
