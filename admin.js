/* ==============================
   ASTRAYUDH ADMIN PANEL (FIREBASE)
   ============================== */

import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

/* ------------------------------
   AUTH SYSTEM
--------------------------------- */

const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
    loadBlogs();
    loadStories();
  } else {
    loginBox.style.display = "block";
    adminPanel.style.display = "none";
  }
});

window.loginAdmin = async function (event) {
  event.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPass").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("✅ Login Successful!");
  } catch (err) {
    alert("❌ Login Failed: " + err.message);
  }
};

window.logoutAdmin = async function () {
  await signOut(auth);
  alert("👋 Logged out!");
};

/* ------------------------------
   SWITCH SECTIONS
--------------------------------- */
window.showSection = function (sectionId) {
  document.getElementById("blogsAdmin").style.display = "none";
  document.getElementById("storiesAdmin").style.display = "none";

  document.getElementById(sectionId).style.display = "block";
};

/* ------------------------------
   BLOGS CRUD (FIRESTORE)
--------------------------------- */

async function loadBlogs() {
  const blogsList = document.getElementById("blogsList");
  blogsList.innerHTML = `<p style="color:#aaa;">Loading blogs...</p>`;

  const querySnapshot = await getDocs(collection(db, "blogs"));

  if (querySnapshot.empty) {
    blogsList.innerHTML = `<p style="color:#b9b9c6;">No blogs added yet.</p>`;
    return;
  }

  let html = "";

  querySnapshot.forEach((docSnap) => {
    const blog = docSnap.data();
    html += `
      <div class="card" style="margin-bottom:18px;">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <p style="margin-top:10px; font-size:13px; color:#ff3d6e;">
          Firestore ID: ${docSnap.id}
        </p>

        <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn primary" onclick="deleteBlog('${docSnap.id}')">🗑 Delete</button>
        </div>
      </div>
    `;
  });

  blogsList.innerHTML = html;
}

window.addBlog = async function () {
  const title = prompt("Enter Blog Title:");
  if (!title) return;

  const excerpt = prompt("Enter Blog Excerpt:");
  if (!excerpt) return;

  const image = prompt("Enter Image Filename (example: blog1.jpg):", "blog1.jpg");

  const contentRaw = prompt(
    "Enter Blog Content (use || for new paragraphs):\nExample:\npara1||para2||para3"
  );
  if (!contentRaw) return;

  const contentArray = contentRaw.split("||").map((p) => p.trim());

  const content = [];
  content.push({ type: "heading", text: title });

  contentArray.forEach((para) => {
    content.push({ type: "paragraph", text: para });
  });

  const blogData = {
    title: title,
    excerpt: excerpt,
    image: image || "blog1.jpg",
    date: new Date().toISOString().split("T")[0],
    content: content
  };

  try {
    await addDoc(collection(db, "blogs"), blogData);
    alert("✅ Blog Added Successfully!");
    loadBlogs();
  } catch (err) {
    alert("❌ Error adding blog: " + err.message);
  }
};

window.deleteBlog = async function (id) {
  if (!confirm("Are you sure you want to delete this blog?")) return;

  try {
    await deleteDoc(doc(db, "blogs", id));
    alert("🗑 Blog Deleted!");
    loadBlogs();
  } catch (err) {
    alert("❌ Error deleting blog: " + err.message);
  }
};

/* ------------------------------
   STORIES CRUD (FIRESTORE)
--------------------------------- */

async function loadStories() {
  const storiesList = document.getElementById("storiesList");
  storiesList.innerHTML = `<p style="color:#aaa;">Loading stories...</p>`;

  const querySnapshot = await getDocs(collection(db, "stories"));

  if (querySnapshot.empty) {
    storiesList.innerHTML = `<p style="color:#b9b9c6;">No stories added yet.</p>`;
    return;
  }

  let html = "";

  querySnapshot.forEach((docSnap) => {
    const story = docSnap.data();

    html += `
      <div class="card" style="margin-bottom:18px;">
        <h3>${story.title}</h3>
        <p>${story.description}</p>

        <p style="margin-top:12px; font-size:13px; color:#ff3d6e;">
          Chapters: ${story.chapters ? story.chapters.length : 0}
        </p>

        <p style="margin-top:10px; font-size:13px; color:#ff3d6e;">
          Firestore ID: ${docSnap.id}
        </p>

        <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn secondary" onclick="addChapter('${docSnap.id}')">➕ Add Chapter</button>
          <button class="btn secondary" onclick="editChapter('${docSnap.id}')">✏️ Edit Chapter</button>
          <button class="btn primary" onclick="deleteStory('${docSnap.id}')">🗑 Delete</button>
        </div>
      </div>
    `;
  });

  storiesList.innerHTML = html;
}

