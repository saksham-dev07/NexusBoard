import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react';

// Rock-solid Base64 cursor data URIs (100% visible on white canvas and dark theme across all browsers)
const BASE64_CURSORS = {
  crosshair:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIyLjUiIGZpbGw9IiMwZjE3MmEiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48bGluZSB4MT0iMTIiIHkxPSIxIiB4Mj0iMTIiIHkyPSI4IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMiIgeTI9IjIzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjEiIHkxPSIxMiIgeDI9IjgiIHkyPSIxMiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxNiIgeTE9IjEyIiB4Mj0iMjMiIHkyPSIxMiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxMiIgeTE9IjEiIHgyPSIxMiIgeTI9IjgiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxMiIgeTE9IjE2IiB4Mj0iMTIiIHkyPSIyMyIgc3Ryb2tlPSIjMGYxNzJhIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjEiIHkxPSIxMiIgeDI9IjgiIHkyPSIxMiIgc3Ryb2tlPSIjMGYxNzJhIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjE2IiB5MT0iMTIiIHgyPSIyMyIgeTI9IjEyIiBzdHJva2U9IiMwZjE3MmEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=') 12 12, crosshair",

  text:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48bGluZSB4MT0iNyIgeTE9IjIiIHgyPSIxNyIgeTI9IjIiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI0LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxMiIgeTE9IjIiIHgyPSIxMiIgeTI9IjIyIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48bGluZSB4MT0iNyIgeTE9IjIyIiB4Mj0iMTciIHkyPSIyMiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjQuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjciIHkxPSIyIiB4Mj0iMTciIHkyPSIyIiBzdHJva2U9IiMwZjE3MmEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjEyIiB5MT0iMiIgeDI9IjEyIiB5Mj0iMjIiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48bGluZSB4MT0iNyIgeTE9IjIyIiB4Mj0iMTciIHkyPSIyMiIgc3Ryb2tlPSIjMGYxNzJhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==') 12 12, text",

  grab:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48cGF0aCBkPSJNOCA0YTEuNSAxLjUgMCAwIDEgMS41IDEuNVYxMGgxVjNhMS41IDEuNSAwIDAgMSAzIDB2N2gxVjRhMS41IDEuNSAwIDAgMSAzIDB2NmgxVjYuNWExLjUgMS41IDAgMCAxIDMgMHY5LjVjMCA0LjQtMy42IDgtOCA4cy04LTMuNi04LTh2LTdhMS41IDEuNSAwIDAgMSAzIDB2NGgxVjUuNUExLjUgMS41IDAgMCAxIDggNHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOCA0YTEuNSAxLjUgMCAwIDEgMS41IDEuNVYxMGgxVjNhMS41IDEuNSAwIDAgMSAzIDB2N2gxVjRhMS41IDEuNSAwIDAgMSAzIDB2NmgxVjYuNWExLjUgMS41IDAgMCAxIDMgMHY5LjVjMCA0LjQtMy42IDgtOCA4cy04LTMuNi04LTh2LTdhMS41IDEuNSAwIDAgMSAzIDB2NGgxVjUuNUExLjUgMS41IDAgMCAxIDggNHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+') 14 14, grab",

  grabbing:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij48cGF0aCBkPSJNNyAxMWMwLTIuMiAxLjgtNCA0LTRoNmMyLjIgMCA0IDEuOCA0IDR2NWMwIDQuNC0zLjYgOC04IDhzLTgtMy42LTgtOHYtNXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNNyAxMWMwLTIuMiAxLjgtNCA0LTRoNmMyLjIgMCA0IDEuOCA0IDR2NWMwIDQuNC0zLjYgOC04IDhzLTgtMy42LTgtOHYtNXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PGxpbmUgeDE9IjExIiB5MT0iNyIgeDI9IjExIiB5Mj0iMTQiIHN0cm9rZT0iIzBmMTcyYSIgc3Ryb2tlLXdpZHRoPSIxLjgiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSIxNCIgeTE9IjciIHgyPSIxNCIgeTI9IjE0IiBzdHJva2U9IiMwZjE3MmEiIHN0cm9rZS13aWR0aD0iMS44IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48bGluZSB4MT0iMTciIHkxPSI3IiB4Mj0iMTciIHkyPSIxNCIgc3Ryb2tlPSIjMGYxNzJhIiBzdHJva2Utd2lkdGg9IjEuOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+') 14 14, grabbing",

  select:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMiAybDcgMTkgMy41LTcuNUwyMCAxMCAyIDJ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMy41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIgMmw3IDE5IDMuNS03LjVMMjAgMTAgMiAyeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMGYxNzJhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=') 2 2, default",

  eraser:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBmaWxsPSIjZmVlMmUyIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2VmNDQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMS41IiBmaWxsPSIjZWY0NDQ0Ii8+PC9zdmc+') 12 12, crosshair",

  laser:
    "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI1IiBmaWxsPSIjZWY0NDQ0IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41Ii8+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMS41IiBmaWxsPSIjZmZmZmZmIi8+PC9zdmc+') 12 12, crosshair",
};

// Tools that legitimately support text editing (pen/drawing lines are NOT text editable)
const TEXT_EDITABLE_TOOLS = new Set([
  'text',
  'sticky',
  'code',
  'rectangle',
  'circle',
  'triangle',
  'star',
  'decision',
  'diamond',
  'process',
  'database',
  'pill',
  'cloud',
]);

