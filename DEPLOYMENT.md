# Deployment Guide — 21st Birthday Keepsake Flipbook

A polished, responsive flipbook built with **React + Vite + TypeScript + Tailwind**. Below are step-by-step instructions for **local development** and **deploying to InfinityFree** (free static hosting).

---

## 1. Local Development

### Prerequisites
- Node.js **18+** (download: <https://nodejs.org>)
- npm (bundled with Node) — or `bun` / `pnpm` if you prefer

### Run locally
```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload at http://localhost:8080)
npm run dev

# 3. Build the production bundle (output → ./dist)
npm run build

# 4. Preview the production build locally
npm run preview
```

### Customize the content
- **Birthday name + messages**: edit `src/data/book.ts`
- **Photos**: replace files in `src/assets/` (`portrait.jpg`, `photo1.jpg` … `photo4.jpg`) — keep the same names for zero code changes
- **Colors / fonts**: edit `src/index.css` (design tokens) and `tailwind.config.ts`
- **Background music**: change the URL in `src/components/book/Flipbook.tsx` (look for `new Audio(...)`)

---

## 2. Deploy to InfinityFree (Free Static Hosting)

InfinityFree serves static files via FTP — perfect for this Vite build.

### Step A — Create your account & site
1. Sign up at <https://infinityfree.net> and verify your email.
2. In the **Client Area → Accounts → Create Account**, pick a free subdomain (e.g. `emma21.rf.gd`) **or** attach your custom domain.
3. Wait ~5 minutes for the account to provision. From the account panel, open **FTP Details** and note:
   - **FTP Hostname** (e.g. `ftpupload.net`)
   - **FTP Username**
   - **FTP Password**

### Step B — Build the site
```bash
npm install
npm run build
```
This produces a `dist/` folder containing `index.html`, an `assets/` directory, and static files.

### Step C — Upload via FTP
1. Download an FTP client — **FileZilla** is free: <https://filezilla-project.org>
2. Open FileZilla → **File → Site Manager → New Site** and enter your InfinityFree FTP details (Port **21**, Encryption: *Use plain FTP*).
3. Connect. On the **right panel** (remote), open the `htdocs/` folder.
4. **Delete** the default `index.html` placeholder inside `htdocs/`.
5. From the **left panel** (local), open your project's `dist/` folder.
6. Select **everything inside `dist/`** (not the folder itself) and drag it into `htdocs/`.
7. Wait for the upload to finish.

### Step D — Add SPA routing fallback (important!)
Because this site uses client-side routing, create a small `.htaccess` so deep links don't 404.

Create a file named `.htaccess` (no extension) inside `htdocs/` with:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```
Upload it to `htdocs/` via FileZilla. Done.

### Step E — Visit your site
Open your subdomain (e.g. `https://emma21.rf.gd`) in a browser. DNS may take 5–15 minutes the first time.

---

## 3. Updating the Site Later
1. Edit content / photos locally.
2. Run `npm run build`.
3. Re-upload everything inside `dist/` to `htdocs/` (overwrite when prompted).

---

## 4. Optional: Faster Free Alternatives
If you find InfinityFree slow, identical static-build deploys work great on:
- **Netlify** — drag-and-drop the `dist/` folder at <https://app.netlify.com/drop>
- **Vercel** — `npx vercel` from the project root
- **Cloudflare Pages** — connect your Git repo
- **GitHub Pages** — push `dist/` to a `gh-pages` branch

All four are free, support HTTPS automatically, and need no `.htaccess`.

---

Enjoy the keepsake — and happy 21st! 🥂
