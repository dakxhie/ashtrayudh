/* ==============================
   ASTRAYUDH ADMIN PANEL (ADVANCED)
   ============================== */

const ADMIN_PASSWORD = "astrayudh@2026"; // CHANGE THIS PASSWORD

// ------------------------------
// LOGIN SYSTEM
// ------------------------------
function loginAdmin(event) {
  event.preventDefault();

  const pass = document.getElementById("adminPass").value;

  if (pass === ADMIN_PASSWORD) {
    localStorage.setItem("astrayudh_admin_logged", "true");
    loadAdminPanel();
  } else {
    alert("❌ Wrong Password!");
  }

  return false;
}

function logoutAdmin() {
  localStorage.removeItem("astrayudh_admin_logged");
  location.reload();
}

function loadAdminPanel() {
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";

  loadBlogs();
  loadStories();
}

window.onload = () => {
  if (localStorage.getItem("astrayudh_admin_logged") === "true") {
    loadAdminPanel();
  }
};

// ------------------------------
// SWITCH SECTIONS
// ------------------------------
function showSection(sectionId) {
  document.getElementById("blogsAdmin").style.display = "none";
  document.getElementById("storiesAdmin").style.display = "none";

  document.getElementById(sectionId).style.display = "block";
}

// ------------------------------
// BLOGS CRUD
// ------------------------------
function getBlogs() {
  let blogs = localStorage.getItem("astrayudh_blogs");
  return blogs ? JSON.parse(blogs) : [];
}

function saveBlogs(blogs) {
  localStorage.setItem("astrayudh_blogs", JSON.stringify(blogs));
}

function loadBlogs() {
  const blogsList = document.getElementById("blogsList");
  const blogs = getBlogs();

  if (blogs.length === 0) {
    blogsList.innerHTML = `<p style="color:#b9b9c6;">No blogs added yet.</p>`;
    return;
  }

  blogsList.innerHTML = blogs.map((blog, index) => `
    <div class="card" style="margin-bottom:18px;">
      <h3>${blog.title}</h3>
      <p>${blog.excerpt}</p>
      <p style="margin-top:10px; font-size:13px; color:#ff3d6e;">ID: ${blog.id}</p>

      <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn secondary" onclick="editBlog(${index})">✏️ Edit</button>
        <button class="btn primary" onclick="deleteBlog(${index})">🗑 Delete</button>
      </div>
    </div>
  `).join("");
}

function addBlog() {
  const title = prompt("Enter Blog Title:");
  if (!title) return;

  const excerpt = prompt("Enter Blog Excerpt:");
  if (!excerpt) return;

  const id = title.toLowerCase().replace(/\s+/g, "-");

  const contentText = prompt("Enter blog content (paragraph). You can edit later:");
  if (!contentText) return;

  const newBlog = {
    id: id,
    title: title,
    excerpt: excerpt,
    image: "blog1.jpg",
    date: new Date().toISOString().split("T")[0],
    content: [
      { type: "heading", text: title },
      { type: "paragraph", text: contentText }
    ]
  };

  let blogs = getBlogs();
  blogs.unshift(newBlog);
  saveBlogs(blogs);

  alert("✅ Blog Added Successfully!");
  loadBlogs();
}

function editBlog(index) {
  let blogs = getBlogs();
  let blog = blogs[index];

  const newTitle = prompt("Edit Title:", blog.title);
  if (!newTitle) return;

  const newExcerpt = prompt("Edit Excerpt:", blog.excerpt);
  if (!newExcerpt) return;

  blog.title = newTitle;
  blog.excerpt = newExcerpt;

  blogs[index] = blog;
  saveBlogs(blogs);

  alert("✅ Blog Updated!");
  loadBlogs();
}

function deleteBlog(index) {
  let blogs = getBlogs();

  if (confirm("Are you sure you want to delete this blog?")) {
    blogs.splice(index, 1);
    saveBlogs(blogs);
    alert("🗑 Blog Deleted!");
    loadBlogs();
  }
}

// ------------------------------
// STORIES CRUD + CHAPTERS
// ------------------------------
function getStories() {
  let stories = localStorage.getItem("astrayudh_stories");
  return stories ? JSON.parse(stories) : [];
}

function saveStories(stories) {
  localStorage.setItem("astrayudh_stories", JSON.stringify(stories));
}

function loadStories() {
  const storiesList = document.getElementById("storiesList");
  const stories = getStories();

  if (stories.length === 0) {
    storiesList.innerHTML = `<p style="color:#b9b9c6;">No stories added yet.</p>`;
    return;
  }

  storiesList.innerHTML = stories.map((story, index) => `
    <div class="card" style="margin-bottom:18px;">
      <h3>${story.title}</h3>
      <p>${story.description}</p>

      <p style="margin-top:12px; font-size:13px; color:#ff3d6e;">
        Chapters: ${story.chapters.length}
      </p>

      <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn secondary" onclick="editStory(${index})">✏️ Edit Story</button>
        <button class="btn secondary" onclick="manageChapters(${index})">📖 Manage Chapters</button>
        <button class="btn primary" onclick="deleteStory(${index})">🗑 Delete Story</button>
      </div>
    </div>
  `).join("");
}

