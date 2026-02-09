# Firestore Debugging Guide - Astrayudh

## Quick Start
This guide helps you debug issues with published blogs and stories not showing on the public website.

---

## Step 1: Check Console Logs

### Open Developer Console
1. Press `F12` or right-click → **Inspect**
2. Go to the **Console** tab
3. Refresh the page

### Expected Log Messages

#### On `blogs.html`:
```
[FIREBASE] 🔧 Initializing Firebase with config...
[FIREBASE] ✅ Firebase initialized
[FIREBASE] ✅ Firestore initialized - Project ID: astrayudh-7626b
[FIREBASE] ✅ Authentication initialized
[BLOGS] 🔄 Starting to load published blogs from Firestore...
[FIRESTORE] 🔍 Querying published blogs...
[FIRESTORE] ✅ Query successful: Found X published blogs
[BLOGS] ✅ Successfully fetched X published blogs from Firestore
[BLOGS] Blog samples: [...]
```

#### On `stories.html`:
```
[STORIES] 🔄 Starting to load published stories from Firestore...
[FIRESTORE] 🔍 Querying published stories...
[FIRESTORE] ✅ Query successful: Found X published stories
[STORIES] ✅ Successfully fetched X published stories from Firestore
[STORIES] Story samples: [...]
```

#### On `blog-view.html?id=...`:
```
[BLOG-VIEW] 🔄 Loading blog with ID: <doc-id>
[FIRESTORE] 🔍 Fetching blog by ID: <doc-id>
[FIRESTORE] ✅ Blog found: {...}
[BLOG-VIEW] ✅ Blog is published, rendering content...
```

#### On `story-view.html?id=...`:
```
[STORY-VIEW] 🔄 Loading story with ID: <doc-id>
[FIRESTORE] 🔍 Fetching story with chapters, ID: <doc-id>
[FIRESTORE] ✅ Story found with X chapters: {...}
[STORY-VIEW] ✅ Story is published, rendering content...
```

---

## Step 2: Troubleshoot by Error

### Error: "Failed to load blogs/stories"

**"Failed to load blogs. Please refresh the page."** appears on the page.

#### Check Console for:
```
[FIRESTORE] ❌ Error fetching published blogs:
[FIRESTORE] Error code: permission-denied
```

**Solution**: Update Firestore security rules (see Setup Firestore Rules section below)

---

### Error: Permission Denied (permission-denied)

**Console shows:**
```
[FIRESTORE] Error code: permission-denied
[FIRESTORE] Error message: Missing or insufficient permissions
```

**This means:**
- Firestore rules are blocking reads
- The rule `allow read: if resource.data.published == true;` is not set

**Solutions:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **astrayudh-7626b**
3. Go to **Firestore Database** → **Rules**
4. Copy the rules from [firestore.rules](firestore.rules) file in this repo
5. Paste them into the rules editor
6. Click **Publish**

---

### Error: No Documents Found

**Console shows:**
```
[FIRESTORE] ✅ Query successful: Found 0 published blogs
```

**This means:**
- Query is working ✅
- But no documents match `published == true`

**Solutions:**
1. Check Firestore console: https://console.firebase.google.com
2. Navigate to **Firestore Database** → **Collections** → **blogs** or **stories**
3. Verify documents exist and have:
   - `published: true` (as **boolean**, not string)
   - `createdAt: Timestamp` (server timestamp)
4. If `published` is string `"true"`, admin code needs fixing

---

### Error: Blog/Story Not Published

**Console shows:**
```
[BLOG-VIEW] Blog <id> is not published (published=false)
```

**Solution:**
1. Go to admin panel: [admin.html](admin.html)
2. Find the blog/story
3. Click **Publish** button
4. Verify status changes to "Published" in green

---

### Error: Document Not Found

**Console shows:**
```
[FIRESTORE] ⚠️ Blog document does not exist
or
[FIRESTORE] ⚠️ Story document does not exist
```

**Solution:**
1. The URL ID is wrong, or document was deleted
2. Check the Firestore console to verify doc exists
3. Try accessing from blogs/stories list instead

---

## Step 3: Verify Admin Write Logic

