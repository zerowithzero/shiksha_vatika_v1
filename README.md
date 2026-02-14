# Shiksha Vatika Public School Website

A production-ready, mobile-first responsive website built with HTML5, CSS3, and Vanilla JavaScript.

## Features
- **Bilingual (English/Hindi)**: Toggle support using JSON translations and `localStorage`.
- **Responsive Design**: Works on mobile (360px+), tablet, and desktop.
- **Performance**: Semantic HTML, async script loading, minimal external dependencies.
- **Accessibility**: ARIA labels, semantic structure, focus management.

## Project Structure
```
/
├── index.html          # Main landing page
├── assets/
│   ├── css/
│   │   └── style.css   # Main stylesheet
│   ├── js/
│   │   └── main.js     # Logic (Lang, Form, UI)
│   └── lang/
│       ├── en.json     # English translations
│       └── hi.json     # Hindi translations
└── README.md
```

## Setup & Deployment

1.  **Local Development**:
    -   Simply open `index.html` in your browser.
    -   OR run a local server (e.g., `python -m http.server` or `npx serve .`) to avoid CORS issues with JSON fetching (Chrome might block local file access to JSON).

2.  **Deployment (Netlify / GitHub Pages)**:
    -   **GitHub Pages**: Push this code to a repo, go to Settings > Pages, select `main` branch.
    -   **Netlify**: Drag and drop the folder onto Netlify, or connect your GitHub repo.

3.  **DNS Configuration**:
    -   Go to your domain provider (e.g., Godaddy, Namecheap).
    -   Add an `A Record` pointing to your host's IP (if Netlify, usually `75.2.60.5` or use CNAME `your-site-name.netlify.app`).

4.  **SSL**:
    -   Netlify/GitHub Pages provide free automatic SSL (HTTPS). Ensure "Force HTTPS" is enabled in settings.

## Customization
-   **Images**: Replace the placeholder background URL in `assets/css/style.css` (`.hero-section`) and add real gallery images.
-   **Form Endpoint**: In `assets/js/main.js`, replace the mock `handleFormSubmit` logic with a real `fetch` call to your backend or a service like Formspree.

## Browser Support
-   Chrome, Firefox, Safari, Edge (Latest versions).
-   ES6 compatible.
