# 🎨 Real-Time Collaborative Infinite Whiteboard

> A modern, high-performance, real-time collaborative infinite whiteboard web application built with **React**, **HTML5 Canvas API**, **Tailwind CSS**, **Node.js**, and **Socket.IO**.

---

## ✨ Features & Capabilities

### 🎨 Vector Drawing & Annotation Tools
- **11 Drawing Tools**:
  - ↖️ **Select Tool (`S`)**: Single-object & marquee selection box, bounding box corner handles, real-time drag moving, and `Delete`/`Backspace` key removal.
  - ✏️ **Pen Tool (`P`)**: Smooth freehand vector drawing with custom color swatches and stroke thickness control.
  - 🧹 **Grid-Preserving Eraser (`E`)**: Erases vector strokes cleanly using offscreen double-buffering without destroying the background grid pattern.
  - 📌 **Digital Sticky Notes (`N`)**: 5 pastel color presets (Yellow, Pink, Cyan, Green, Purple) with double-click inline text editing.
  - 💻 **Code Snippet Cards (`K`)**: Dark slate code cards (`#0f172a`) with macOS window controls, language labels, and monospaced code editing.
  - 📐 **Geometric Shapes**: Rectangles (`R`), Circles/Ellipses (`C`), Lines (`L`), Directional Arrows (`A`), and Text Tool (`T`).
  - 🪄 **Laser Pointer (`V`)**: Glowing transient presentation trail that decays smoothly in real-time across connected users.

### 🌐 Infinite Canvas Viewport & Navigation
- **Cursor-Anchored Zooming**: Mouse wheel zoom from `10%` to `500%` centered precisely around mouse pointer tip.
- **Infinite Pan**: `Spacebar + Mouse Drag` or `Middle-Click Drag` to navigate unlimited canvas space.
- **Interactive Minimap Radar**: Floating bottom-left radar widget rendering miniature stroke previews and translucent live camera viewport box. Click or drag on the minimap to instantly jump camera position.
- **4 Background Canvas Themes**: `Grid` lines, `Dot-Grid`, `Blank` white, and `Dark Slate` (`#0f172a`).

### ⚡ Real-Time Collaboration & Room Management
- **Socket.IO Room Sync**: Real-time multi-user drawing, object movement, text updates, room clearing, and undo stack.
- **Live User Cursor Badges**: Shows real-time remote mouse cursor positions with animated user name badges.
- **Room Chat Drawer**: Sleek expandable chat sidebar with system join/leave notifications.
- **Fullscreen Presentation Mode (`F`)**: Distraction-free presentation mode with top floating indicator pill.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, HTML5 Canvas 2D Context API, WebSockets (`socket.io-client`).
- **Backend**: Node.js, Express.js, Socket.IO.
- **Architecture**: Offscreen double-buffering canvas layer for destination-out erasing, custom matrix transformation pipeline (`setTransform`).

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/) (v8.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/collaborative-whiteboard.git
cd collaborative-whiteboard
```

### 2. Install Dependencies
```bash
# Install root, client, and server dependencies
npm run install:all
```

### 3. Start Development Servers
Run backend server and client frontend in separate terminal windows:

**Terminal 1 (Backend Server on Port 4000):**
```bash
npm run dev:server
```

**Terminal 2 (Frontend Client on Port 3001):**
```bash
npm run dev:client
```

Open your browser and navigate to **`http://localhost:3001`**.

---

## ⌨️ Keyboard Shortcuts Reference

| Key / Hotkey | Action / Feature |
| :--- | :--- |
| <kbd>S</kbd> | Activate **Select Tool** (Click or drag marquee box) |
| <kbd>P</kbd> | Activate **Pen Tool** |
| <kbd>E</kbd> | Activate **Eraser Tool** |
| <kbd>N</kbd> | Activate **Sticky Note** (Click canvas to place) |
| <kbd>K</kbd> | Activate **Code Snippet Card** |
| <kbd>R</kbd> | Draw **Rectangle** |
| <kbd>C</kbd> | Draw **Circle / Ellipse** |
| <kbd>L</kbd> | Draw **Line** |
| <kbd>A</kbd> | Draw **Directional Arrow** |
| <kbd>T</kbd> | Add **Text** |
| <kbd>V</kbd> | Activate **Laser Pointer** |
| <kbd>F</kbd> | Toggle **Presentation Mode** |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | Delete selected object |
| <kbd>Space</kbd> + Drag | Pan infinite canvas |
| Mouse Wheel | Zoom in / Zoom out |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Undo last action |
| <kbd>?</kbd> | Open Shortcuts cheat sheet |

---

## ⚙️ Architecture Highlight: Offscreen Canvas Layering

To allow vector erasing (`destination-out`) without erasing the underlying grid or dark background:
1. **Main Canvas Context**: Renders background pattern (`Grid`, `Dots`, `Dark`) in screen space.
2. **Offscreen Layer**: All strokes (pen lines, sticky notes, code cards, shapes) are drawn onto an in-memory offscreen canvas buffer.
3. **Erasing**: Eraser uses `globalCompositeOperation = 'destination-out'` exclusively on the offscreen canvas layer.
4. **Compositing**: The offscreen buffer is composited onto the main canvas using `mainCtx.drawImage(offscreen, 0, 0)`.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
