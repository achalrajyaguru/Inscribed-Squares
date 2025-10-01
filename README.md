Here’s a single, copy-paste README.md with everything.

# Inscribed Squares — Draw a Loop, Find the Squares

A one-page React + TypeScript web app. You draw a closed loop on a white grid canvas with Cartesian axes. Click **Generate** to find and draw all **inscribed squares**. Each square has its own color. The app lists exact vertex coordinates.

This is a math-curiosity and portfolio project inspired by the classical “Square Peg” question. No login. No backend.

---

## Table of Contents
- [What This App Does](#what-this-app-does)
- [Live Demo Options](#live-demo-options)
- [Quick Start (Non-technical)](#quick-start-non-technical)
- [Full Setup (Developers)](#full-setup-developers)
- [How To Use](#how-to-use)
- [Features](#features)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Geometry Overview](#geometry-overview)
- [Theory Tab Content](#theory-tab-content)
- [Performance Notes](#performance-notes)
- [Testing](#testing)
- [Deploying](#deploying)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [GitHub-Pages](#github-pages)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Keyboard & Accessibility](#keyboard--accessibility)
- [License](#license)
- [Credits](#credits)

---

## What This App Does
- Draw any loop on a canvas with grid and axes.
- App checks the loop is closed. If not closed, it shows an error.
- On **Generate**, app searches the curve and draws all squares that fit fully on it.
- Lists coordinates for each square’s four vertices.
- Export results to JSON. Save the canvas as PNG.
- Separate **Theory** tab explains the math and approach.

---

## Live Demo Options
Pick one. Both are free.
- **Vercel**: connect your GitHub repo. It builds and hosts automatically.
- **Netlify**: same idea. Connect repo, auto builds.

If you prefer GitHub only: use **GitHub Pages**. Steps below.

---

## Quick Start (Non-technical)
1. **Install Node.js**  
   - Go to nodejs.org → download **LTS**. Install it.  
   - After install, open Terminal or Command Prompt and check:
     ```bash
     node -v
     npm -v
     ```
2. **Download code**
   - If you already have a folder, skip.  
   - Otherwise clone or download ZIP from GitHub and unzip.

3. **Open the project folder**, then run:
   ```bash
   npm install
   npm run dev

	4.	Open the app
	•	Terminal shows a local URL, usually http://localhost:5173/.
	•	Open it in your browser.

That is all for running locally.

⸻

Full Setup (Developers)

# clone
git clone https://github.com/<your-username>/inscribed-squares.git
cd inscribed-squares

# install
npm install

# run
npm run dev

# build
npm run build

# preview production build
npm run preview


⸻

How To Use
	1.	Move your mouse over the white canvas. It turns into a pen.
	2.	Press and hold to draw. Make a loop that ends near where it started.
	3.	Release near the start. The app snaps it closed if within a small distance.
	4.	Click Generate to detect squares.
	5.	See colored squares over the loop and coordinates in the side panel.
	6.	Undo to remove the last stroke. Clear to reset everything.
	7.	Export JSON to save square data. Save PNG to download the canvas image.
	8.	Click the Theory tab to read the math notes.

If you click Generate without closing the loop, the app shows an error.

⸻

Features
	•	One page. Tabs: Canvas | Theory.
	•	White canvas. Light grid every 40 px. Centered x and y axes.
	•	Pen cursor on hover. Live x,y tooltip near the cursor.
	•	Snap-close if end is near start. Generate disabled until loop is closed.
	•	Distinct colors per square. Dots at square vertices.
	•	Exact coordinates listed with two decimals.
	•	Undo, Clear, Export JSON, Save PNG.
	•	Error toasts for invalid actions.

⸻

Screenshots

Add your own screenshot named screenshot.png to the repo root or /docs/ and reference here:

![Inscribed Squares screenshot](./docs/screenshot.png)

Optional wireframe or mockup images can go in /docs/.

⸻

Project Structure

src/
  main.tsx
  app.tsx
  styles.css
  components/
    CanvasBoard.tsx
    Controls.tsx
    ResultsPanel.tsx
    Tabs.tsx
    Toast.tsx
  geometry/
    types.ts
    resample.ts
    project.ts
    squares.ts
    dedupe.ts
    squares.worker.ts    # optional, for performance
  hooks/
    useCanvas.ts
    useSquares.ts
  utils/
    format.ts
  theory.md
index.html
vite.config.ts
tsconfig.json


⸻

Geometry Overview

Goal: find all squares whose four vertices lie on the user’s closed curve (approximated as a polygonal chain).

Pipeline:
	1.	Resample the user path to M evenly spaced points by arc length. Default M = 300.
	2.	For each ordered pair (i, j) with i ≠ j:
	•	Side-based: treat segment p_i → p_j as a square side. Rotate ±90° to compute the other two vertices.
	•	Diagonal-based: treat p_i → p_j as a square diagonal. Rotate ±45° and scale by 1/√2 for the side.
	3.	Hit test missing vertices: project onto curve segments; accept if min distance ≤ ε_hit.
	4.	Validate shape: sides equal within τ_side and angles right within τ_angle.
	5.	Deduplicate squares by normalized vertex order and rounded hash.
	6.	Sort by side length, largest first.

Defaults:
	•	ε_close = 6 px (snap to close loop)
	•	ε_hit = 5 px (vertex near curve)
	•	τ_side = 2% (side equality tolerance)
	•	τ_angle = 2° (right angle tolerance)

Complexity: roughly O(M^2). With M=300, this is practical in the browser. Worker recommended.

⸻

Theory Tab Content

Suggested outline (already in theory.md):
	•	Definitions
Simple closed curve. Inscribed polygon. Cartesian coordinates.
	•	Square Peg problem
The classical question asks whether every simple closed curve contains an inscribed square. This app uses a numeric approximation on a sampled polygon, so it is not a proof tool.
	•	Polygonal approximation
Freehand paths become polylines via resampling. We work with segments only.
	•	Detection strategy
Generate candidates (side-based and diagonal-based), check proximity to the curve, then validate and deduplicate.
	•	Limitations
Sampling can miss tiny squares. Noise creates near-duplicates. Floating-point error requires tolerances.
	•	Further exploration
Try changing M, tolerances, and search scopes to see different behaviors.

⸻

Performance Notes
	•	Use a Web Worker to keep the UI responsive for O(M^2) search.
	•	Optional spatial hash to reduce candidate segment checks during vertex hit testing.
	•	Reasonable target: M=300–400 with < 150 ms on typical laptops.

⸻

Testing

Install test tools:

npm i -D vitest @types/node

Sample scripts in package.json:

{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}

What to test:
	•	resample.ts: point count, closure, near-uniform spacing on a circle.
	•	project.ts: distance to axis-aligned and diagonal segments.
	•	squares.ts: detection on:
	•	Circle loop (expect ≥ 1 square).
	•	Axis-aligned square loop (self and rotated ones).
	•	Smooth “peanut” loop (no duplicates after dedupe).

Run:

npm run test


⸻

Deploying

Vercel
	1.	Push your repo to GitHub.
	2.	Go to vercel.com → Add New Project → Import your repo.
	3.	Framework preset: Vite.
	4.	Build command: vite build (default). Output: dist.
	5.	Deploy. Vercel gives a live URL.

Netlify
	1.	Push your repo to GitHub.
	2.	Go to app.netlify.com → Add new site from Git → pick repo.
	3.	Build command: npm run build. Publish directory: dist.
	4.	Deploy.

GitHub Pages
	1.	Install helper:

npm i -D gh-pages


	2.	Add script to package.json:

"scripts": {
  "deploy": "vite build && gh-pages -d dist"
}


	3.	Deploy:

npm run deploy



⸻

Troubleshooting
	•	npm not found: Node.js not installed or not in PATH. Install Node LTS from nodejs.org.
	•	Port already in use: another app uses the port. Run npm run dev -- --port 5174 or close the other app.
	•	Blank page after build: if hosting under a subpath (GitHub Pages), set base in vite.config.ts to '/<repo-name>/'.
	•	Generate does nothing: ensure loop is closed. End near start so it snaps. Generate stays disabled otherwise.
	•	No squares found: try a smoother, rounder loop. Increase M in resampling. Relax tolerances slightly.

⸻

FAQ

Q: Do I need a backend or a database?
A: No.

Q: Can I save my drawing?
A: Use Save PNG for the canvas. Use Export JSON for square coordinates.

Q: Does this prove the Square Peg problem?
A: No. This is a numeric search on a sampled polygon.

Q: Will it find every possible square?
A: Not guaranteed. It depends on sampling density and tolerances.

Q: How do I share my project?
A: Deploy to Vercel or Netlify. Put the demo link in your portfolio.

⸻

Keyboard & Accessibility
	•	Buttons are tabbable.
	•	High-contrast mode toggle recommended if you add themes.
	•	Consider adding keyboard shortcuts:
	•	g → Generate
	•	u → Undo
	•	c → Clear
	•	e → Export JSON
	•	s → Save PNG

⸻

License

MIT. Free for personal, academic, and commercial use. No warranty.

⸻

Credits
	•	Built with React, TypeScript, and Vite.
	•	Inspired by classical results on inscribed polygons in closed curves.