function addStory() {
  const title = prompt("Enter Story Title:");
  if (!title) return;

  const description = prompt("Enter Story Description:");
  if (!description) return;

  const id = title.toLowerCase().replace(/\s+/g, "-");

  const newStory = {
    id: id,
    title: title,
    description: description,
    chapters: [
      {
        title: "Chapter 1",
        content: [
          "This is your first chapter.",
          "Write the story here..."
        ]
      }
    ]
  };

  let stories = getStories();
  stories.unshift(newStory);
  saveStories(stories);

  alert("✅ Story Added Successfully!");
  loadStories();
}

function editStory(index) {
  let stories = getStories();
  let story = stories[index];

  const newTitle = prompt("Edit Story Title:", story.title);
  if (!newTitle) return;

  const newDesc = prompt("Edit Story Description:", story.description);
  if (!newDesc) return;

  story.title = newTitle;
  story.description = newDesc;

  stories[index] = story;
  saveStories(stories);

  alert("✅ Story Updated!");
  loadStories();
}

function deleteStory(index) {
  let stories = getStories();

  if (confirm("Are you sure you want to delete this story?")) {
    stories.splice(index, 1);
    saveStories(stories);
    alert("🗑 Story Deleted!");
    loadStories();
  }
}

// ------------------------------
// CHAPTER MANAGEMENT
// ------------------------------
function manageChapters(storyIndex) {
  let stories = getStories();
  let story = stories[storyIndex];

  let chapterMenu = `Managing Chapters for: ${story.title}\n\n`;

  story.chapters.forEach((ch, i) => {
    chapterMenu += `${i + 1}. ${ch.title}\n`;
  });

  chapterMenu += `\nOptions:
1 = Add Chapter
2 = Edit Chapter
3 = Delete Chapter
0 = Exit`;

  const choice = prompt(chapterMenu);

  if (!choice) return;

  if (choice === "1") {
    addChapter(storyIndex);
  }

  if (choice === "2") {
    editChapter(storyIndex);
  }

  if (choice === "3") {
    deleteChapter(storyIndex);
  }
}

function addChapter(storyIndex) {
  let stories = getStories();
  let story = stories[storyIndex];

  const title = prompt("Enter Chapter Title:");
  if (!title) return;

  const contentRaw = prompt("Enter Chapter Content (separate lines using || ):\nExample:\nLine1||Line2||Line3");
  if (!contentRaw) return;

  const contentLines = contentRaw.split("||").map(line => line.trim());

  story.chapters.push({
    title: title,
    content: contentLines
  });

  stories[storyIndex] = story;
  saveStories(stories);

  alert("✅ Chapter Added!");
  loadStories();
}

function editChapter(storyIndex) {
  let stories = getStories();
  let story = stories[storyIndex];

  const chapterNumber = prompt(`Enter chapter number to edit (1 - ${story.chapters.length}):`);
  if (!chapterNumber) return;

  const chapterIndex = parseInt(chapterNumber) - 1;

  if (chapterIndex < 0 || chapterIndex >= story.chapters.length) {
    alert("❌ Invalid chapter number!");
    return;
  }

  const chapter = story.chapters[chapterIndex];

  const newTitle = prompt("Edit Chapter Title:", chapter.title);
  if (!newTitle) return;

  const oldContent = chapter.content.join("||");

  const newContentRaw = prompt("Edit Chapter Content (use || for new lines):", oldContent);
  if (!newContentRaw) return;

  chapter.title = newTitle;
  chapter.content = newContentRaw.split("||").map(line => line.trim());

  story.chapters[chapterIndex] = chapter;
  stories[storyIndex] = story;

  saveStories(stories);

  alert("✅ Chapter Updated!");
  loadStories();
}

function deleteChapter(storyIndex) {
  let stories = getStories();
  let story = stories[storyIndex];

  const chapterNumber = prompt(`Enter chapter number to delete (1 - ${story.chapters.length}):`);
  if (!chapterNumber) return;

  const chapterIndex = parseInt(chapterNumber) - 1;

  if (chapterIndex < 0 || chapterIndex >= story.chapters.length) {
    alert("❌ Invalid chapter number!");
    return;
  }

  if (confirm("Are you sure you want to delete this chapter?")) {
    story.chapters.splice(chapterIndex, 1);

    stories[storyIndex] = story;
    saveStories(stories);

    alert("🗑 Chapter Deleted!");
    loadStories();
  }
}
