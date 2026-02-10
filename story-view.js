import { getStoryWithChapters } from "./firestoreService.js";

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

  chapterTitle.innerText = `Chapter ${chapter.chapterNumber}: ${chapter.title || "Untitled Chapter"}`;

  let html = "";
  
  // Handle content - can be string or array
  if (chapter.content) {
    if (typeof chapter.content === "string") {
      // If content is a string, render as paragraphs
      const paragraphs = chapter.content.split("\n\n").filter(p => p.trim());
      paragraphs.forEach((para) => {
        if (para.trim()) {
          html += `<p>${para.trim()}</p>`;
        }
      });
    } else if (Array.isArray(chapter.content)) {
      // If content is array of objects or strings
      chapter.content.forEach((block) => {
        if (typeof block === "string") {
          html += `<p>${block || ""}</p>`;
        } else if (block.type === "paragraph") {
          html += `<p>${block.text || ""}</p>`;
        }
      });
    }
  }

  if (!html) {
    html = "<p>No content available.</p>";
  }

  chapterContent.innerHTML = html;

  // Highlight active chapter
  document.querySelectorAll(".chapter-link").forEach((btn, i) => {
    if (i === index) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  
  // Update progress when chapter changed
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
      ${ch.chapterNumber || index + 1}. ${ch.title || "Untitled"}
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
    console.log("[STORY-VIEW] 🔄 Loading story with ID:", storyId);
    // Fetch story with chapters from Firestore
    const story = await getStoryWithChapters(storyId);
    console.log("[STORY-VIEW] ✅ Story fetched:", story);

    if (!story) {
      storyTitle.innerText = "Story not found";
      console.warn("[STORY-VIEW] Story document not found in Firestore");
      return;
    }

    // Check if story is published
    if (!story.published) {
      storyTitle.innerText = "Story not published";
      storyDesc.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>This story is still in draft status.</p>";
      console.warn(`[STORY-VIEW] Story ${storyId} is not published (published=${story.published})`);
      return;
    }

    console.log("[STORY-VIEW] ✅ Story is published, rendering content...");

    storyData = story;

    storyTitle.innerText = storyData.title || "Untitled Story";
    storyDesc.innerText = storyData.description || "No description available.";

    // Breadcrumb
    const bc = document.getElementById('storyBreadcrumbTitle');
    if (bc) bc.innerText = storyData.title || 'Story';

    // Set hero image background
    const heroImage = document.getElementById("storyHeroImage");
    if (storyData.imageUrl && heroImage) {
      heroImage.style.backgroundImage = `url('${storyData.imageUrl}')`;
    } else if (storyData.featuredImage && heroImage) {
      heroImage.style.backgroundImage = `url('${storyData.featuredImage}')`;
    }

    // Reading meta (chapters + estimated time)
    try {
      let totalText = '';
      if (storyData.chapters && Array.isArray(storyData.chapters)) {
        storyData.chapters.forEach(ch => {
          if (ch.content) {
            if (typeof ch.content === "string") {
              totalText += ' ' + ch.content;
            } else if (Array.isArray(ch.content)) {
              totalText += ' ' + ch.content.join(' ');
            }
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

    // Attach scroll listeners for reading progress
    window.addEventListener('scroll', updateProgress);
    window.addEventListener('resize', updateProgress);
    setTimeout(updateProgress, 300);

  } catch (error) {
    console.error("[STORY-VIEW] ❌ Error loading story:", error);
    console.error("[STORY-VIEW] Error message:", error.message);
    console.error("[STORY-VIEW] Error code:", error.code);
    storyTitle.innerText = "Error loading story";
    storyDesc.innerHTML = "<p style='color:rgba(255,255,255,0.6);'>Something went wrong. Please refresh the page.</p>";
  }
}

loadStory();
