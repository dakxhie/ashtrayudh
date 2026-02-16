# Hero Images Update Plan

## Overview
Update hero images across multiple pages to use more aesthetic and visually appealing Unsplash images that better align with the brand.

## Current Issue
- Apps, Blogs, and Stories pages have hero images that aren't displaying optimally
- Need to replace with better quality, more thematic images

## Changes Required

### 1. apps.html (Line 39)
**Current:**
```html
<section class="hero" style="height: 70vh; background: url('https://images.unsplash.com/photo-1460925895917-adf4edb926f3?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**New:**
```html
<section class="hero" style="height: 70vh; background: url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**Rationale:** Clean, modern tech/UI design aesthetic matches app development theme

---

### 2. blogs.html (Line 32)
**Current:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**New:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1499887142886-fd1cff867a5a?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**Rationale:** Minimalist workspace with laptop for writing inspiration

---

### 3. stories.html (Line 32)
**Current:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1507842072343-583f20270319?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**New:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1506880018603-83d5b814b5a4?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**Rationale:** Artistic, books & creative atmosphere

---

### 4. index.html (Line 37)
**Current:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**New:**
```html
<section class="hero" style="background: url('https://images.unsplash.com/photo-1543269865-cbdf26ce6c3f?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;">
```

**Rationale:** Modern creative/design focused imagery for homepage

---

## Implementation Details
- All images are from Unsplash (free, high-quality)
- All URLs include optimization parameters: `auto=format&fit=crop&w=1200&q=80`
- Images are thematically appropriate for each page's content
- No CSS changes required - only URL replacements

## Verification
After applying changes:
1. Test each page loads without broken images
2. Verify hero sections display correctly across different screen sizes
3. Confirm overlay effects still work as intended
4. Check load times remain acceptable
