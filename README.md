# Mentor. Discovery

A responsive mentor discovery page built from a Figma mentor profile card.
Stack: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide React.

## Run locally
```
npm install
npm run dev
```

## Production build
```
npm run build
npm run preview
```

## Deploy to Vercel
1. Push the whole project (including `src/` and `index.html`) to GitHub.
2. In Vercel choose Add New, then Project, and import the repository.
3. Vercel detects Vite (build command `npm run build`, output directory `dist`). Click Deploy.

## Notes
- Mentors, prices, slots and bookings are sample data; nothing is sent to a backend.
- Mentor photos live in `src/assets/`. Replace them with larger images (600px or wider) for sharper cards.
- Satoshi loads from Fontshare; DM Sans is the fallback.

## Photo credits
Dilipkumar's portrait comes from the original Figma design. Raghav, Suresh and Neil use Unsplash+ photos
(file names `premium_photo-...`), which need an Unsplash+ licence for the account that downloaded them.
Meera and Ananya use regular Unsplash photos (Unsplash License); photographer names were not identified from the files.
The hero image and the profile avatar are still crops from the design reference image.
