
# Inscribed Squares 📐

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive web application that explores the famous "Square Peg Problem" in computational geometry. Draw any closed curve and discover all possible squares that can be inscribed within it.

🔗 [Live Demo](https://achalrajyaguru.github.io/Inscribed-Squares/)

![Inscribed Squares Demo](public/favicon.svg)

## 🎯 Features

- **Interactive Drawing**: Freehand drawing on a canvas with grid and axes
- **Real-time Detection**: 
  - Automatic curve closure when endpoint nears start
  - Finds all inscribed squares with vertex-on-curve detection
- **Visual Results**: 
  - Each square rendered in a unique color
  - Precise vertex markers and coordinates
  - Side panel shows exact (x,y) positions
- **Export Options**: 
  - Save canvas as PNG
  - Export square data as JSON
- **Mathematical Insights**: Detailed theory tab explaining the approach

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0 (LTS recommended)
- npm (comes with Node) or yarn/pnpm

### Quick Start

```bash
# Clone the repository
git clone https://github.com/achalrajyaguru/Inscribed-Squares.git

# Navigate to project
cd Inscribed-Squares

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser

### Production Build

```bash
# Create optimized build
npm run build

# Preview production version
npm run preview
```

## 💡 How It Works

The Square Peg Problem (Toeplitz's conjecture) asks whether every continuous closed curve contains four points forming a square. While the general case remains unsolved, this app demonstrates a computational approach:

1. **Curve Sampling**: Converts freehand drawing into evenly-spaced points
2. **Square Detection**:
   - Tries potential square sides and diagonals
   - Projects vertices onto curve segments
   - Validates shape with customizable tolerances
3. **Deduplication**: Removes near-duplicate squares using smart hashing

Visit the Theory tab in-app for detailed mathematical explanations.

## 🧪 Testing

```bash
# Run test suite
npm test
```

## 📖 Documentation

Key folders:
- `src/geometry/` - Core geometric algorithms
- `src/components/` - React UI components
- `src/hooks/` - Custom React hooks for canvas/state
- `src/utils/` - Helper functions

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📬 Contact

Feel free to open an issue for questions or suggestions.
