/* --------------------------------------
   main.js - Frontend interactions
-----------------------------------------*/

// Smooth scroll for anchor links (if used in the future)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Fetch and render blogs dynamically (placeholder for future)
async function loadBlogs() {
  try {
    const response = await fetch('data/blogs.json');
    if (!response.ok) throw new Error('Failed to fetch blogs data');

    const blogs = await response.json();
    const blogsContainer = document.querySelector('#blogs-container');
    if (!blogsContainer) return; // Only run on blogs page

    blogsContainer.innerHTML = ''; // Clear container

    blogs.forEach(blog => {
      const blogCard = document.createElement('div');
      blogCard.className = 'card';
      blogCard.innerHTML = `
        <img src="${blog.featuredImage}" alt="${blog.title}">
        <h3>${blog.title}</h3>
        <p>${blog.excerpt}</p>
        <a href="blog-template.html?id=${blog.id}" class="btn-cta">Read More</a>
      `;
      blogsContainer.appendChild(blogCard);
    });
  } catch (error) {
    console.error('Error loading blogs:', error);
  }
}

// Fetch and render stories dynamically (placeholder for future)
async function loadStories() {
  try {
    const response = await fetch('data/stories.json');
    if (!response.ok) throw new Error('Failed to fetch stories data');

    const stories = await response.json();
    const storiesContainer = document.querySelector('#stories-container');
    if (!storiesContainer) return; // Only run on stories page

    storiesContainer.innerHTML = ''; // Clear container

    stories.forEach(story => {
      const storyCard = document.createElement('div');
      storyCard.className = 'card';
      storyCard.innerHTML = `
        <h3>${story.title}</h3>
        <p>${story.description}</p>
        <a href="story-template.html?id=${story.id}" class="btn-cta">Read Story</a>
      `;
      storiesContainer.appendChild(storyCard);
    });
  } catch (error) {
    console.error('Error loading stories:', error);
  }
}

// Initialize functions
document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
  loadStories();
});
