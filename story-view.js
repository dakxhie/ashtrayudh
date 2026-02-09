import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

function getStoryId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let storyData = null;
let currentChapterIndex = 0;

function renderChapter(index) {
  const chapterTitle = document.getElementById("chapterTitle");
  const chapterContent = document.getElementById("chapterContent");

  if (!chapterTitle || !chapterContent) {
    console.error("Required DOM elements not found");
    return;
  }

  if (!storyData || !storyData.chapters || storyData.chapters.length === 0) {
    chapterTitle.innerText = "No chapters found";
    chapterContent.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This story has no chapters yet.</p>";
    return;
  }

  if (index < 0 || index >= storyData.chapters.length) {
    console.error("Invalid chapter index:", index);
    return;
  }

  const chapter = storyData.chapters[index];

  chapterTitle.innerText = chapter.title || "Untitled Chapter";

  let html = "";
  if (chapter.content && Array.isArray(chapter.content)) {
    chapter.content.forEach((para) => {
      html += `<p>${para || ""}</p>`;
    });
  } else {
    html = "<p>No content available.</p>";
  }

  chapterContent.innerHTML = html || "<p>No content available.</p>";

  // highlight active chapter
  document.querySelectorAll(".chapter-link").forEach((btn, i) => {
    if (i === index) btn.classList.add("active");
    else btn.classList.remove("active");
  });
}

function renderChaptersList() {
  const chapterList = document.getElementById("chapterList");

  if (!chapterList) {
    console.error("chapterList element not found");
    return;
  }

  if (!storyData.chapters || storyData.chapters.length === 0) {
    chapterList.innerHTML = `<p style="color:rgba(255,255,255,0.6);">No chapters available.</p>`;
    return;
  }

  chapterList.innerHTML = storyData.chapters.map((ch, index) => `
    <button class="chapter-link" onclick="window.openChapter(${index})">
      ${index + 1}. ${ch.title || "Untitled"}
    </button>
  `).join("");
}

window.openChapter = function (index) {
  currentChapterIndex = index;
  renderChapter(index);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.nextChapter = function () {
  if (!storyData || !storyData.chapters) return;

  if (currentChapterIndex < storyData.chapters.length - 1) {
    currentChapterIndex++;
    renderChapter(currentChapterIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.prevChapter = function () {
  if (currentChapterIndex > 0) {
    currentChapterIndex--;
    renderChapter(currentChapterIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

async function loadStory() {
  const storyId = getStoryId();

  const storyTitle = document.getElementById("storyTitle");
  const storyDesc = document.getElementById("storyDesc");

  if (!storyTitle || !storyDesc) {
    console.error("Required DOM elements not found");
    return;
  }

  if (!storyId) {
    storyTitle.innerText = "Story not found";
    return;
  }

  try {
    const storyRef = doc(db, "stories", storyId);
    const storySnap = await getDoc(storyRef);

    if (!storySnap.exists()) {
      storyTitle.innerText = "Story not found";
      return;
    }

    storyData = storySnap.data();

    if (!storyData) {
      storyTitle.innerText = "Story not found";
      return;
    }

    storyTitle.innerText = storyData.title || "Untitled Story";
    storyDesc.innerText = storyData.description || "No description available.";

    renderChaptersList();
    renderChapter(0);

  } catch (error) {
    console.error("Error loading story:", error);
    storyTitle.innerText = "Error loading story";
  }
}

loadStory();
