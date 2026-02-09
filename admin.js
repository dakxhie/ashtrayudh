/**
 * ASTRAYUDH ADMIN PANEL
 * Complete Firebase I integration with modern UI
 */

import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogPublished,
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
  toggleStoryPublished,
  getChapters,
  createChapter,
  updateChapter,
  deleteChapter
} from "./firestoreService.js";

import {
  showToast,
  showSuccess,
  showError,
  showConfirmModal,
  showInputModal,
  showTextAreaModal
} from "./utils.js";

// ===== STATE =====
let currentUser = null;
let allBlogs = [];
let allStories = [];
let selectedStoryForChapters = null;

// ===== DOM ELEMENTS =====
const loginScreen = document.getElementById("loginScreen");
const adminDashboard = document.getElementById("adminDashboard");

// ===== AUTH MANAGEMENT =====
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    loginScreen.style.display = "none";
    adminDashboard.style.display = "flex";
    loadDashboardData();
  } else {
    loginScreen.style.display = "flex";
    adminDashboard.style.display = "none";
  }
});

window.handleLogin = async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const loginBtn = document.getElementById("loginBtn");
  const loginError = document.getElementById("loginError");

  loginBtn.classList.add("login-loading");
  loginError.style.display = "none";

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showSuccess("Login successful!");
  } catch (err) {
    loginError.textContent = err.message;
    loginError.style.display = "inline";
    showError("Login failed");
  } finally {
    loginBtn.classList.remove("login-loading");
  }
};

window.handleLogout = async () => {
  showConfirmModal(
    "Logout",
    "Are you sure you want to logout?",
    async () => {
      try {
        await signOut(auth);
        showSuccess("Logged out");
      } catch (err) {
        showError("Logout failed");
      }
    }
  );
};

// ===== SECTION SWITCHING =====
window.switchSection = (section) => {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((el) => {
    el.classList.remove("active");
  });

  // Remove active from all nav items
  document.querySelectorAll(".nav-item").forEach((el) => {
    el.classList.remove("active");
  });

  // Show selected section
  const sectionEl = document.getElementById(`${section}-section`);
  if (sectionEl) {
    sectionEl.classList.add("active");
    const navBtn = document.querySelector(`.nav-item[onclick*="${section}"]`);
    if (navBtn) navBtn.classList.add("active");
  }

  // Load data if needed
  if (section === "blogs") loadBlogs();
  if (section === "stories") loadStories();
  if (section === "chapters") loadChaptersSection();
};

// ===== DASHBOARD =====
async function loadDashboardData() {
  try {
    const blogs = await getAllBlogs();
    const stories = await getAllStories();

    const publishedBlogs = blogs.filter((b) => b.published).length;
    const publishedStories = stories.filter((s) => s.published).length;

    let totalChapters = 0;
    for (const story of stories) {
      const chapters = await getChapters(story.id);
      totalChapters += chapters.length;
    }

    document.getElementById("totalBlogs").textContent = blogs.length;
    document.getElementById("publishedBlogsCount").textContent = publishedBlogs;
    document.getElementById("totalStories").textContent = stories.length;
    document.getElementById("publishedStoriesCount").textContent = publishedStories;
    document.getElementById("totalChapters").textContent = totalChapters;

    allBlogs = blogs;
    allStories = stories;
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    showError("Failed to load dashboard data");
  }
}

// ===== BLOGS =====
async function loadBlogs() {
  const blogsList = document.getElementById("blogsList");
  blogsList.innerHTML = `<div class="empty-state"><p>Loading blogs...</p></div>`;

  try {
    allBlogs = await getAllBlogs();

    if (allBlogs.length === 0) {
      blogsList.innerHTML = `
        <div class="empty-state">
          <h3>No blogs yet</h3>
          <p>Create your first blog to get started</p>
        </div>
      `;
      return;
    }

    renderBlogsList(allBlogs);
  } catch (err) {
    console.error("Error loading blogs:", err);
    showError("Failed to load blogs");
    blogsList.innerHTML = `<div class="empty-state"><h3>Error loading blogs</h3></div>`;
  }
}

