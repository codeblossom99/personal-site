# Personal Site

A small static personal site for Hera. The current direction is English-first,
tool-like, and direct: calculator-style typography, video timecode details,
the original purple accent palette, and a quiet `Hello` opening instead of a
portfolio slogan.

## Structure

```text
personal-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── README.md
```

## Design Notes

- Default language is English. Traditional Chinese is available through the
  language toggle.
- `Space Grotesk` is used for readable UI text, while `IBM Plex Mono` carries
  the calculator / terminal feeling in headings, controls, tags, and timecode.
- The visual system is intentionally small: dark or light background, soft grid,
  timecode rail, and the original purple accent family.
- Keep the hero minimal. The first line should stay `Hello`; describe the work
  in the supporting copy and project sections.

## Local Preview

This is a plain static site. Open `index.html` directly or run a small static
server:

```bash
python3 -m http.server 8080
```
