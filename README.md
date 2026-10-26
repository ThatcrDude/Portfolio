# Lim Cheng Rui – Portfolio 2026

A static website made of plain HTML, CSS and JavaScript (no build step, no Python). It works on laptop, tablet and phone.

## What each file does
| File | What it is |
|---|---|
| `index.html` | The content: text, gallery cards, video cards, sections. Labelled with comments. |
| `css/style.css` | How it looks: colours (at the very top), layout, phone and tablet rules. |
| `js/links.js` | **Your link addresses** (LinkedIn, GitHub, ArtStation). The one file you will edit most. |
| `js/script.js` | What it does: the book animation, menu, video pop-up, CV reader, phone layout. |
| `assets/` | Pictures, the chibi effect video, the CV PDF and the CV page images. |
| `.nojekyll` | An empty file that tells GitHub Pages to publish the site exactly as it is (see below). |

## Put it online with GitHub Pages
1. On github.com, click **New repository**. Name it `portfolio` (or `yourusername.github.io` for a shorter link). Keep it **Public**.
2. Click **uploading an existing file** and drag in everything from this folder: `index.html`, the `css`, `js` and `assets` folders, `.nojekyll` and this README. Then **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
4. After about a minute your site is live at `https://yourusername.github.io/portfolio/`.

To update later, edit or upload files in the repo and commit; the site refreshes by itself.

## Common edits
- **Links:** open `js/links.js` and paste each full address between the quotes.
- **CV:** the download button uses `assets/Lim_Cheng_Rui_CV.pdf`. The pop-up reader uses `assets/cv-page-1.jpg` and `assets/cv-page-2.jpg`. When your CV changes, replace the PDF (same name) and the two page images.
- **Add a gallery picture:** in `index.html`, copy one `<figure class="tk">` block, change the image name and the two text lines.
- **Add a video:** in `index.html`, copy one `<button class="vcard">` block (the note at the end of the Videos section explains the codes).
- **Tab icon (favicon):** `assets/favicon.svg` is your LR logo as a vector (the colour is the `fill` value inside the file). `assets/favicon-32.png` and `assets/apple-touch-icon.png` are fallbacks for older browsers and the iPhone home screen. Keep the same file names if you swap them.
- **Colours:** the variables at the top of `css/style.css`.

## What is `.nojekyll`?
GitHub Pages normally runs a tool called Jekyll over your files before publishing. Jekyll quietly ignores any file or folder whose name starts with an underscore and can change how files are served. `.nojekyll` is an empty marker file that switches Jekyll off, so GitHub publishes your files exactly as they are. This site would probably work without it, but keeping it is safer. Because its name starts with a dot, it can be hidden on your computer; make sure it gets uploaded.