function renderBlogsList(blogs) {
  const blogsList = document.getElementById("blogsList");
  const search = document.getElementById("blogsSearch")?.value.toLowerCase() || "";
  const filter = document.getElementById("blogsFilter")?.value || "all";

  let filtered = blogs;

  // Search filter
  if (search) {
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(search) ||
        (b.subtitle && b.subtitle.toLowerCase().includes(search))
    );
  }

  // Published/Draft filter
  if (filter === "published") {
    filtered = filtered.filter((b) => b.published);
  } else if (filter === "draft") {
    filtered = filtered.filter((b) => !b.published);
  }

  if (filtered.length === 0) {
    blogsList.innerHTML = `<div class="empty-state"><p>No blogs match your filter</p></div>`;
    return;
  }

  blogsList.innerHTML = filtered
    .map(
      (blog) => `
      <div class="content-card">
        <div class="content-card-body">
          <div class="content-card-title">${blog.title}</div>
          <div class="content-card-meta">
            <span>${blog.subtitle || "No subtitle"}</span>
            <span class="status-badge ${blog.published ? "status-published" : "status-draft"}">
              ${blog.published ? "Published" : "Draft"}
            </span>
          </div>
          <div class="content-card-desc">
            ${blog.description || "No description"}
          </div>
        </div>
        <div class="content-card-actions">
          <button class="btn-secondary" onclick="window.editBlog('${blog.id}')">✏️ Edit</button>
          <button class="btn-secondary" onclick="window.toggleBlogPublish('${blog.id}', ${!blog.published})">
            ${blog.published ? "📌 Unpublish" : "📤 Publish"}
          </button>
          <button class="btn-danger" onclick="window.deleteBlogConfirm('${blog.id}')">🗑 Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.createNewBlog = () => {
  showInputModal(
    "New Blog",
    "Blog Title",
    "e.g., My Awesome Blog Post",
    "",
    async (title) => {
      showInputModal(
        "New Blog",
        "Blog Subtitle",
        "e.g., A brief description",
        "",
        async (subtitle) => {
          showTextAreaModal(
            "New Blog",
            "Blog Content",
            "Write your blog content here...",
            "",
            async (content) => {
              try {
                await createBlog({
                  title,
                  subtitle,
                  description: subtitle,
                  content,
                  published: false
                });
                showSuccess("Blog created successfully");
                await loadBlogs();
              } catch (err) {
                console.error("Error creating blog:", err);
                showError("Failed to create blog");
              }
            }
          );
        }
      );
    }
  );
};

window.editBlog = (blogId) => {
  const blog = allBlogs.find((b) => b.id === blogId);
  if (!blog) return;

  showInputModal(
    "Edit Blog",
    "Blog Title",
    "e.g., My Awesome Blog Post",
    blog.title,
    async (title) => {
      showInputModal(
        "Edit Blog",
        "Blog Subtitle",
        "e.g., A brief description",
        blog.subtitle || "",
        async (subtitle) => {
          showTextAreaModal(
            "Edit Blog",
            "Blog Content",
            "Write your blog content here...",
            blog.content || "",
            async (content) => {
              try {
                await updateBlog(blogId, {
                  title,
                  subtitle,
                  description: subtitle,
                  content
                });
                showSuccess("Blog updated successfully");
                await loadBlogs();
              } catch (err) {
                console.error("Error updating blog:", err);
                showError("Failed to update blog");
              }
            }
          );
        }
      );
    }
  );
};

window.toggleBlogPublish = async (blogId, shouldPublish) => {
  try {
    await toggleBlogPublished(blogId, shouldPublish);
    showSuccess(shouldPublish ? "Blog published" : "Blog unpublished");
    await loadBlogs();
    await loadDashboardData();
  } catch (err) {
    console.error("Error toggling publish status:", err);
    showError("Failed to update publish status");
  }
};

window.deleteBlogConfirm = (blogId) => {
  const blog = allBlogs.find((b) => b.id === blogId);
  if (!blog) return;

  showConfirmModal(
    "Delete Blog",
    `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
    async () => {
      try {
        await deleteBlog(blogId);
        showSuccess("Blog deleted successfully");
        await loadBlogs();
        await loadDashboardData();
      } catch (err) {
        console.error("Error deleting blog:", err);
        showError("Failed to delete blog");
      }
    }
  );
};

// Setup search and filter listeners
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("blogsSearch")?.addEventListener("input", () => {
    renderBlogsList(allBlogs);
  });

  document.getElementById("blogsFilter")?.addEventListener("change", () => {
    renderBlogsList(allBlogs);
  });

  document.getElementById("storiesSearch")?.addEventListener("input", () => {
    renderStoriesList(allStories);
  });

  document.getElementById("storiesFilter")?.addEventListener("change", () => {
    renderStoriesList(allStories);
  });
});

