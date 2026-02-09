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
    console.log("[FIRESTORE] 🔍 Querying published blogs...");
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
    console.log(`[FIRESTORE] ✅ Query successful: Found ${blogs.length} published blogs`);
    return blogs;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching published blogs:", error);
    console.error("[FIRESTORE] Error code:", error.code);
    console.error("[FIRESTORE] Error message:", error.message);
    throw error;
  }
}

/**
 * Get all blogs including drafts (for admin)
 */
export async function getAllBlogs() {
  try {
    console.log("[FIRESTORE] 🔍 Querying ALL blogs (including drafts)...");
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
    console.log(`[FIRESTORE] ✅ Query successful: Found ${blogs.length} blogs (published + drafts)`);
    return blogs;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching all blogs:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Get a single blog by ID
 */
export async function getBlogById(blogId) {
  try {
    console.log("[FIRESTORE] 🔍 Fetching blog by ID:", blogId);
    const docRef = doc(db, "blogs", blogId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const blog = {
        id: docSnap.id,
        ...docSnap.data(),
      };
      console.log("[FIRESTORE] ✅ Blog found:", blog);
      return blog;
    } else {
      console.warn("[FIRESTORE] ⚠️ Blog document does not exist");
      return null;
    }
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching blog:", error);
    console.error("[FIRESTORE] Error code:", error.code);
    throw error;
  }
}

/**
 * Create a new blog
 */
export async function createBlog(blogData) {
  try {
    console.log("[FIRESTORE] 📝 Creating new blog:", blogData);
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
    console.log("[FIRESTORE] ✅ Blog created with ID:", docRef.id);
    return {
      id: docRef.id,
      ...dataWithTimestamps,
    };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error creating blog:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Update a blog
 */
export async function updateBlog(blogId, updates) {
  try {
    console.log("[FIRESTORE] 📝 Updating blog:", blogId, updates);
    const docRef = doc(db, "blogs", blogId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("[FIRESTORE] ✅ Blog updated successfully");
    return { id: blogId, ...updates };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error updating blog:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Delete a blog
 */
export async function deleteBlog(blogId) {
  try {
    console.log("[FIRESTORE] 🗑 Deleting blog:", blogId);
    await deleteDoc(doc(db, "blogs", blogId));
    console.log("[FIRESTORE] ✅ Blog deleted successfully");
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error deleting blog:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
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
    console.log("[FIRESTORE] 🔍 Querying published stories...");
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
    console.log(`[FIRESTORE] ✅ Query successful: Found ${stories.length} published stories`);
    return stories;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching published stories:", error);
    console.error("[FIRESTORE] Error code:", error.code);
    console.error("[FIRESTORE] Error message:", error.message);
    throw error;
  }
}

/**
 * Get all stories including drafts (for admin)
 */
export async function getAllStories() {
  try {
    console.log("[FIRESTORE] 🔍 Querying ALL stories (including drafts)...");
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
    console.log(`[FIRESTORE] ✅ Query successful: Found ${stories.length} stories (published + drafts)`);
    return stories;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching all stories:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Get a story with its chapters
 */
export async function getStoryWithChapters(storyId) {
  try {
    console.log("[FIRESTORE] 🔍 Fetching story with chapters, ID:", storyId);
    // Get story
    const storyRef = doc(db, "stories", storyId);
    const storySnap = await getDoc(storyRef);
    
    if (!storySnap.exists()) {
      console.warn("[FIRESTORE] ⚠️ Story document does not exist");
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

    console.log(`[FIRESTORE] ✅ Story found with ${story.chapters.length} chapters:`, story);
    return story;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching story with chapters:", error);
    console.error("[FIRESTORE] Error code:", error.code);
    throw error;
  }
}

/**
 * Create a new story
 */
export async function createStory(storyData) {
  try {
    console.log("[FIRESTORE] 📝 Creating new story:", storyData);
    const dataWithTimestamps = {
      title: storyData.title,
      description: storyData.description || "",
      coverImageUrl: storyData.coverImageUrl || "",
      published: storyData.published || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "stories"), dataWithTimestamps);
    console.log("[FIRESTORE] ✅ Story created with ID:", docRef.id);
    return {
      id: docRef.id,
      ...dataWithTimestamps,
      chapters: [],
    };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error creating story:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Update a story
 */
export async function updateStory(storyId, updates) {
  try {
    console.log("[FIRESTORE] 📝 Updating story:", storyId, updates);
    const docRef = doc(db, "stories", storyId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("[FIRESTORE] ✅ Story updated successfully");
    return { id: storyId, ...updates };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error updating story:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Delete a story and all its chapters
 */
export async function deleteStory(storyId) {
  try {
    console.log("[FIRESTORE] 🗑 Deleting story and all chapters:", storyId);
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
    console.log("[FIRESTORE] ✅ Story and all chapters deleted successfully");
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error deleting story:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
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
    console.log("[FIRESTORE] 📖 Loading chapters for story:", storyId);
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
    console.log(`[FIRESTORE] ✅ Found ${chapters.length} chapters for story ${storyId}`);
    return chapters;
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error fetching chapters:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
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
    console.log("[FIRESTORE] 📝 Creating new chapter for story:", storyId, chapterData);
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
    console.log("[FIRESTORE] ✅ Chapter created with ID:", docRef.id);
    return {
      id: docRef.id,
      ...dataWithTimestamps,
    };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error creating chapter:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Update a chapter
 */
export async function updateChapter(storyId, chapterId, updates) {
  try {
    console.log("[FIRESTORE] 📝 Updating chapter:", storyId, chapterId, updates);
    const docRef = doc(db, "stories", storyId, "chapters", chapterId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("[FIRESTORE] ✅ Chapter updated successfully");
    return { id: chapterId, ...updates };
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error updating chapter:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
    throw error;
  }
}

/**
 * Delete a chapter
 */
export async function deleteChapter(storyId, chapterId) {
  try {
    console.log("[FIRESTORE] 🗑 Deleting chapter:", storyId, chapterId);
    await deleteDoc(doc(db, "stories", storyId, "chapters", chapterId));
    console.log("[FIRESTORE] ✅ Chapter deleted successfully");
  } catch (error) {
    console.error("[FIRESTORE] ❌ Error deleting chapter:");
    console.error("[FIRESTORE] Error Code:", error.code);
    console.error("[FIRESTORE] Error Message:", error.message);
    console.error("[FIRESTORE] Full Error:", error);
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
