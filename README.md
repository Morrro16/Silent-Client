# Silent Client

Landing page for the Silent Client game client. Desktop screens show the red Magic Rings hero, Morph Slider feature gallery, and Ghost Cursor in the documentation. Phones and other touch or reduced-motion devices use a static hero and a simple swipeable gallery instead. Mobile layouts use a compact menu, stacked cards, and horizontally scrollable documentation tabs.

## Development

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Source files

- `src/App.jsx` — the homepage, navigation, simple feature carousel, and documentation.
- `src/site.css` — Tailwind entry point and page-specific styling.
- `public/downloads/Silent-Client-5.0.zip` — client archive linked from the download page.

For a production build, set `VITE_SITE_URL` to the confirmed canonical HTTPS origin and run `npm run build:production`. This creates separate static HTML metadata for the Russian routes `/`, `/download/`, and `/documentation/` and their English versions `/en/`, `/en/download/`, and `/en/documentation/`. Each route receives canonical and language alternate URLs, Open Graph/Twitter cards, and JSON-LD; the build also writes `sitemap.xml` and `robots.txt`.

PowerShell example:

```powershell
$env:VITE_SITE_URL = "https://your-confirmed-domain.example"
npm run build:production
```

Do not use a preview or unowned domain as `VITE_SITE_URL`; generated canonical links and the sitemap point search engines to that address.