// ===== STORIES =====
async function loadStories() {
  const storiesList = document.getElementById("storiesList");
  storiesList.innerHTML = `<div class="empty-state"><p>Loading stories...</p></div>`;

  try {
    allStories = await getAllStories();

    if (allStories.length === 0) {
      storiesList.innerHTML = `
        <div class="empty-state">
          <h3>No stories yet</h3>
          <p>Create your first story to get started</p>
        </div>
      `;
      return;
    }

    renderStoriesList(allStories);
  } catch (err) {
    console.error("Error loading stories:", err);
    showError("Failed to load stories");
    storiesList.innerHTML = `<div class="empty-state"><h3>Error loading stories</h3></div>`;
  }
}

function renderStoriesList(stories) {
  const storiesList = document.getElementById("storiesList");
  const search = document.getElementById("storiesSearch")?.value.toLowerCase() || "";
  const filter = document.getElementById("storiesFilter")?.value || "all";

  let filtered = stories;

  // Search filter
  if (search) {
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(search) ||
        (s.description && s.description.toLowerCase().includes(search))
    );
  }

  // Published/Draft filter
  if (filter === "published") {
    filtered = filtered.filter((s) => s.published);
  } else if (filter === "draft") {
    filtered = filtered.filter((s) => !s.published);
  }

  if (filtered.length === 0) {
    storiesList.innerHTML = `<div class="empty-state"><p>No stories match your filter</p></div>`;
    return;
  }

  storiesList.innerHTML = filtered
    .map(
      (story) => `
      <div class="content-card">
        <div class="content-card-body">
          <div class="content-card-title">${story.title}</div>
          <div class="content-card-meta">
            <span>${story.description || "No description"}</span>
            <span class="status-badge ${story.published ? "status-published" : "status-draft"}">
              ${story.published ? "Published" : "Draft"}
            </span>
          </div>
        </div>
        <div class="content-card-actions">
          <button class="btn-secondary" onclick="window.editStory('${story.id}')">✏️ Edit</button>
          <button class="btn-secondary" onclick="window.toggleStoryPublish('${story.id}', ${!story.published})">
            ${story.published ? "📌 Unpublish" : "📤 Publish"}
          </button>
          <button class="btn-danger" onclick="window.deleteStoryConfirm('${story.id}')">🗑 Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

window.createNewStory = () => {
  showInputModal(
    "New Story",
    "Story Title",
    "e.g., My Awesome Story",
    "",
    async (title) => {
      showInputModal(
        "New Story",
        "Story Description",
        "e.g., A journey of...",
        "",
        async (description) => {
          try {
            await createStory({
              title,
              description,
              published: false
            });
            showSuccess("Story created successfully");
            await loadStories();
            await loadDashboardData();
          } catch (err) {
            console.error("Error creating story:", err);
            showError("Failed to create story");
          }
        }
      );
    }
  );
};

window.editStory = (storyId) => {
  const story = allStories.find((s) => s.id === storyId);
  if (!story) return;

  showInputModal(
    "Edit Story",
    "Story Title",
    "e.g., My Awesome Story",
    story.title,
    async (title) => {
      showInputModal(
        "Edit Story",
        "Story Description",
        "e.g., A journey of...",
        story.description || "",
        async (description) => {
          try {
            await updateStory(storyId, {
              title,
              description
            });
            showSuccess("Story updated successfully");
            await loadStories();
          } catch (err) {
            console.error("Error updating story:", err);
            showError("Failed to update story");
          }
        }
      );
    }
  );
};

window.toggleStoryPublish = async (storyId, shouldPublish) => {
  try {
    await toggleStoryPublished(storyId, shouldPublish);
    showSuccess(shouldPublish ? "Story published" : "Story unpublished");
    await loadStories();
    await loadDashboardData();
  } catch (err) {
    console.error("Error toggling publish status:", err);
    showError("Failed to update publish status");
  }
};

window.deleteStoryConfirm = (storyId) => {
  const story = allStories.find((s) => s.id === storyId);
  if (!story) return;

  showConfirmModal(
    "Delete Story",
    `Are you sure you want to delete "${story.title}" and all its chapters? This action cannot be undone.`,
    async () => {
      try {
        await deleteStory(storyId);
        showSuccess("Story deleted successfully");
        await loadStories();
        await loadDashboardData();
      } catch (err) {
        console.error("Error deleting story:", err);
        showError("Failed to delete story");
      }
    }
  );
};

// ===== CHAPTERS =====
async function loadChaptersSection() {
  const dropdown = document.getElementById("chaptersStoryDropdown");
  const chaptersList = document.getElementById("chaptersList");

  try {
    allStories = await getAllStories();

    // Populate story dropdown
    dropdown.innerHTML = '<option value="">Choose a story...</option>' +
      allStories
        .map((s) => `<option value="${s.id}">${s.title}</option>`)
        .join("");

    chaptersList.innerHTML = '<div class="empty-state"><p>Select a story to view chapters</p></div>';
  } catch (err) {
    console.error("Error loading chapters section:", err);
    showError("Failed to load stories");
  }
}

document.addEventListener("change", async (e) => {
  if (e.target.id === "chaptersStoryDropdown") {
    const storyId = e.target.value;
    if (storyId) {
      selectedStoryForChapters = storyId;
      await loadChaptersForStory(storyId);
    }
  }
});

async function loadChaptersForStory(storyId) {
  const chaptersList = document.getElementById("chaptersList");
  chaptersList.innerHTML = `<div class="empty-state"><p>Loading chapters...</p></div>`;

  try {
    const chapters = await getChapters(storyId);

    if (chapters.length === 0) {
      chaptersList.innerHTML = `
        <div class="empty-state">
          <h3>No chapters yet</h3>
          <p>Create your first chapter for this story</p>
          <button class="btn-primary" onclick="window.createNewChapter('${storyId}')" style="margin-top: 15px;">
            ＋ New Chapter
          </button>
        </div>
      `;
      return;
    }

    chaptersList.innerHTML = chapters
      .map(
        (chapter, index) => `
      <div class="content-card">
        <div class="content-card-body">
          <div class="content-card-title">Chapter ${chapter.chapterNumber}: ${chapter.title}</div>
          <div class="content-card-desc">
            ${chapter.content.substring(0, 100)}...
          </div>
        </div>
        <div class="content-card-actions">
          <button class="btn-secondary" onclick="window.editChapter('${storyId}', '${chapter.id}')">✏️ Edit</button>
          <button class="btn-danger" onclick="window.deleteChapterConfirm('${storyId}', '${chapter.id}')">🗑 Delete</button>
        </div>
      </div>
    `
      )
      .join("");

    // Add button at the bottom
    const addBtn = document.createElement("button");
    addBtn.className = "btn-primary";
    addBtn.textContent = "＋ New Chapter";
    addBtn.onclick = () => window.createNewChapter(storyId);
    addBtn.style.marginTop = "20px";
    chaptersList.appendChild(addBtn);
  } catch (err) {
    console.error("Error loading chapters:", err);
    showError("Failed to load chapters");
    chaptersList.innerHTML = `<div class="empty-state"><h3>Error loading chapters</h3></div>`;
  }
}

window.createNewChapter = (storyId) => {
  if (!storyId || !selectedStoryForChapters) {
    showError("Please select a story first");
    return;
  }

  showInputModal(
    "New Chapter",
    "Chapter Title",
    "e.g., The Beginning",
    "",
    async (title) => {
      showTextAreaModal(
        "New Chapter",
        "Chapter Content",
        "Write your chapter content here...",
        "",
        async (content) => {
          try {
            await createChapter(storyId, {
              title,
              content
            });
            showSuccess("Chapter created successfully");
            await loadChaptersForStory(storyId);
          } catch (err) {
            console.error("Error creating chapter:", err);
            showError("Failed to create chapter");
          }
        }
      );
    }
  );
};

window.editChapter = (storyId, chapterId) => {
  const chapters = Array.from(document.querySelectorAll(".content-card-title")).map(
    (el) => el.textContent
  );

  showInputModal(
    "Edit Chapter",
    "Chapter Title",
    "e.g., The Beginning",
    "",
    async (title) => {
      showTextAreaModal(
        "Edit Chapter",
        "Chapter Content",
        "Write your chapter content here...",
        "",
        async (content) => {
          try {
            await updateChapter(storyId, chapterId, {
              title,
              content
            });
            showSuccess("Chapter updated successfully");
            await loadChaptersForStory(storyId);
          } catch (err) {
            console.error("Error updating chapter:", err);
            showError("Failed to update chapter");
          }
        }
      );
    }
  );
};

window.deleteChapterConfirm = (storyId, chapterId) => {
  showConfirmModal(
    "Delete Chapter",
    "Are you sure you want to delete this chapter? This action cannot be undone.",
    async () => {
      try {
        await deleteChapter(storyId, chapterId);
        showSuccess("Chapter deleted successfully");
        await loadChaptersForStory(storyId);
      } catch (err) {
        console.error("Error deleting chapter:", err);
        showError("Failed to delete chapter");
      }
    }
  );
};
