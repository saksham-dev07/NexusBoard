# 🎨 Real-Time Collaborative Infinite Whiteboard

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38BDF8?logo=tailwindcss&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

<p align="center">
  <b>A high-performance, multi-user real-time collaborative infinite canvas built with React, HTML5 Canvas 2D API, Tailwind CSS, Node.js, and Socket.IO.</b>
</p>

</div>

---

## 📌 Table of Contents

- [🌟 Features Overview](#-features-overview)
- [🏗️ System Architecture](#️-system-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [⌨️ Keyboard & Mouse Shortcuts](#️-keyboard--mouse-shortcuts)
- [🔌 Socket.IO Event Reference](#-socketio-event-reference)
- [📁 Directory Structure](#-directory-structure)
- [🤝 Contributing & License](#-contributing--license)

---

## 🌟 Features Overview

### 🎨 1. Vector Drawing & Categorized Tool Suite
- **🗂️ Single-Row Horizontal Scroll Categories**: Compact 4-category tool palette with horizontal scrollbars (`General & Select`, `Cards & Notes`, `Flowchart Suite`, `Shapes & Lines`).
- **↖️ Select Tool (`S`)**: Single-object & marquee box selection, bounding box corner handle resizing, real-time object dragging, and `Delete`/`Backspace` key removal.
- **✏️ Pen Tool (`P`)**: Smooth vector drawing with custom color swatches and stroke thickness control (1px to 50px).
- **🎨 Line Style Selector**: Toggle between Solid (`──`), Dashed (`╌`), and Dotted (`┈`) stroke patterns across shapes and lines.
- **🧹 Grid-Preserving Eraser (`E`)**: Erases vector drawings using offscreen double-buffering without destroying the background grid pattern.
- **📌 Digital Sticky Notes (`N`)**: 5 pastel color presets (Yellow, Pink, Cyan, Green, Purple) with double-click inline text editing.
- **💻 Code Snippet Cards (`K`)**: Dark slate code cards (`#0f172a`) with macOS window controls, language labels, and monospaced code editing.
- **🖼️ Image Upload & Drag-and-Drop**: Viewport-center spawning, natural aspect ratio calculation, drag & drop image ingestion, and corner handle resizing.
- **😍 Emoji Stamps Palette (`X`)**: Quick visual feedback stamps (`🚀`, `💡`, `✅`, `❌`, `🔥`, `⚠️`, `⭐`, `🎯`).
- **📊 Flowchart Suite**: Decision Rhombus (`D`), Process Box (`B`), Database Cylinder (`H`), Terminal Pill (`M`), and Cloud Node (`U`).
- **📐 Shapes & Lines**: Rectangles (`R`), Circles (`C`), Triangles (`I`), Stars (`J`), Lines (`L`), Arrows (`A`), and Text (`T`).
- **🪄 Laser Pointer (`V`)**: Glowing transient presentation trail that decays smoothly across connected room users.

### 🌐 2. Infinite Viewport & Navigation
- **Cursor-Anchored Zoom**: Mouse wheel zoom (`10%` to `500%`) centered precisely around mouse pointer tip.
- **Infinite Pan**: `Spacebar + Drag` or `Middle-Click Drag` to navigate unlimited canvas space.
- **Interactive Minimap Radar**: Floating bottom-left radar widget rendering miniature stroke previews and translucent live camera viewport box. Click or drag to jump camera position.
- **4 Canvas Themes**: `Grid` lines, `Dot-Grid`, `Blank` white, and `Dark Slate` (`#0f172a`).

### ⚡ 3. Real-Time Collaboration & Room System
- **Room Isolation**: Unique 8-character Room IDs supporting instant join/create flows.
- **Live Remote Cursors**: Animated mouse cursor indicators with user name badges.
- **Expandable Room Chat**: Collapsible chat sidebar with system join/leave notifications.
- **Import & Export Board State**: Export as high-resolution PNG or JSON, and re-import JSON files to restore boards.
- **Fullscreen Presentation Mode (`F`)**: Distraction-free presentation view with floating indicator pill.

---

## 🏗️ System Architecture

### Offscreen Double-Buffering Layer Pipeline

```
  ┌─────────────────────────────────────────────────────────────┐
  │                    Main Screen Canvas                       │
  │  1. Render Background Pattern (Grid / Dots / Dark Theme)    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ Composites
  ┌─────────────────────────────────────────────────────────────┐
  │                 Offscreen Canvas Layer                      │
  │  2. Render Vector Strokes (Pen, Shapes, Sticky Notes)       │
  │  3. Eraser operates using 'destination-out' (Grid Intact)   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼ Emits Matrix Strokes
  ┌─────────────────────────────────────────────────────────────┐
  │                   Socket.IO Room Gateway                    │
  │  4. Real-time synchronization across multi-user sessions    │
  └──────────────────────────────┴──────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 | Declarative component UI state management |
| **Styling & Theme** | Tailwind CSS | Modern glassmorphism floating UI layout |
| **Canvas Engine** | HTML5 2D Context API | World matrix transformations (`setTransform`) & offscreen buffering |
| **Real-time Gateway** | Socket.IO Client | Real-time WebSocket bidirectional event streaming |
| **Backend Runtime** | Node.js & Express.js | In-memory room manager & socket dispatcher |
| **Error Handling** | React Error Boundary | Top-level crash interception & recovery |

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: `v16.0.0` or higher
- **npm**: `v8.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 2. Install All Dependencies
```bash
npm run install:all
```

### 3. Launch Development Servers

**Option A — Separate Terminal Windows:**
```bash
# Terminal 1: Backend Server (Port 4000)
npm run dev:server

# Terminal 2: Frontend Client (Port 3001)
npm run dev:client
```

Open your browser and navigate to **`http://localhost:3001`**.

---

## ⌨️ Keyboard & Mouse Shortcuts

| Shortcut | Tool / Action | Description |
| :---: | :--- | :--- |
| <kbd>S</kbd> | **Select Tool** | Click or drag marquee box to select & resize objects |
| <kbd>P</kbd> | **Pen Tool** | Freehand vector drawing |
| <kbd>E</kbd> | **Eraser Tool** | Grid-preserving stroke eraser |
| <kbd>N</kbd> | **Sticky Note** | Place colorful digital sticky note |
| <kbd>K</kbd> | **Code Snippet** | Add syntax-highlighted code card |
| <kbd>X</kbd> | **Emoji Stamp** | Stamp emojis (`🚀`, `💡`, `✅`, `❌`, `🔥`, `⚠️`, `⭐`, `🎯`) |
| <kbd>D</kbd> | **Decision Node** | Draw flowchart decision rhombus |
| <kbd>B</kbd> | **Process Box** | Draw flowchart process box |
| <kbd>H</kbd> | **Database** | Draw database cylinder shape |
| <kbd>M</kbd> | **Terminal Pill** | Draw start/end terminal node |
| <kbd>U</kbd> | **Cloud Node** | Draw cloud service / API node |
| <kbd>J</kbd> | **Star Badge** | Draw priority star badge shape |
| <kbd>I</kbd> | **Triangle Node** | Draw delta / pyramid triangle |
| <kbd>R</kbd> | **Rectangle** | Draw rectangles & boxes |
| <kbd>C</kbd> | **Circle** | Draw circles & ellipses |
| <kbd>L</kbd> | **Line** | Draw straight lines |
| <kbd>A</kbd> | **Arrow** | Draw directional arrows |
| <kbd>T</kbd> | **Text Tool** | Click canvas to type text |
| <kbd>V</kbd> | **Laser Pointer** | Transient glowing presentation trail |
| <kbd>F</kbd> | **Presentation** | Toggle clean fullscreen presentation mode |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | **Delete Object** | Remove selected stroke/card/image |
| <kbd>Space</kbd> + Drag | **Pan Canvas** | Drag across infinite canvas |
| Mouse Wheel | **Zoom** | Zoom centered around cursor tip |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | **Undo** | Undo last stroke |
| <kbd>?</kbd> | **Shortcuts** | Open hotkeys cheat sheet |

---

## 🔌 Socket.IO Event Reference

| Event Name | Direction | Payload Description |
| :--- | :---: | :--- |
| `join-room` | Client ➔ Server | `{ roomId, userName }` |
| `room-state` | Server ➔ Client | `{ strokes: [], users: [] }` |
| `draw` | Bi-directional | `{ id, tool, color, width, path, text, src, stamp, ... }` |
| `update-stroke` | Bi-directional | `{ roomId, updatedStroke }` |
| `delete-stroke` | Bi-directional | `{ roomId, strokeId }` |
| `clear` | Bi-directional | `{ roomId }` |
| `undo` | Bi-directional | `{ roomId }` |
| `chat` | Bi-directional | `{ roomId, message, timestamp }` |
| `cursor` | Bi-directional | `{ roomId, cursor: { x, y } }` |
| `laser` | Bi-directional | `{ roomId, point: { x, y, color } }` |

---

## 📁 Directory Structure

```text
collaborative-whiteboard/
├── client/                     # Frontend React Application
│   ├── public/                 # HTML Index & Static Assets
│   └── src/
│       ├── components/         # React UI Components
│       │   ├── WhiteboardCanvas.jsx   # 2D Canvas Engine & Interaction Matrix
│       │   ├── Toolbar.jsx            # Single-Row Categorized Tool Palette
│       │   ├── Header.jsx             # Room Info & Action Bar
│       │   ├── Minimap.jsx            # Interactive Viewport Radar
│       │   ├── ChatSidebar.jsx        # Expandable Room Chat Drawer
│       │   ├── JoinModal.jsx          # Room Join / Create Modal
│       │   ├── ShortcutsModal.jsx     # Hotkeys Reference Table
│       │   └── ErrorBoundary.jsx      # React Error Boundary Protection
│       ├── hooks/
│       │   └── useWhiteboard.js       # Socket.IO Connection & State Hook
│       ├── App.jsx             # Main Application Layout
│       ├── index.js            # React Root Entry Point
│       └── index.css           # Tailwind Utility System & Glassmorphism
├── server/                     # Backend Node.js / Express Application
│   ├── index.js                # Express & Socket.IO Room Server
│   └── package.json            # Server Dependencies
├── package.json                # Root Scripts Manager
└── README.md                   # Project Documentation
```

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/collaborative-whiteboard/issues).

Distributed under the **MIT License**. See `LICENSE` for more information.
