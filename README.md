# Indiefferential — Static Site

A premium, editorial-style static website for an underground music & culture magazine. Pure HTML/CSS/JS — no build step, ready for GitHub Pages.

## Structure

```
/
├── index.html          Homepage
├── news.html            News listing
├── reviews.html          Reviews listing
├── interviews.html       Interviews listing
├── editorials.html       Editorials listing
├── features.html         Features listing
├── fashion.html          Fashion listing
├── photography.html      Photography listing
├── culture.html          Culture listing
├── playlists.html        Playlists + Spotify/SoundCloud/YouTube embeds
├── videos.html           Videos listing
├── events.html           Events calendar
├── artists.html          Artist directory
├── archive.html          Back issues
├── article.html          Single article template (reading progress, comments, related stories)
├── about.html            About / masthead
├── contact.html          Contact form
├── css/style.css         Full design system (tokens, type, components, responsive)
├── js/main.js            All interactions (cursor, reveals, mini player, bookmarks, filters…)
└── partials/             header.html / footer.html / player.html — loaded via fetch() on every page
```

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `indiefferential`).
2. Push the contents of this folder to the repo root (or to `/docs` if you prefer — just set that in step 4).
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<you>/indiefferential.git
   git push -u origin main
   ```
3. The included `.nojekyll` file stops GitHub Pages from running Jekyll on the `partials/` folder (folders starting with `_` would otherwise be ignored — not an issue here, but it's good practice and speeds up the build).
4. In the repo, go to **Settings → Pages**, set **Source** to the `main` branch (root), and save.
5. Your site will be live at `https://<you>.github.io/indiefferential/`.

## Notes

- **No build tools required** — open `index.html` directly, or serve locally with `python3 -m http.server` (fetch-based partials need `http://`, not `file://`).
- **Images** are pulled live from `picsum.photos` (editorial photography placeholders) and `i.pravatar.cc` (avatars) — swap the `src` attributes for real photography before launch.
- **Audio embeds** (Spotify/SoundCloud/YouTube) use public demo playlist IDs — replace with your own.
- Community features (accounts, persistent comments, notifications) are represented as **front-end only**: comments and bookmarks are stored in the browser's `localStorage` so the UI is fully functional, but nothing is shared between visitors. Wiring these to a real backend (Supabase, Firebase, etc.) is the natural next step.
- Fonts: Bebas Neue (display), Space Grotesk (body/UI), JetBrains Mono (labels/utility), loaded from Google Fonts.
