/**
 * Shared image URLs and fallbacks for Astrayudh.
 */

const BLOG_FALLBACKS = [
  "https://images.unsplash.com/photo-1455390883993-490efaba612e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80"
];

const STORY_FALLBACKS = [
  "https://images.unsplash.com/photo-1507842072343-583f20270319?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1471107340923-17b2a7d4a973?auto=format&fit=crop&w=900&q=80"
];

export const HOME_IMAGES = {
  showcase: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1455390883993-490efaba612e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507842072343-583f20270319?auto=format&fit=crop&w=900&q=80"
  ],
  apps: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
  blogs: "https://images.unsplash.com/photo-1455390883993-490efaba612e?auto=format&fit=crop&w=900&q=80",
  stories: "https://images.unsplash.com/photo-1507842072343-583f20270319?auto=format&fit=crop&w=900&q=80",
  vortix: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80"
};

function hashString(value) {
  const str = String(value || "0");
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function isValidRemoteUrl(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("assets/")) return false;
  return /^https?:\/\//i.test(url) || url.startsWith("//");
}

export function resolveBlogImage(blog, index = 0) {
  const candidates = [
    blog?.imageUrl,
    blog?.featuredImage,
    blog?.image,
    blog?.coverImageUrl
  ];

  for (const url of candidates) {
    if (isValidRemoteUrl(url)) return url;
  }

  const key = blog?.id || blog?.title || index;
  return BLOG_FALLBACKS[hashString(key) % BLOG_FALLBACKS.length];
}

export function resolveStoryImage(story, index = 0) {
  const candidates = [
    story?.coverImageUrl,
    story?.imageUrl,
    story?.featuredImage,
    story?.image
  ];

  for (const url of candidates) {
    if (isValidRemoteUrl(url)) return url;
  }

  const key = story?.id || story?.title || index;
  return STORY_FALLBACKS[hashString(key) % STORY_FALLBACKS.length];
}

export function escapeCssUrl(url) {
  return String(url).replace(/'/g, "\\'");
}