window.addStory = async function () {
  const title = prompt("Enter Story Title:");
  if (!title) return;

  const description = prompt("Enter Story Description:");
  if (!description) return;

  const storyData = {
    title: title,
    description: description,
    chapters: [
      {
        title: "Chapter 1",
        content: ["Write your story here..."]
      }
    ]
  };

  try {
    await addDoc(collection(db, "stories"), storyData);
    alert("✅ Story Added Successfully!");
    loadStories();
  } catch (err) {
    alert("❌ Error adding story: " + err.message);
  }
};

window.deleteStory = async function (id) {
  if (!confirm("Are you sure you want to delete this story?")) return;

  try {
    await deleteDoc(doc(db, "stories", id));
    alert("🗑 Story Deleted!");
    loadStories();
  } catch (err) {
    alert("❌ Error deleting story: " + err.message);
  }
};

/* ------------------------------
   CHAPTER MANAGEMENT
--------------------------------- */

window.addChapter = async function (storyId) {
  const chapterTitle = prompt("Enter Chapter Title:");
  if (!chapterTitle) return;

  const contentRaw = prompt("Enter Chapter Content (use || for new lines):");
  if (!contentRaw) return;

  const lines = contentRaw.split("||").map((l) => l.trim());

  const storyRef = doc(db, "stories", storyId);

  try {
    // Load existing story
    const snapshot = await getDocs(collection(db, "stories"));
    let storyData = null;

    snapshot.forEach((docSnap) => {
      if (docSnap.id === storyId) storyData = docSnap.data();
    });

    if (!storyData) {
      alert("❌ Story not found!");
      return;
    }

    if (!storyData.chapters) storyData.chapters = [];

    storyData.chapters.push({
      title: chapterTitle,
      content: lines
    });

    await updateDoc(storyRef, {
      chapters: storyData.chapters
    });

    alert("✅ Chapter Added!");
    loadStories();
  } catch (err) {
    alert("❌ Error adding chapter: " + err.message);
  }
};

window.editChapter = async function (storyId) {
  const chapterNum = prompt("Enter chapter number to edit (1,2,3...):");
  if (!chapterNum) return;

  const chapterIndex = parseInt(chapterNum) - 1;

  try {
    const snapshot = await getDocs(collection(db, "stories"));
    let storyData = null;

    snapshot.forEach((docSnap) => {
      if (docSnap.id === storyId) storyData = docSnap.data();
    });

    if (!storyData) {
      alert("❌ Story not found!");
      return;
    }

    if (!storyData.chapters || storyData.chapters.length === 0) {
      alert("❌ No chapters found!");
      return;
    }

    if (chapterIndex < 0 || chapterIndex >= storyData.chapters.length) {
      alert("❌ Invalid chapter number!");
      return;
    }

    const chapter = storyData.chapters[chapterIndex];

    const newTitle = prompt("Edit Chapter Title:", chapter.title);
    if (!newTitle) return;

    const newContentRaw = prompt(
      "Edit Chapter Content (use || for new lines):",
      chapter.content.join("||")
    );
    if (!newContentRaw) return;

    chapter.title = newTitle;
    chapter.content = newContentRaw.split("||").map((l) => l.trim());

    storyData.chapters[chapterIndex] = chapter;

    await updateDoc(doc(db, "stories", storyId), {
      chapters: storyData.chapters
    });

    alert("✅ Chapter Updated!");
    loadStories();
  } catch (err) {
    alert("❌ Error editing chapter: " + err.message);
  }
};
