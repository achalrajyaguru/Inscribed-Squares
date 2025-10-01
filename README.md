
# Inscribed Squares

A one-page React + TypeScript web app. You draw a closed loop on a white grid canvas with Cartesian axes. Click **Generate** to compute and render all **inscribed squares** on the curve. Each square is drawn in a distinct color and its four vertex coordinates are listed. The app runs fully client-side. No authentication.

---

## What this app does

- Freehand drawing on a canvas with a light grid and centered x/y axes.
- Snap-to-close: if the path ends near the start, it closes the loop.
- **Generate** finds all squares whose vertices lie on the sampled curve.
- Each square:
  - Renders with its own stroke color and vertex dots.
  - Shows coordinates `(x, y)` for all four vertices in a side panel.
- Utilities: **Undo**, **Clear**, **Export JSON**, **Save PNG**.
- A **Theory** tab explains the math and the numerical method.

---

## Quick start

### Prerequisites
- Node.js 18 or newer (LTS recommended)
- npm (bundled with Node). Yarn or pnpm also work.

### Clone and run
```bash
# clone your repo
git clone https://github.com/achalrajyaguru/Inscribed-Squares.git
cd Inscribed-Squares

# install dependencies
npm install

# start dev server
npm run dev