const WhiteboardCanvas = forwardRef(function WhiteboardCanvas(
  {
    tool,
    color,
    width,
    lineStyle = 'solid',
    selectedStamp = '🚀',
    strokes,
    cursors,
    bgTheme = 'grid-lines',
    onFinishStroke,
    onUpdateStroke,
    onDeleteStroke,
    onCursorMove,
    onLaserMove,
    remoteLaserEvents,
    onSelectTool,
    onImageUpload,
    onViewportChange,
  },
  ref
) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const currentPathRef = useRef([]);
  const strokesRef = useRef(strokes);
  const redrawAllRef = useRef(null);
  useEffect(() => {
    strokesRef.current = strokes;
    if (redrawAllRef.current) {
      redrawAllRef.current(strokes);
    }
  }, [strokes]);

  // In-memory image object cache
  const imgCacheRef = useRef({});

  // Selection state
  const [selectedStrokeId, setSelectedStrokeId] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null); // { startX, startY, currentX, currentY }
  const isDraggingSelectedRef = useRef(false);
  const isResizingRef = useRef(false);
  const resizeHandleRef = useRef(null); // 'br', 'bl', 'tr', 'tl'
  const dragStartWorldRef = useRef({ x: 0, y: 0 });

  // Offscreen layer canvas ref to allow true destination-out erasing without destroying background grid
  const offscreenCanvasRef = useRef(null);
  if (!offscreenCanvasRef.current && typeof document !== 'undefined') {
    offscreenCanvasRef.current = document.createElement('canvas');
  }

  // Viewport State (Zoom & Pan)
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const zoomRef = useRef(zoom);
  const panOffsetRef = useRef(panOffset);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    panOffsetRef.current = panOffset;
  }, [panOffset]);

  // Pointer-based multi-touch tracking for 2-finger zoom in / zoom out and pan
  const activePointersRef = useRef(new Map());
  const pinchRef = useRef(null);
  const lastPinchEndTimeRef = useRef(0);

  const isPanningRef = useRef(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  // Notify parent of viewport changes
  useEffect(() => {
    if (onViewportChange) {
      onViewportChange({ zoom, panOffset });
    }
  }, [zoom, panOffset, onViewportChange]);

  // Prevent browser viewport pinch-zoom on mobile web page
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefaultMultiTouch = (e) => {
      if (e.touches && e.touches.length >= 2) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('touchstart', preventDefaultMultiTouch, { passive: false });
    canvas.addEventListener('touchmove', preventDefaultMultiTouch, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', preventDefaultMultiTouch);
      canvas.removeEventListener('touchmove', preventDefaultMultiTouch);
    };
  }, []);

  // Text / Sticky / Code card inline input state: { type, x, y, value, editingStrokeId }
  const [cardInput, setCardInput] = useState(null);
  const textInputRef = useRef(null);

  // Guarantee instant auto-focus once when text card opens (does not re-select on typing)
  const cardInputKey = cardInput ? `${cardInput.type}_${cardInput.editingStrokeId || 'new'}` : null;
  useEffect(() => {
    if (cardInputKey && cardInput && cardInput.type !== 'sticky' && cardInput.type !== 'code') {
      const timer = setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          const len = textInputRef.current.value ? textInputRef.current.value.length : 0;
          textInputRef.current.setSelectionRange(len, len);
        }
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [cardInputKey]);

  // Laser points ref: array of { x, y, timestamp, color }
  const laserTrailRef = useRef([]);
  const animFrameRef = useRef(null);

  // Convert screen coordinates to world space coordinates
  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    return {
      x: (screenX - panOffset.x) / zoom,
      y: (screenY - panOffset.y) / zoom,
    };
  }, [zoom, panOffset]);

  // Bounding box calculation helper
  const getStrokeBoundingBox = useCallback((stroke) => {
    if (!stroke) return null;
    const path = stroke.path || [];

    if (stroke.tool === 'sticky') {
      const start = path[0] || { x: 0, y: 0 };
      const w = stroke.cardWidth || 180;
      const lines = (stroke.text || '').split('\n');
      const computedH = Math.max(140, 40 + lines.length * 20);
      const h = stroke.cardHeight || computedH;
      return { x: start.x, y: start.y, width: w, height: h };
    }

    if (stroke.tool === 'code') {
      const start = path[0] || { x: 0, y: 0 };
      const w = stroke.cardWidth || 260;
      const lines = (stroke.text || '').split('\n');
      const computedH = Math.max(160, 44 + lines.length * 18);
      const h = stroke.cardHeight || computedH;
      return { x: start.x, y: start.y, width: w, height: h };
    }

    if (stroke.tool === 'image') {
      const start = path[0] || { x: 0, y: 0 };
      return { x: start.x, y: start.y, width: stroke.imgWidth || 240, height: stroke.imgHeight || 180 };
    }

    if (stroke.tool === 'stamp') {
      const start = path[0] || { x: 0, y: 0 };
      return { x: start.x - 24, y: start.y - 24, width: 48, height: 48 };
    }

    if (stroke.tool === 'text') {
      const start = path[0] || { x: 0, y: 0 };
      const fontSize = (stroke.width * 3 || 18);
      const textLen = (stroke.text || '').length || 1;
      const approxW = Math.max(32, textLen * (fontSize * 0.62));
      const approxH = Math.max(22, fontSize * 1.3);
      return { x: start.x, y: start.y, width: approxW, height: approxH };
    }

    if (path.length === 0) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    path.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    });

    const pad = Math.max(8, (stroke.width || 5) / 2);
    return {
      x: minX - pad,
      y: minY - pad,
      width: Math.max(16, (maxX - minX) + pad * 2),
      height: Math.max(16, (maxY - minY) + pad * 2),
    };
  }, []);

  // Setup canvas high DPI
  const setupCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Ensure inline styles remain 100% so canvas doesn't lock to a fixed pixel size
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const container = canvas.parentElement;
    const width = container ? container.clientWidth : (window.innerWidth || 800);
    const height = container ? container.clientHeight : (window.innerHeight || 600);
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (offscreenCanvasRef.current) {
      offscreenCanvasRef.current.width = Math.round(width * dpr);
      offscreenCanvasRef.current.height = Math.round(height * dpr);
    }

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    ctxRef.current = ctx;
    return ctx;
  }, []);

  // Draw background pattern in screen space
  const drawBackgroundPattern = (ctx, width, height, currentZoom, currentPan, theme) => {
    const dpr = window.devicePixelRatio || 1;
    const W = width * dpr;
    const H = height * dpr;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (theme === 'dark-mode') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
    }

    if (theme === 'blank') {
      ctx.restore();
      return;
    }

    const gridSize = 24 * currentZoom * dpr;
    const startX = (currentPan.x * dpr) % gridSize;
    const startY = (currentPan.y * dpr) % gridSize;

    if (theme === 'dot-grid') {
      ctx.fillStyle = theme === 'dark-mode' ? '#334155' : '#cbd5e1';
      for (let x = startX; x < W; x += gridSize) {
        for (let y = startY; y < H; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5 * dpr, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    } else if (theme === 'grid-lines' || theme === 'dark-mode') {
      ctx.strokeStyle = theme === 'dark-mode' ? '#1e293b' : '#f1f5f9';
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      for (let x = startX; x < W; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
      }
      for (let y = startY; y < H; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  // Draw arrow head helper
  const drawArrowHead = (ctx, fromX, fromY, toX, toY, headLength = 15) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  // Text wrapper helper with explicit newline \n support
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const paragraphs = (text || '').split('\n');
    let curY = y;

    paragraphs.forEach(paragraph => {
      const words = paragraph.split(' ');
      let line = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
      curY += lineHeight;
    });
  };

  // Helper to draw a single stroke in world space onto any target context
  const drawSingleStrokeToCtx = useCallback((targetCtx, stroke) => {
    if (!targetCtx || !stroke) return;

    const dpr = window.devicePixelRatio || 1;
    targetCtx.save();
    targetCtx.setTransform(zoom * dpr, 0, 0, zoom * dpr, panOffset.x * dpr, panOffset.y * dpr);
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';

    // Apply Dash Pattern (Solid / Dashed / Dotted)
    if (stroke.lineStyle === 'dashed') {
      targetCtx.setLineDash([8, 8]);
    } else if (stroke.lineStyle === 'dotted') {
      targetCtx.setLineDash([3, 6]);
    } else {
      targetCtx.setLineDash([]);
    }

    const strokeColor = stroke.color || '#000000';
    const strokeWidth = stroke.width || 5;

    if (stroke.tool === 'eraser') {
      targetCtx.globalCompositeOperation = 'destination-out';
      targetCtx.lineWidth = strokeWidth * 2.5;
    } else {
      targetCtx.globalCompositeOperation = 'source-over';
      targetCtx.strokeStyle = strokeColor;
      targetCtx.fillStyle = strokeColor;
      targetCtx.lineWidth = strokeWidth;
    }

    const path = stroke.path || [];

    if (stroke.tool === 'image') {
      if (path.length > 0 && stroke.src) {
        const x = path[0].x;
        const y = path[0].y;
        const w = stroke.imgWidth || 240;
        const h = stroke.imgHeight || 180;

        let img = imgCacheRef.current[stroke.src];
        if (!img) {
          img = new Image();
          img.src = stroke.src;
          img.onload = () => {
            if (redrawAllRef.current) {
              redrawAllRef.current(strokesRef.current || []);
            }
          };
          imgCacheRef.current[stroke.src] = img;
        }

        if (img.complete && img.naturalWidth !== 0) {
          targetCtx.save();
          targetCtx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          targetCtx.shadowBlur = 10;
          targetCtx.shadowOffsetY = 4;
          targetCtx.drawImage(img, x, y, w, h);
          targetCtx.restore();
        } else {
          targetCtx.strokeStyle = '#cbd5e1';
          targetCtx.strokeRect(x, y, w, h);
        }
      }
    } else if (stroke.tool === 'stamp') {
      if (path.length > 0) {
        const x = path[0].x;
        const y = path[0].y;
        targetCtx.font = '36px sans-serif';
        targetCtx.textAlign = 'center';
        targetCtx.textBaseline = 'middle';
        targetCtx.fillText(stroke.stamp || '🚀', x, y);
      }
    } else if (stroke.tool === 'sticky') {
      if (path.length > 0) {
        const x = path[0].x;
        const y = path[0].y;
        const w = stroke.cardWidth || 180;
        const lines = (stroke.text || '').split('\n');
        const computedH = Math.max(140, 40 + lines.length * 20);
        const h = stroke.cardHeight || computedH;

        // Shadow & Card Fill
        targetCtx.save();
        targetCtx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        targetCtx.shadowBlur = 12;
        targetCtx.shadowOffsetY = 4;
        targetCtx.fillStyle = strokeColor || '#fef08a';
        targetCtx.beginPath();
        targetCtx.roundRect(x, y, w, h, 12);
        targetCtx.fill();
        targetCtx.restore();

        // Top tape accent
        targetCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        targetCtx.fillRect(x + w / 2 - 20, y - 4, 40, 10);

        // Body Text
        targetCtx.fillStyle = '#1e293b';
        targetCtx.font = '14px Inter, sans-serif';
        wrapText(targetCtx, stroke.text || 'Sticky Note', x + 12, y + 26, w - 24, 18);
      }
    } else if (stroke.tool === 'code') {
      if (path.length > 0) {
        const x = path[0].x;
        const y = path[0].y;
        const w = stroke.cardWidth || 260;
        const lines = (stroke.text || '').split('\n');
        const computedH = Math.max(160, 44 + lines.length * 18);
        const h = stroke.cardHeight || computedH;

        // Card Container
        targetCtx.save();
        targetCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        targetCtx.shadowBlur = 14;
        targetCtx.fillStyle = '#0f172a';
        targetCtx.beginPath();
        targetCtx.roundRect(x, y, w, h, 10);
        targetCtx.fill();
        targetCtx.restore();

        // Header Bar
        targetCtx.fillStyle = '#1e293b';
        targetCtx.beginPath();
        targetCtx.roundRect(x, y, w, 28, [10, 10, 0, 0]);
        targetCtx.fill();

        // Dots
        targetCtx.fillStyle = '#ef4444';
        targetCtx.beginPath();
        targetCtx.arc(x + 12, y + 14, 4, 0, 2 * Math.PI);
        targetCtx.fill();

        targetCtx.fillStyle = '#f59e0b';
        targetCtx.beginPath();
        targetCtx.arc(x + 24, y + 14, 4, 0, 2 * Math.PI);
        targetCtx.fill();

        targetCtx.fillStyle = '#10b981';
        targetCtx.beginPath();
        targetCtx.arc(x + 36, y + 14, 4, 0, 2 * Math.PI);
        targetCtx.fill();

        // Language Label
        targetCtx.fillStyle = '#94a3b8';
        targetCtx.font = '10px monospace';
        targetCtx.fillText(stroke.lang || 'JAVASCRIPT', x + w - 75, y + 18);

        // Code Lines
        targetCtx.fillStyle = '#38bdf8';
        targetCtx.font = '12px monospace';
        lines.forEach((lineStr, lIdx) => {
          targetCtx.fillText(lineStr, x + 14, y + 46 + lIdx * 18);
        });
      }
    } else if (stroke.tool === 'diamond' || stroke.tool === 'decision') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const cx = start.x + (end.x - start.x) / 2;
        const cy = start.y + (end.y - start.y) / 2;

        targetCtx.beginPath();
        targetCtx.moveTo(cx, start.y);
        targetCtx.lineTo(end.x, cy);
        targetCtx.lineTo(cx, end.y);
        targetCtx.lineTo(start.x, cy);
        targetCtx.closePath();
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, cx, cy);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'process') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const w = end.x - start.x;
        const h = end.y - start.y;

        targetCtx.beginPath();
        targetCtx.roundRect(start.x, start.y, w, h, 8);
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, start.x + w / 2, start.y + h / 2);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'database') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);
        const rx = w / 2;
        const ry = Math.min(14, h / 4);
        const cx = start.x + rx;

        targetCtx.beginPath();
        targetCtx.ellipse(cx, start.y + ry, rx, ry, 0, 0, 2 * Math.PI);
        targetCtx.stroke();

        targetCtx.beginPath();
        targetCtx.moveTo(start.x, start.y + ry);
        targetCtx.lineTo(start.x, start.y + h - ry);
        targetCtx.moveTo(start.x + w, start.y + ry);
        targetCtx.lineTo(start.x + w, start.y + h - ry);
        targetCtx.stroke();

        targetCtx.beginPath();
        targetCtx.ellipse(cx, start.y + h - ry, rx, ry, 0, 0, Math.PI);
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, cx, start.y + h / 2);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'pill') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const w = end.x - start.x;
        const h = end.y - start.y;

        targetCtx.beginPath();
        targetCtx.roundRect(start.x, start.y, w, h, Math.min(Math.abs(w), Math.abs(h)) / 2);
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, start.x + w / 2, start.y + h / 2);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'star') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const cx = start.x + (end.x - start.x) / 2;
        const cy = start.y + (end.y - start.y) / 2;
        const outerR = Math.min(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) / 2;
        const innerR = outerR / 2.2;

        targetCtx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (i === 0) targetCtx.moveTo(x, y);
          else targetCtx.lineTo(x, y);
        }
        targetCtx.closePath();
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, cx, cy);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'triangle') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const cx = start.x + (end.x - start.x) / 2;

        targetCtx.beginPath();
        targetCtx.moveTo(cx, start.y);
        targetCtx.lineTo(end.x, end.y);
        targetCtx.lineTo(start.x, end.y);
        targetCtx.closePath();
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, cx, start.y + (end.y - start.y) * 0.65);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'cloud') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);

        targetCtx.beginPath();
        targetCtx.moveTo(x + w * 0.2, y + h * 0.7);
        targetCtx.bezierCurveTo(x, y + h * 0.7, x, y + h * 0.3, x + w * 0.2, y + h * 0.3);
        targetCtx.bezierCurveTo(x + w * 0.1, y, x + w * 0.5, y, x + w * 0.5, y + h * 0.2);
        targetCtx.bezierCurveTo(x + w * 0.7, y, x + w, y + h * 0.2, x + w * 0.8, y + h * 0.5);
        targetCtx.bezierCurveTo(x + w, y + h * 0.6, x + w * 0.9, y + h, x + w * 0.7, y + h);
        targetCtx.bezierCurveTo(x + w * 0.4, y + h * 1.1, x + w * 0.2, y + h, x + w * 0.2, y + h * 0.7);
        targetCtx.closePath();
        targetCtx.stroke();

        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '12px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, x + w / 2, y + h / 2);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'text') {
      if (path.length > 0 && stroke.text) {
        targetCtx.save();
        targetCtx.textBaseline = 'top';
        targetCtx.font = `${strokeWidth * 3 || 18}px Inter, sans-serif`;
        targetCtx.fillText(stroke.text, path[0].x, path[0].y);
        targetCtx.restore();
      }
    } else if (stroke.tool === 'rectangle') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        targetCtx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '13px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, (start.x + end.x) / 2, (start.y + end.y) / 2);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'circle') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        const rx = (end.x - start.x) / 2;
        const ry = (end.y - start.y) / 2;
        const cx = start.x + rx;
        const cy = start.y + ry;
        targetCtx.beginPath();
        targetCtx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
        targetCtx.stroke();
        if (stroke.text) {
          targetCtx.save();
          targetCtx.fillStyle = strokeColor;
          targetCtx.font = '13px Inter, sans-serif';
          targetCtx.textAlign = 'center';
          targetCtx.textBaseline = 'middle';
          targetCtx.fillText(stroke.text, cx, cy);
          targetCtx.restore();
        }
      }
    } else if (stroke.tool === 'line') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        targetCtx.beginPath();
        targetCtx.moveTo(start.x, start.y);
        targetCtx.lineTo(end.x, end.y);
        targetCtx.stroke();
      }
    } else if (stroke.tool === 'arrow') {
      if (path.length >= 2) {
        const start = path[0];
        const end = path[path.length - 1];
        targetCtx.beginPath();
        targetCtx.moveTo(start.x, start.y);
        targetCtx.lineTo(end.x, end.y);
        targetCtx.stroke();
        drawArrowHead(targetCtx, start.x, start.y, end.x, end.y, Math.max(12, strokeWidth * 2.5));
      }
    } else {
      // Freehand pen or eraser
      if (path.length > 0) {
        targetCtx.beginPath();
        const [first, ...rest] = path;
        targetCtx.moveTo(first.x, first.y);
        rest.forEach(pt => targetCtx.lineTo(pt.x, pt.y));
        targetCtx.stroke();
      }
    }

    targetCtx.restore();
  }, [zoom, panOffset]);

  // Redraw all strokes with Zoom, Pan, Offscreen Layering, Selection Bounding Box, and Background Theme applied
  const redrawAll = useCallback((strokeList, extraStroke = null) => {
    const mainCanvas = canvasRef.current;
    const mainCtx = ctxRef.current;
    if (!mainCanvas || !mainCtx) return;

    redrawAllRef.current = redrawAll;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = mainCanvas.width / dpr;
    const cssHeight = mainCanvas.height / dpr;

    // 1. Draw Background Pattern on Main Canvas across entire viewport
    drawBackgroundPattern(mainCtx, cssWidth, cssHeight, zoom, panOffset, bgTheme);

    // 2. Prepare Offscreen Canvas Layer
    const offscreen = offscreenCanvasRef.current || document.createElement('canvas');
    if (offscreen.width !== mainCanvas.width || offscreen.height !== mainCanvas.height) {
      offscreen.width = mainCanvas.width;
      offscreen.height = mainCanvas.height;
    }
    const offCtx = offscreen.getContext('2d');
    offCtx.setTransform(1, 0, 0, 1, 0, 0);
    offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

    // 3. Render all strokes onto Offscreen Canvas
    (strokeList || []).forEach(stroke => {
      drawSingleStrokeToCtx(offCtx, stroke);
    });

    // 4. Render active in-progress stroke if dragging
    if (extraStroke) {
      drawSingleStrokeToCtx(offCtx, extraStroke);
    }

    // 5. Overlay Offscreen Canvas onto Main Canvas
    mainCtx.setTransform(1, 0, 0, 1, 0, 0);
    mainCtx.drawImage(offscreen, 0, 0);

    // 6. Render Selection Bounding Box if a stroke is selected
    if (selectedStrokeId) {
      const selected = (strokeList || []).find(s => s.id === selectedStrokeId);
      if (selected) {
        const box = getStrokeBoundingBox(selected);
        if (box) {
          mainCtx.save();
          mainCtx.setTransform(zoom * dpr, 0, 0, zoom * dpr, panOffset.x * dpr, panOffset.y * dpr);
          mainCtx.strokeStyle = '#3b82f6';
          mainCtx.lineWidth = 1.5;
          mainCtx.setLineDash([5, 5]);
          mainCtx.strokeRect(box.x, box.y, box.width, box.height);

          // Draw corner handles
          mainCtx.fillStyle = '#ffffff';
          mainCtx.strokeStyle = '#2563eb';
          mainCtx.lineWidth = 1.5;
          mainCtx.setLineDash([]);

          const handles = [
            { id: 'tl', x: box.x, y: box.y },
            { id: 'tr', x: box.x + box.width, y: box.y },
            { id: 'bl', x: box.x, y: box.y + box.height },
            { id: 'br', x: box.x + box.width, y: box.y + box.height },
          ];

          handles.forEach(h => {
            mainCtx.beginPath();
            mainCtx.arc(h.x, h.y, 5, 0, 2 * Math.PI);
            mainCtx.fill();
            mainCtx.stroke();
          });

          mainCtx.restore();
        }
      }
    }

    // 7. Render Marquee Drag Selection Box if active
    if (selectionBox) {
      mainCtx.save();
      mainCtx.setTransform(zoom * dpr, 0, 0, zoom * dpr, panOffset.x * dpr, panOffset.y * dpr);
      mainCtx.strokeStyle = '#3b82f6';
      mainCtx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      mainCtx.lineWidth = 1;
      mainCtx.setLineDash([4, 4]);

      const x = Math.min(selectionBox.startX, selectionBox.currentX);
      const y = Math.min(selectionBox.startY, selectionBox.currentY);
      const w = Math.abs(selectionBox.currentX - selectionBox.startX);
      const h = Math.abs(selectionBox.currentY - selectionBox.startY);

      mainCtx.fillRect(x, y, w, h);
      mainCtx.strokeRect(x, y, w, h);
      mainCtx.restore();
    }

    // 8. Draw active laser points in world space on Main Canvas
    const now = Date.now();
    const LASER_LIFETIME = 800; // ms
    laserTrailRef.current = laserTrailRef.current.filter(pt => now - pt.timestamp < LASER_LIFETIME);

    if (laserTrailRef.current.length > 1) {
      mainCtx.save();
      mainCtx.setTransform(zoom * dpr, 0, 0, zoom * dpr, panOffset.x * dpr, panOffset.y * dpr);
      for (let i = 1; i < laserTrailRef.current.length; i++) {
        const prev = laserTrailRef.current[i - 1];
        const curr = laserTrailRef.current[i];
        const age = now - curr.timestamp;
        const alpha = Math.max(0, 1 - age / LASER_LIFETIME);

        mainCtx.strokeStyle = curr.color || '#ef4444';
        mainCtx.lineWidth = 6 * alpha;
        mainCtx.globalAlpha = alpha;
        mainCtx.shadowColor = curr.color || '#ef4444';
        mainCtx.shadowBlur = 10;

        mainCtx.beginPath();
        mainCtx.moveTo(prev.x, prev.y);
        mainCtx.lineTo(curr.x, curr.y);
        mainCtx.stroke();
      }
      mainCtx.restore();
    }
  }, [drawSingleStrokeToCtx, getStrokeBoundingBox, selectedStrokeId, selectionBox, zoom, panOffset, bgTheme]);
  redrawAllRef.current = redrawAll;

  // Keyboard shortcut listener for Delete/Backspace key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedStrokeId) {
        if (onDeleteStroke) onDeleteStroke(selectedStrokeId);
        setSelectedStrokeId(null);
      }
      if (e.code === 'Space') {
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedStrokeId, onDeleteStroke]);

  // Handle Wheel Zooming & Trackpad Pinch
  const handleWheel = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Trackpad pinch gesture sets e.ctrlKey === true
    if (e.ctrlKey) {
      const zoomFactor = Math.pow(1.01, -e.deltaY);
      const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5.0);
      const newPanX = mouseX - (mouseX - panOffset.x) * (newZoom / zoom);
      const newPanY = mouseY - (mouseY - panOffset.y) * (newZoom / zoom);
      setZoom(newZoom);
      setPanOffset({ x: newPanX, y: newPanY });
      return;
    }

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.1), 5.0);

    const newPanX = mouseX - (mouseX - panOffset.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - panOffset.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Handle Drag & Drop of Image Files directly onto Canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const dropPt = getCanvasPoint(e);
        reader.onload = (event) => {
          if (onImageUpload) onImageUpload(event.target.result, dropPt);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle incoming remote laser event
  useEffect(() => {
    if (!remoteLaserEvents) return;
    const { point, color: laserColor } = remoteLaserEvents;
    if (point) {
      laserTrailRef.current.push({ ...point, timestamp: Date.now(), color: laserColor || '#ef4444' });
    }
  }, [remoteLaserEvents]);

  // Continuous animation loop for laser trail decay
  useEffect(() => {
    const animate = () => {
      if (laserTrailRef.current.length > 0) {
        redrawAll(strokes);
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [redrawAll, strokes]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
    redraw: () => redrawAll(strokesRef.current || []),
    drawStroke: (stroke) => {
      if (!stroke) return;
      const exists = (strokesRef.current || []).some(s => s.id === stroke.id);
      if (!exists) {
        strokesRef.current = [...(strokesRef.current || []), stroke];
      }
      redrawAll(strokesRef.current);
    },
    resetView: () => {
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
    },
    setPan: (newPan) => setPanOffset(newPan),
  }));

  // Setup & resize listener with ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas ? canvas.parentElement : null;

    const handleResize = () => {
      setupCanvasContext();
      redrawAll(strokesRef.current || strokes);
    };

    handleResize();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && container) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(container);
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [setupCanvasContext, redrawAll]);

  const onDoubleClick = (e) => {
    // When using freehand drawing tools (pen, laser, eraser), ignore double-clicks so drawing is never interrupted
    if (tool === 'pen' || tool === 'laser' || tool === 'eraser') {
      return;
    }

    const pt = getCanvasPoint(e);
    const clickedStroke = [...(strokes || [])].reverse().find(s => {
      const box = getStrokeBoundingBox(s);
      return box && pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height;
    });

    if (clickedStroke && TEXT_EDITABLE_TOOLS.has(clickedStroke.tool)) {
      const startPt = clickedStroke.path[0] || pt;
      setCardInput({
        type: clickedStroke.tool,
        x: startPt.x,
        y: startPt.y,
        value: clickedStroke.text || '',
        editingStrokeId: clickedStroke.id,
      });
      return;
    }

    // Double-clicking on canvas in select or text mode creates a new text element
    if (tool === 'text' || tool === 'select') {
      setCardInput({
        type: 'text',
        x: pt.x,
        y: pt.y,
        value: '',
      });
    }
  };

  const onPointerDown = (e) => {
    // Record active pointer
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch detection (2 or more fingers): strictly ZOOM IN / ZOOM OUT & PAN
    if (activePointersRef.current.size >= 2) {
      // Abort any in-progress drawing immediately
      isDrawingRef.current = false;
      currentPathRef.current = [];
      isPanningRef.current = false;
      isDraggingSelectedRef.current = false;
      isResizingRef.current = false;

      // Release any pointer capture so multi-touch is unhindered
      if (e?.target?.releasePointerCapture && e?.pointerId) {
        try {
          e.target.releasePointerCapture(e.pointerId);
        } catch (err) {}
      }

      const pts = Array.from(activePointersRef.current.values());
      const p1 = pts[0];
      const p2 = pts[1];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      const mid = {
        x: (p1.x + p2.x) / 2 - rect.left,
        y: (p1.y + p2.y) / 2 - rect.top,
      };

      pinchRef.current = {
        initialDist: Math.max(10, dist),
        initialZoom: zoomRef.current,
        initialMid: mid,
        initialPan: { ...panOffsetRef.current },
      };

      // Wipe out any stray dot or stroke started by the 1st finger before the 2nd touched
      if (redrawAllRef.current) {
        redrawAllRef.current(strokesRef.current || []);
      }
      return;
    }

    // Pinch cooldown: ignore new single-touch within 400ms of pinch ending
    if (Date.now() - lastPinchEndTimeRef.current < 400) {
      return;
    }

    // Pan trigger (Hand tool, middle-click, or Spacebar + Left Click)
    if (tool === 'pan' || e.button === 1 || isSpacePressed) {
      e.preventDefault();
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {}
      isPanningRef.current = true;
      startPanRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      return;
    }

    const ctx = ctxRef.current;
    if (!ctx) return;

    e.preventDefault();
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (err) {}
    const pt = getCanvasPoint(e);

    // Select Tool handling
    if (tool === 'select') {
      if (selectedStrokeId) {
        const selected = (strokes || []).find(s => s.id === selectedStrokeId);
        const box = getStrokeBoundingBox(selected);
        if (box) {
          // Check corner handle clicks for resizing
          const handleRadius = 8;
          const handles = [
            { id: 'tl', x: box.x, y: box.y },
            { id: 'tr', x: box.x + box.width, y: box.y },
            { id: 'bl', x: box.x, y: box.y + box.height },
            { id: 'br', x: box.x + box.width, y: box.y + box.height },
          ];

          const clickedHandle = handles.find(h => {
            const dx = pt.x - h.x;
            const dy = pt.y - h.y;
            return Math.sqrt(dx * dx + dy * dy) <= handleRadius;
          });

          if (clickedHandle) {
            isResizingRef.current = true;
            resizeHandleRef.current = clickedHandle.id;
            dragStartWorldRef.current = pt;
            return;
          }

          // Check if clicking inside bounding box to move
          if (pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height) {
            isDraggingSelectedRef.current = true;
            dragStartWorldRef.current = pt;
            return;
          }
        }
      }

      // Check if clicking any stroke
      const clickedStroke = [...(strokes || [])].reverse().find(s => {
        const box = getStrokeBoundingBox(s);
        return box && pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height;
      });

      if (clickedStroke) {
        setSelectedStrokeId(clickedStroke.id);
        isDraggingSelectedRef.current = true;
        dragStartWorldRef.current = pt;
      } else {
        setSelectedStrokeId(null);
        setSelectionBox({ startX: pt.x, startY: pt.y, currentX: pt.x, currentY: pt.y });
      }
      return;
    }

    if (tool === 'stamp') {
      if (onFinishStroke) {
        onFinishStroke({
          id: `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          tool: 'stamp',
          stamp: selectedStamp || '🚀',
          path: [pt],
        });
      }
      if (onSelectTool) onSelectTool('select');
      return;
    }

    if (tool === 'sticky') {
      setCardInput({ type: 'sticky', x: pt.x, y: pt.y, value: 'Sticky Note' });
      return;
    }

    if (tool === 'code') {
      setCardInput({ type: 'code', x: pt.x, y: pt.y, value: '// Write code here\nfunction hello() {\n  return "world";\n}' });
      return;
    }

    if (tool === 'text') {
      const existingTextStroke = [...(strokesRef.current || strokes || [])].reverse().find(s => {
        if (!TEXT_EDITABLE_TOOLS.has(s.tool)) return false;
        const box = getStrokeBoundingBox(s);
        return box && pt.x >= box.x && pt.x <= box.x + box.width && pt.y >= box.y && pt.y <= box.y + box.height;
      });
      if (existingTextStroke) {
        const startPt = existingTextStroke.path[0] || pt;
        setCardInput({
          type: existingTextStroke.tool,
          x: startPt.x,
          y: startPt.y,
          value: existingTextStroke.text || '',
          editingStrokeId: existingTextStroke.id,
        });
        return;
      }
      setCardInput({ type: 'text', x: pt.x, y: pt.y, value: '' });
      return;
    }

    if (tool === 'laser') {
      laserTrailRef.current.push({ ...pt, timestamp: Date.now(), color });
      if (onLaserMove) onLaserMove(pt.x, pt.y, color);
      return;
    }

    isDrawingRef.current = true;
    currentPathRef.current = [pt];
  };

  const onPointerMove = (e) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Two-finger pinch zoom & pan handling
    if (activePointersRef.current.size >= 2 || pinchRef.current) {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        currentPathRef.current = [];
        if (redrawAllRef.current) {
          redrawAllRef.current(strokesRef.current || []);
        }
      }

      if (activePointersRef.current.size >= 2 && pinchRef.current) {
        const pts = Array.from(activePointersRef.current.values());
        const p1 = pts[0];
        const p2 = pts[1];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        const rect = canvasRef.current ? canvasRef.current.getBoundingClientRect() : { left: 0, top: 0 };
        const mid = {
          x: (p1.x + p2.x) / 2 - rect.left,
          y: (p1.y + p2.y) / 2 - rect.top,
        };

        const { initialDist, initialZoom, initialMid, initialPan } = pinchRef.current;
        if (initialDist > 0) {
          const scale = dist / initialDist;
          const newZoom = Math.min(Math.max(initialZoom * scale, 0.1), 5.0);
          const newPanX = mid.x - (initialMid.x - initialPan.x) * (newZoom / initialZoom);
          const newPanY = mid.y - (initialMid.y - initialPan.y) * (newZoom / initialZoom);

          setZoom(newZoom);
          setPanOffset({ x: newPanX, y: newPanY });
        }
      }
      return;
    }

    // Pinch cooldown guard: block drawing immediately following a pinch gesture
    if (Date.now() - lastPinchEndTimeRef.current < 400) {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        currentPathRef.current = [];
        if (redrawAllRef.current) {
          redrawAllRef.current(strokesRef.current || []);
        }
      }
      return;
    }

    if (isPanningRef.current) {
      setPanOffset({
        x: e.clientX - startPanRef.current.x,
        y: e.clientY - startPanRef.current.y,
      });
      return;
    }

    const pt = getCanvasPoint(e);
    if (onCursorMove) onCursorMove(pt.x, pt.y);

    // Select Tool Move Handling
    if (tool === 'select') {
      // Handle Corner Handle Resizing for image and cards
      if (isResizingRef.current && selectedStrokeId) {
        const deltaX = pt.x - dragStartWorldRef.current.x;
        const deltaY = pt.y - dragStartWorldRef.current.y;
        dragStartWorldRef.current = pt;

        const targetStroke = (strokes || []).find(s => s.id === selectedStrokeId);
        if (targetStroke) {
          if (targetStroke.tool === 'image') {
            const currentW = targetStroke.imgWidth || 240;
            const currentH = targetStroke.imgHeight || 180;
            const newW = Math.max(60, currentW + deltaX);
            const newH = Math.max(45, currentH + deltaY);
            if (onUpdateStroke) {
              onUpdateStroke({ ...targetStroke, imgWidth: newW, imgHeight: newH });
            }
          } else if (targetStroke.tool === 'sticky' || targetStroke.tool === 'code') {
            const currentW = targetStroke.cardWidth || (targetStroke.tool === 'code' ? 260 : 180);
            const currentH = targetStroke.cardHeight || 140;
            const newW = Math.max(120, currentW + deltaX);
            const newH = Math.max(100, currentH + deltaY);
            if (onUpdateStroke) {
              onUpdateStroke({ ...targetStroke, cardWidth: newW, cardHeight: newH });
            }
          }
        }
        return;
      }

      if (isDraggingSelectedRef.current && selectedStrokeId) {
        const deltaX = pt.x - dragStartWorldRef.current.x;
        const deltaY = pt.y - dragStartWorldRef.current.y;
        dragStartWorldRef.current = pt;

        const targetStroke = (strokes || []).find(s => s.id === selectedStrokeId);
        if (targetStroke && targetStroke.path) {
          const updatedPath = targetStroke.path.map(p => ({ x: p.x + deltaX, y: p.y + deltaY }));
          const updatedStroke = { ...targetStroke, path: updatedPath };
          if (onUpdateStroke) onUpdateStroke(updatedStroke);
        }
        return;
      }

      if (selectionBox) {
        setSelectionBox(prev => prev ? { ...prev, currentX: pt.x, currentY: pt.y } : null);
        return;
      }
    }

    if (tool === 'laser' && e.buttons === 1) {
      laserTrailRef.current.push({ ...pt, timestamp: Date.now(), color });
      if (onLaserMove) onLaserMove(pt.x, pt.y, color);
      return;
    }

    if (!isDrawingRef.current || !ctxRef.current) return;

    currentPathRef.current.push(pt);

    // Redraw offscreen strokes layer with live in-progress stroke and overlay onto grid pattern
    redrawAll(strokes, {
      tool,
      color,
      width,
      lineStyle,
      path: currentPathRef.current,
    });
  };

  const onPointerUp = (e) => {
    if (e?.pointerId !== undefined) {
      activePointersRef.current.delete(e.pointerId);
    }

    if (e?.target?.releasePointerCapture && e?.pointerId) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    // If pinch was active, or fingers are still on the screen, or within cooldown: DO NOT COMMIT A STROKE!
    if (pinchRef.current || activePointersRef.current.size > 0 || (Date.now() - lastPinchEndTimeRef.current < 400)) {
      if (activePointersRef.current.size === 0) {
        pinchRef.current = null;
        lastPinchEndTimeRef.current = Date.now();
      }
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        currentPathRef.current = [];
        if (redrawAllRef.current) {
          redrawAllRef.current(strokesRef.current || []);
        }
      }
      return;
    }

    if (isPanningRef.current) {
      isPanningRef.current = false;
      return;
    }

    if (tool === 'select') {
      isDraggingSelectedRef.current = false;
      isResizingRef.current = false;
      resizeHandleRef.current = null;
      if (selectionBox) {
        // Select any stroke enclosed in selection box
        const x1 = Math.min(selectionBox.startX, selectionBox.currentX);
        const y1 = Math.min(selectionBox.startY, selectionBox.currentY);
        const x2 = Math.max(selectionBox.startX, selectionBox.currentX);
        const y2 = Math.max(selectionBox.startY, selectionBox.currentY);

        const found = (strokes || []).find(s => {
          const box = getStrokeBoundingBox(s);
          return box && box.x >= x1 && box.y >= y1 && (box.x + box.width) <= x2 && (box.y + box.height) <= y2;
        });

        if (found) {
          setSelectedStrokeId(found.id);
        }
        setSelectionBox(null);
      }
      return;
    }

    if (tool === 'laser' || !isDrawingRef.current) return;
    isDrawingRef.current = false;

    const path = currentPathRef.current;
    if (path && path.length > 0 && onFinishStroke) {
      onFinishStroke({
        tool,
        color,
        width,
        lineStyle,
        path,
      });
    }
    currentPathRef.current = [];
  };

  const handleCommitCard = () => {
    if (!cardInput || !cardInput.value.trim()) {
      setCardInput(null);
      return;
    }

    const lines = cardInput.value.trim().split('\n');
    const allStrokes = strokesRef.current || strokes || [];

    if (cardInput.editingStrokeId) {
      const existingStroke = allStrokes.find(s => s.id === cardInput.editingStrokeId);
      if (existingStroke) {
        const computedH = cardInput.type === 'code' ? Math.max(160, 44 + lines.length * 18) : Math.max(140, 40 + lines.length * 20);
        const updatedStroke = {
          ...existingStroke,
          text: cardInput.value.trim(),
          color: cardInput.type === 'sticky' ? (color === '#000000' ? existingStroke.color : color) : existingStroke.color,
          cardHeight: computedH,
        };
        const nextStrokes = allStrokes.map(s => (s.id === updatedStroke.id ? updatedStroke : s));
        strokesRef.current = nextStrokes;
        if (redrawAllRef.current) {
          redrawAllRef.current(nextStrokes);
        }
        if (onUpdateStroke) {
          onUpdateStroke(updatedStroke);
        }
      }
    } else {
      const computedH = cardInput.type === 'code' ? Math.max(160, 44 + lines.length * 18) : Math.max(140, 40 + lines.length * 20);
      const newStroke = {
        id: `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tool: cardInput.type,
        color: cardInput.type === 'sticky' ? (color === '#000000' ? '#fef08a' : color) : color,
        width,
        text: cardInput.value.trim(),
        path: [{ x: cardInput.x, y: cardInput.y }],
        cardWidth: cardInput.type === 'code' ? 260 : 180,
        cardHeight: computedH,
      };

      const nextStrokes = [...allStrokes, newStroke];
      strokesRef.current = nextStrokes;
      if (redrawAllRef.current) {
        redrawAllRef.current(nextStrokes);
      }
      if (onFinishStroke) {
        onFinishStroke(newStroke);
      }
    }

    setCardInput(null);
    if (onSelectTool) {
      onSelectTool('select');
    }
  };

  // Convert card input world position to screen position
  const cardScreenX = cardInput ? cardInput.x * zoom + panOffset.x : 0;
  const cardScreenY = cardInput ? cardInput.y * zoom + panOffset.y : 0;

  // High-contrast custom cursors that are 100% visible on both white and dark backgrounds
  const getCanvasCursorStyle = () => {
    if (isSpacePressed || tool === 'pan') {
      return isPanningRef.current ? BASE64_CURSORS.grabbing : BASE64_CURSORS.grab;
    }
    if (tool === 'select') return BASE64_CURSORS.select;
    if (tool === 'text') return BASE64_CURSORS.text;
    if (tool === 'eraser') return BASE64_CURSORS.eraser;
    if (tool === 'laser') return BASE64_CURSORS.laser;
    return BASE64_CURSORS.crosshair;
  };

  const canvasCursor = getCanvasCursorStyle();

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none touch-none"
      style={{ cursor: canvasCursor }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full touch-none select-none"
        style={{
          width: '100%',
          height: '100%',
          cursor: canvasCursor,
        }}
        onWheel={handleWheel}
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      />

      {/* Viewport Control Widget (Bottom-Left) */}
      <div className="absolute bottom-4 left-4 z-40 flex items-center space-x-1.5 bg-white/90 backdrop-blur-xl border border-slate-200/80 px-2.5 py-1.5 rounded-2xl shadow-xl shadow-slate-200/50">
        <button
          onClick={() => onSelectTool && onSelectTool(tool === 'pan' ? 'pen' : 'pan')}
          title={tool === 'pan' ? 'Switch to Pen (P)' : 'Pan / Move Canvas (H)'}
          className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-sm transition-all ${
            tool === 'pan' ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <button
          onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
          title="Zoom Out"
          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center text-sm transition-colors"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPanOffset({ x: 0, y: 0 });
          }}
          title="Reset View (100%)"
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-lg transition-colors"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom(z => Math.min(5.0, z + 0.1))}
          title="Zoom In"
          className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center justify-center text-sm transition-colors"
        >
          +
        </button>
      </div>

      {/* Inline Text / Sticky / Code Card Overlay Input */}
      {cardInput && (
        <div
          className="absolute z-40 transform -translate-y-1/2 flex flex-col space-y-1.5 max-w-[90vw]"
          style={{ left: `${cardScreenX}px`, top: `${cardScreenY}px` }}
          onPointerDown={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          {cardInput.type === 'code' ? (
            <div className="flex flex-col space-y-1.5 bg-slate-900 border-2 border-sky-400 p-2.5 rounded-xl shadow-2xl max-w-[85vw]">
              <textarea
                autoFocus
                rows={5}
                cols={30}
                value={cardInput.value}
                onChange={e => setCardInput({ ...cardInput, value: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Escape') setCardInput(null);
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleCommitCard();
                  }
                }}
                placeholder="Write code here..."
                className="p-2 bg-slate-950 text-sky-300 font-mono text-xs outline-none rounded-lg resize-none w-64 max-w-[75vw] border border-slate-800"
              />
              <div className="flex justify-end space-x-1.5 pt-0.5">
                <button
                  onClick={() => setCardInput(null)}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitCard}
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-slate-950 text-[10px] font-bold rounded-md shadow transition-colors"
                >
                  {cardInput.editingStrokeId ? 'Update Code ✓' : 'Attach Code ✓'}
                </button>
              </div>
            </div>
          ) : cardInput.type === 'sticky' ? (
            <div
              className="flex flex-col space-y-1.5 p-2.5 border-2 border-amber-400 rounded-xl shadow-2xl max-w-[85vw]"
              style={{ backgroundColor: color === '#000000' ? '#fef08a' : color }}
            >
              <textarea
                autoFocus
                rows={4}
                cols={22}
                value={cardInput.value}
                onChange={e => setCardInput({ ...cardInput, value: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Escape') setCardInput(null);
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommitCard();
                  }
                }}
                placeholder="Sticky note text..."
                className="p-2 bg-white/60 text-slate-800 font-sans text-xs outline-none rounded-lg resize-none w-44 max-w-[75vw] border border-black/10"
              />
              <div className="flex justify-end space-x-1.5 pt-0.5">
                <button
                  onClick={() => setCardInput(null)}
                  className="px-2 py-1 bg-black/10 hover:bg-black/20 text-slate-700 text-[10px] font-semibold rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitCard}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-md shadow transition-colors"
                >
                  {cardInput.editingStrokeId ? 'Update Note ✓' : 'Attach Note ✓'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-white border-2 border-blue-600 ring-4 ring-blue-500/20 p-2 rounded-2xl shadow-2xl max-w-[85vw]">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center flex-shrink-0 select-none">
                T
              </div>
              <input
                ref={textInputRef}
                autoFocus
                type="text"
                value={cardInput.value}
                onChange={e => setCardInput({ ...cardInput, value: e.target.value })}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCommitCard();
                  if (e.key === 'Escape') setCardInput(null);
                }}
                onPointerDown={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                onClick={e => e.stopPropagation()}
                placeholder="Type text here..."
                className="px-2.5 py-1.5 bg-transparent outline-none font-sans text-slate-900 text-sm flex-1 min-w-[160px] font-medium"
              />
              <button
                type="button"
                onPointerDown={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCommitCard();
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex-shrink-0 cursor-pointer hover:shadow-lg"
              >
                {cardInput.editingStrokeId ? 'Update ✓' : 'Add ✓'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Remote Cursors Overlay */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {Object.entries(cursors).map(([id, { x, y, name, lastSeen }]) => {
          if (Date.now() - (lastSeen || 0) > 5000) return null;
          const screenX = x * zoom + panOffset.x;
          const screenY = y * zoom + panOffset.y;
          return (
            <div
              key={id}
              className="absolute transition-all duration-75 ease-out pointer-events-none select-none"
              style={{ left: `${screenX}px`, top: `${screenY}px` }}
            >
              {/* Pointer Arrow with high-contrast outline */}
              <svg className="w-5 h-5 -translate-x-1 -translate-y-1 drop-shadow-md text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 2l16 7.5-6.5 2.5-2.5 6.5L4 2z" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              {/* Name Tag */}
              <div className="ml-3 -mt-2 flex items-center space-x-1 bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-lg border border-slate-700/80 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span>{name || 'Collaborator'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default WhiteboardCanvas;
