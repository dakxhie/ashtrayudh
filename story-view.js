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
  // update progress when chapter changed
  if (typeof updateProgress === 'function') updateProgress();
}

// Reading progress handler for story reader
function updateProgress() {
  const chapterContent = document.getElementById('chapterContent');
  const progressBar = document.getElementById('progressBar');
  if (!chapterContent || !progressBar) return;

  const articleTop = chapterContent.getBoundingClientRect().top + window.scrollY;
  const articleHeight = chapterContent.offsetHeight;
  const winCentre = window.scrollY + window.innerHeight / 2;
  let progress = (winCentre - articleTop) / Math.max(1, articleHeight);
  progress = Math.max(0, Math.min(1, progress));
  progressBar.style.width = (progress * 100) + "%";
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
    // Load from local JSON first
    let story = null;
    
    try {
      const response = await fetch("stories.json");
      if (response.ok) {
        const data = await response.json();
        const stories = data.stories || [];
        story = stories.find(s => s.id === storyId);
      }
    } catch (e) {
      console.warn("Could not load from JSON, trying Firestore...", e);
    }

    // Fallback to Firestore if JSON unavailable
    if (!story) {
      try {
        const storyRef = doc(db, "stories", storyId);
        const storySnap = await getDoc(storyRef);
        if (storySnap.exists()) {
          story = storySnap.data();
        }
      } catch (e) {
        console.warn("Firestore fetch failed", e);
      }
    }

    if (!story) {
      storyTitle.innerText = "Story not found";
      return;
    }

    storyData = story;

    storyTitle.innerText = storyData.title || "Untitled Story";
    storyDesc.innerText = storyData.description || "No description available.";

    // Breadcrumb
    const bc = document.getElementById('storyBreadcrumbTitle');
    if (bc) bc.innerText = storyData.title || 'Story';

    // reading meta (chapters + est time)
    try {
      let totalText = '';
      if (storyData.chapters && Array.isArray(storyData.chapters)) {
        storyData.chapters.forEach(ch => {
          if (ch.content) {
            if (Array.isArray(ch.content)) totalText += ' ' + ch.content.join(' ');
            else totalText += ' ' + String(ch.content);
          }
        });
      }
      const plain = totalText.replace(/<[^>]+>/g, ' ');
      const words = plain.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.round(words / 200));
      const metaEl = document.getElementById('readingMeta');
      if (metaEl) metaEl.innerText = `${storyData.chapters ? storyData.chapters.length : 0} chapters • ${minutes} min read`;
    } catch (e) {
      // ignore
    }

    renderChaptersList();
    renderChapter(0);

    // attach scroll listeners for reading progress
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    setTimeout(updateProgress, 300);

  } catch (error) {
    console.error("Error loading story:", error);
    storyTitle.innerText = "Error loading story";
  }
}

loadStory();
