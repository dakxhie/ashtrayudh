const storyTitle = document.getElementById("storyTitle");
const storyDesc = document.getElementById("storyDesc");
const chaptersList = document.getElementById("chaptersList");
const chapterTitle = document.getElementById("chapterTitle");
const chapterContent = document.getElementById("chapterContent");

// Get story id from URL
const params = new URLSearchParams(window.location.search);
const storyId = params.get("id");

let currentStory = null;

async function loadStory() {
  try {
    const response = await fetch("stories.json");
    const data = await response.json();

    const story = data.stories.find((s) => s.id === storyId);

    if (!story) {
      storyTitle.innerText = "Story Not Found";
      storyDesc.innerText = "This story does not exist.";
      return;
    }

    currentStory = story;

    storyTitle.innerText = story.title;
    storyDesc.innerText = story.description;

    chaptersList.innerHTML = "";

    story.chapters.forEach((chapter) => {
      const btn = document.createElement("button");
      btn.classList.add("chapter-btn");
      btn.innerText = `Chapter ${chapter.chapter}: ${chapter.title}`;

      btn.addEventListener("click", () => {
        displayChapter(chapter);
      });

      chaptersList.appendChild(btn);
    });

    // Auto open first chapter
    if (story.chapters.length > 0) {
      displayChapter(story.chapters[0]);
    }

  } catch (error) {
    storyTitle.innerText = "Error Loading Story";
    storyDesc.innerText = "Could not load stories.json";
  }
}

function displayChapter(chapter) {
  chapterTitle.innerText = `Chapter ${chapter.chapter}: ${chapter.title}`;
  chapterContent.innerHTML = "";

  chapter.content.forEach((line) => {
    const p = document.createElement("p");
    p.innerText = line;
    chapterContent.appendChild(p);
  });

  // Highlight active chapter button
  document.querySelectorAll(".chapter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = [...document.querySelectorAll(".chapter-btn")].find((b) =>
    b.innerText.includes(chapter.title)
  );

  if (activeBtn) activeBtn.classList.add("active");
}

loadStory();
