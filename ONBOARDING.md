# WP Product Talk — CMS Onboarding

## Overview

The site has a built-in CMS (Decap CMS) at `/admin` for managing blog posts and site settings. Episodes are still pulled automatically from your RSS feed at build time — no CMS needed for those.

## What You Can Edit

### Blog Posts
- Create, edit, and delete blog articles
- Each post has: title, date, description, body (markdown), optional featured image, and tags
- Posts appear at `/blog` and at individual URLs like `/blog/welcome-to-the-new-site/`

### Site Settings
- Tagline, about text, and social URLs (Twitter, YouTube)
- Stored in `src/content/settings/general.json`

## How to Access the CMS

### Option A: Edit in GitHub (Recommended for now)
1. Go to [github.com/jack-arturo/wp-product-talk](https://github.com/jack-arturo/wp-product-talk)
2. Navigate to `src/content/blog/`
3. Click "Add file" → "Create new file"
4. Name it something like `2026-03-15-your-post-slug.md`
5. Add frontmatter at the top (see format below) and your markdown content
6. Commit to `main` — the site auto-deploys via GitHub Actions

### Option B: Decap CMS Admin Panel
1. Visit `https://wp-product-talk.pages.dev/admin/`
2. Log in with your GitHub account
3. Use the visual editor to create/edit blog posts and settings

**Note:** For the admin panel to work, a GitHub OAuth App needs to be registered:
1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Create a new OAuth App:
   - **Application name:** WP Product Talk CMS
   - **Homepage URL:** `https://wp-product-talk.pages.dev`
   - **Authorization callback URL:** `https://wp-product-talk.pages.dev/admin/`
3. Copy the Client ID and add `app_id: YOUR_CLIENT_ID` to `public/admin/config.yml` under the `backend:` section

## Blog Post Format

```markdown
---
title: "Your Post Title"
date: 2026-03-15
description: "A short summary that appears on the blog listing page."
tags: ["topic-one", "topic-two"]
image: "/images/uploads/optional-image.jpg"
---

Your markdown content goes here.

## Headings Work

So do **bold**, *italic*, [links](https://example.com), lists, code blocks, etc.
```

## How Deployment Works

- The site auto-deploys when you push to `main` on GitHub
- GitHub Actions runs the build and deploys to Cloudflare Pages
- Build takes ~1-2 minutes
- Preview at: `https://wp-product-talk.pages.dev`

## Tech Stack

- **Astro** — Static site generator (fast builds, zero JS by default)
- **Tailwind CSS** — Styling
- **Decap CMS** — Git-based headless CMS (content stored as markdown in the repo)
- **Cloudflare Pages** — Hosting + CDN
- **GitHub Actions** — Auto-deploy on push to main

## Questions?

Reach out to Jack (jack@verygoodplugins.com) for technical support.
