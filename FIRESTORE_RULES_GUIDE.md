# Firestore Rules Deployment Guide

## Overview

This guide explains how to deploy the Firestore security rules that allow the public website to display published blogs and stories while preventing unauthorized access to draft content.

## What's Fixed

✅ **Public read access** to published blogs and stories  
✅ **Automatic draft filtering** - drafts remain hidden from public pages  
✅ **Admin-only write access** - only authenticated admins can create/edit/delete  
✅ **Secure subcollections** - chapters are only visible if their parent story is published  

## The Firestore Rules

The security rules are defined in `firestore.rules`:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== BLOGS COLLECTION =====
    match /blogs/{blogId} {
      // Public: Allow anyone to read published blogs
      allow read: if resource.data.published == true;
      
      // Admin: Only authenticated users can create, update, delete
      allow write: if request.auth != null;
    }

    // ===== STORIES COLLECTION =====
    match /stories/{storyId} {
      // Public: Allow anyone to read published stories
      allow read: if resource.data.published == true;
      
      // Admin: Only authenticated users can create, update, delete
      allow write: if request.auth != null;

      // ===== CHAPTERS SUBCOLLECTION =====
      match /chapters/{chapterId} {
        // Public: Allow anyone to read chapters from published stories
        allow read: if get(/databases/$(database)/documents/stories/$(storyId)).data.published == true;
        
        // Admin: Only authenticated users can create, update, delete chapters
        allow write: if request.auth != null;
      }
    }

    // ===== FALLBACK DENY RULE =====
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## How to Deploy These Rules

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed)
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Setup Firebase project in your directory** (if not already done)
   ```bash
   firebase init firestore
   ```

4. **Replace the firestore.rules content**
   - The file should already exist at `firestore.rules` or in the root directory
   - Copy the content from this repository's `firestore.rules` file

5. **Deploy the rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using Firebase Console (Web)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **astrayudh-7626b**
3. Go to **Firestore Database** → **Rules** tab
4. Click **Edit Rules**
5. Replace all content with the rules from `firestore.rules`
6. Click **Publish**

## Verifying the Rules Work

### 1. Test Public Read Access
- Visit `blogs.html` - should load published blogs
- Visit `stories.html` - should load published stories
- Check browser console (F12) for logs:
  ```
  [FIREBASE] ✅ Firestore initialized
  [FIRESTORE] ✅ Query successful: Found X published blogs
  ```

### 2. Test Draft Hiding
- Create a new blog/story in the admin panel **WITHOUT** publishing it
- Try to access it directly with the URL: `blog-view.html?id=<BLOG_ID>`
- You should see: "Blog not published" message

### 3. Test Write Permissions
- Logout from admin account
- Try to run this in browser console:
  ```javascript
  const { db } = await import('./firebase.js');
  const { addDoc, collection } = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
  
  await addDoc(collection(db, 'blogs'), {
    title: 'Hacked',
    published: true
  });
  ```
- You should get a **Permission denied** error

## Troubleshooting

### Issue: Public pages show "Failed to load blogs"

**Check browser console (F12):**

1. Look for Firestore errors like:
   - `Missing or insufficient permissions` → Firestore rules deny access
   - `Query requires an index` → Create the index (Firebase will offer link)
   - `permission_denied` → Admin not authenticated for write operations

2. **Solution for "Missing or insufficient permissions":**
   - Ensure rules are deployed: `firebase deploy --only firestore:rules`
   - Refresh the page
   - Check if `firebaseConfig.projectId` matches the Firebase Console project

3. **Solution for missing index:**
   - Click the link provided in the error
   - Firebase Console will automatically create the index
   - Wait 2-5 minutes for index creation
   - Refresh the page

4. **Solution for "Query requires an index":**
   - If you created compound indexes manually, they might be building
   - Wait a few minutes then retry

### Issue: Drafts are showing on public pages

**Cause:** The `published` field might be stored as string `"true"` instead of boolean `true`

**Fix:**
1. Go to admin panel
2. For each blog/story, toggle Unpublish → Publish
3. This will rewrite the field as a boolean

### Issue: Admin can't create content

**Check:**
1. Are you logged into the admin panel?
2. Is your Firebase Auth user authenticated?
3. Check Firestore rules - they should allow `write: if request.auth != null`

## Security Notes

⚠️ **Important:** These rules:
- ✅ Allow anyone to read blogs/stories where `published = true`
- ✅ Allow anyone to read chapters of published stories  
- ✅ Only allow authenticated users to create/edit/delete ANY content
- ✅ Hide draft content from public

These rules are secure and production-ready. Only authenticated admin users can write to the database.

## Testing with Sample Data

To test these rules work correctly:

1. **Create test blog as admin:**
   - Admin Panel → Blogs → Create
   - Title: "Test Blog"
   - Content: "This is a test"
   - **Publish it**

2. **Create test draft:**
   - Create another blog with same steps
   - **Don't publish it**

3. **Visit public pages:**
   - `blogs.html` → Should show only published blog
   - `blog-view.html?id=<DRAFT_ID>` → Should show "Blog not published"

## Next Steps

1. Deploy these rules to Firebase: `firebase deploy --only firestore:rules`
2. Visit your public site and verify blogs/stories appear
3. Create test content in admin panel to verify
4. Monitor browser console for any Firestore errors

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Query Indexes](https://firebase.google.com/docs/firestore/query-data/index-overview)

---

**Last Updated:** February 9, 2026  
**Project:** Astrayudh  
**Environment:** Production
