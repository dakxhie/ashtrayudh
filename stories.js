const storiesContainer = document.getElementById("storiesContainer");

async function loadStories() {
  try {
    const response = await fetch("stories.json");
    const data = await response.json();

    storiesContainer.innerHTML = "";

    data.stories.forEach((story) => {
      const storyCard = document.createElement("div");
      storyCard.classList.add("card");

      storyCard.innerHTML = `
        <img src="${story.image}" alt="${story.title}" class="blog-img">
        <h3>${story.title}</h3>
        <p>${story.description}</p>
        <p style="margin-top: 12px; color: #b9b9c6; font-size: 14px;">
          Chapters: <b style="color:white;">${story.chapters.length}</b>
        </p>
        <a href="story-view.html?id=${story.id}" class="btn primary" style="margin-top: 18px; display:inline-block;">
          Read Story
        </a>
      `;

      storiesContainer.appendChild(storyCard);
    });

  } catch (error) {
    storiesContainer.innerHTML = `
      <div class="card">
        <h3>Error Loading Stories</h3>
        <p>stories.json not found or invalid. Please check setup.</p>
      </div>
    `;
  }
}

loadStories();