The admin creates documents. Verify they're stored correctly:

### Check Blog Document Structure

Go to **Firestore Console** → **blogs** collection:

Each blog should have:
```
{
  title: "Blog Title" (string)
  subtitle: "Brief description" (string)
  description: "Full description" (string)
  content: "Blog content..." (string)
  imageUrl: "https://..." (string)
  tags: [] (array)
  published: true (boolean ✅ NOT "true" string)
  createdAt: Timestamp (server timestamp)
  updatedAt: Timestamp (server timestamp)
}
```

### Check Story Document Structure

Go to **Firestore Console** → **stories** collection:

Each story should have:
```
{
  title: "Story Title" (string)
  description: "Full description" (string)
  coverImageUrl: "https://..." (string)
  published: true (boolean ✅ NOT "true" string)
  createdAt: Timestamp (server timestamp)
  updatedAt: Timestamp (server timestamp)
}
```

### Check Chapter Subcollection

Under each published story → **chapters** subcollection:

Each chapter should have:
```
{
  chapterNumber: 1, 2, 3... (number)
  title: "Chapter Title" (string)
  content: "Chapter content..." (string)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## Step 4: Verify Firestore Rules

Go to: https://console.firebase.google.com → **astrayudh-7626b** → **Firestore** → **Rules**

Rules should allow:
```javascript
// Public can read only published blogs
match /blogs/{blogId} {
  allow read: if resource.data.published == true;
  allow write: if request.auth != null;
}

// Public can read only published stories
match /stories/{storyId} {
  allow read: if resource.data.published == true;
  allow write: if request.auth != null;
  
  match /chapters/{chapterId} {
    allow read: if get(/databases/$(database)/documents/stories/$(storyId)).data.published == true;
    allow write: if request.auth != null;
  }
}
```

**If rules are missing or different**, copy from [firestore.rules](firestore.rules) and republish.

---

## Step 5: Test Each Page

### Test Blogs Page
1. Open: [blogs.html](blogs.html)
2. Check console for `[FIRESTORE] ✅ Query successful: Found X blogs`
3. Verify published blogs appear in grid
4. Search and filter should work

### Test Blog View
1. From blogs page, click any blog card
2. Check URL ends with `?id=<document-id>`
3. Check console for `[BLOG-VIEW] ✅ Blog is published`
4. Content should render fully

### Test Stories Page
1. Open: [stories.html](stories.html)
2. Check console for `[FIRESTORE] ✅ Query successful: Found X stories`
3. Verify published stories appear in grid

### Test Story View
1. From stories page, click any story card
2. URL should end with `?id=<document-id>`
3. Check console for `[STORY-VIEW] ✅ Story is published`
4. All chapters should list and render

---

## Step 6: Common Issues Checklist

- [ ] Firestore rules file copied to admin console and published?
- [ ] All content created in admin has `published: true`? (Check dev console before creating)
- [ ] No "permission-denied" errors in console?
- [ ] Query shows "Found X documents" (where X > 0)?
- [ ] All timestamps are Firestore Timestamps (not strings)?
- [ ] URLs include proper `?id=` parameter?
- [ ] Firestore Database is in **Production** not Test mode?

---

## Step 7: Clear Cache & Full Refresh

Sometimes cache causes issues:

1. Open DevTools: **F12**
2. Right-click refresh button
3. Select **Empty cache and hard reload**
4. Or: **Ctrl+Shift+Delete** to clear browser cache

---

## Need More Help?

Check these files for detailed logs:
- `firebase.js` - Firebase initialization (look for emojis: 🔧✅)
- `firestoreService.js` - Query/fetch functions (look for emojis: 🔍✅❌)
- `blogs.js`, `stories.js`, `blog-view.js`, `story-view.js` - Page-level logic (look for emojis: 🔄✅❌)

All major operations have prefixed console logs:
- `[FIREBASE]` - Firebase SDK setup
- `[FIRESTORE]` - Database queries
- `[BLOGS]`, `[STORIES]` - Collection pages
- `[BLOG-VIEW]`, `[STORY-VIEW]` - Individual view pages
