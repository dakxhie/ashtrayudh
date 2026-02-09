/**
 * Firestore Service Layer
 * Handles all CRUD operations for blogs, stories, and chapters
 * Provides a clean API for the admin panel and public pages
 */

import { db } from "./firebase.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// ========== BLOGS ==========

/**
 * Get all published blogs (for public pages)
 */
export async function getPublishedBlogs() {
  try {
    const q = query(
      collection(db, "blogs"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const blogs = [];
    snapshot.forEach((docSnap) => {
      blogs.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    throw error;
  }
}

/**
 * Get all blogs including drafts (for admin)
 */
export async function getAllBlogs() {
  try {
    const q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const blogs = [];
    snapshot.forEach((docSnap) => {
      blogs.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    throw error;
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(blogId) {
  try {
    const docRef = doc(db, "blogs", blogId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      console.error("Blog not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
}

/**
 * Create a new blog
 */
export async function createBlog(blogData) {
  try {
    const dataWithTimestamps = {
      title: blogData.title,
      subtitle: blogData.subtitle || "",
      description: blogData.description || "",
      content: blogData.content || "",
      imageUrl: blogData.imageUrl || "",
      tags: blogData.tags || [],
      published: blogData.published || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "blogs"), dataWithTimestamps);
    return {
      id: docRef.id,
      ...dataWithTimestamps,
    };
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
}

/**
 * Update a blog
 */
export async function updateBlog(blogId, updates) {
  try {
    const docRef = doc(db, "blogs", blogId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: blogId, ...updates };
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(blogId) {
  try {
    await deleteDoc(doc(db, "blogs", blogId));
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
}

/**
 * Toggle publish status of a blog
 */
export async function toggleBlogPublished(blogId, published) {
  return updateBlog(blogId, { published });
}

// ========== STORIES ==========

/**
 * Get all published stories (for public pages)
 */
export async function getPublishedStories() {
  try {
    const q = query(
      collection(db, "stories"),
      where("published", "==", true),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const stories = [];
    snapshot.forEach((docSnap) => {
      stories.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return stories;
  } catch (error) {
    console.error("Error fetching published stories:", error);
    throw error;
  }
}

/**
 * Get all stories including drafts (for admin)
 */
export async function getAllStories() {
  try {
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const stories = [];
    snapshot.forEach((docSnap) => {
      stories.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return stories;
  } catch (error) {
    console.error("Error fetching all stories:", error);
    throw error;
  }
}

/**
 * Get a story with its chapters
 */
export async function getStoryWithChapters(storyId) {
  try {
    // Get story
    const storyRef = doc(db, "stories", storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      console.error("Story not found");
      return null;
    }

    const story = {
      id: storySnap.id,
      ...storySnap.data(),
    };

    // Get chapters
    const chaptersRef = collection(db, "stories", storyId, "chapters");
    const q = query(chaptersRef, orderBy("chapterNumber", "asc"));
    const chaptersSnap = await getDocs(q);
    
    story.chapters = [];
    chaptersSnap.forEach((docSnap) => {
      story.chapters.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });

    return story;
  } catch (error) {
    console.error("Error fetching story with chapters:", error);
    throw error;
  }
}

/**
 * Create a new story
 */
export async function createStory(storyData) {
  try {
    const dataWithTimestamps = {
      title: storyData.title,
      description: storyData.description || "",
      coverImageUrl: storyData.coverImageUrl || "",
      published: storyData.published || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "stories"), dataWithTimestamps);
    return {
      id: docRef.id,
      ...dataWithTimestamps,
      chapters: [],
    };
  } catch (error) {
    console.error("Error creating story:", error);
    throw error;
  }
}

/**
 * Update a story
 */
export async function updateStory(storyId, updates) {
  try {
    const docRef = doc(db, "stories", storyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: storyId, ...updates };
  } catch (error) {
    console.error("Error updating story:", error);
    throw error;
  }
}

/**
 * Delete a story and all its chapters
 */
export async function deleteStory(storyId) {
  try {
    const batch = writeBatch(db);

    // Delete all chapters
    const chaptersRef = collection(db, "stories", storyId, "chapters");
    const chaptersSnap = await getDocs(chaptersRef);
    chaptersSnap.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    // Delete the story document
    batch.delete(doc(db, "stories", storyId));

    await batch.commit();
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}

/**
 * Toggle publish status of a story
 */
export async function toggleStoryPublished(storyId, published) {
  return updateStory(storyId, { published });
}

// ========== CHAPTERS ==========

/**
 * Get all chapters for a story
 */
export async function getChapters(storyId) {
  try {
    const q = query(
      collection(db, "stories", storyId, "chapters"),
      orderBy("chapterNumber", "asc")
    );
    const snapshot = await getDocs(q);
    const chapters = [];
    snapshot.forEach((docSnap) => {
      chapters.push({
        id: docSnap.id,
        ...docSnap.data(),
      });
    });
    return chapters;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
}

/**
 * Get a single chapter
 */
export async function getChapter(storyId, chapterId) {
  try {
    const docRef = doc(db, "stories", storyId, "chapters", chapterId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      console.error("Chapter not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching chapter:", error);
    throw error;
  }
}

/**
 * Create a new chapter
 */
export async function createChapter(storyId, chapterData) {
  try {
    // Find the next chapter number
    const chapters = await getChapters(storyId);
    const maxChapterNumber = chapters.length > 0 
      ? Math.max(...chapters.map(ch => ch.chapterNumber || 0))
      : 0;

    const dataWithTimestamps = {
      chapterNumber: chapterData.chapterNumber || maxChapterNumber + 1,
      title: chapterData.title,
      content: chapterData.content || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "stories", storyId, "chapters"),
      dataWithTimestamps
    );

    return {
      id: docRef.id,
      ...dataWithTimestamps,
    };
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
}

/**
 * Update a chapter
 */
export async function updateChapter(storyId, chapterId, updates) {
  try {
    const docRef = doc(db, "stories", storyId, "chapters", chapterId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: chapterId, ...updates };
  } catch (error) {
    console.error("Error updating chapter:", error);
    throw error;
  }
}

/**
 * Delete a chapter
 */
export async function deleteChapter(storyId, chapterId) {
  try {
    await deleteDoc(doc(db, "stories", storyId, "chapters", chapterId));
  } catch (error) {
    console.error("Error deleting chapter:", error);
    throw error;
  }
}

/**
 * Reorder chapters - updates chapterNumbers
 */
export async function reorderChapters(storyId, chapterOrder) {
  try {
    const batch = writeBatch(db);
    
    chapterOrder.forEach((chapterId, index) => {
      const chapterRef = doc(db, "stories", storyId, "chapters", chapterId);
      batch.update(chapterRef, { chapterNumber: index + 1 });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error reordering chapters:", error);
    throw error;
  }
}
