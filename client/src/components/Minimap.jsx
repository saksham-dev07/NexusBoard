import React, { useRef, useEffect } from 'react';

export default function Minimap({ strokes, zoom, panOffset, onPanChange, bgTheme }) {
  const miniCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background fill
    if (bgTheme === 'dark-mode') {
      ctx.fillStyle = '#0f172a';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, W, H);

    // Grid outline
    ctx.strokeStyle = bgTheme === 'dark-mode' ? '#334155' : '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, W, H);

    // Compute bounds or fixed minimap world space (-1500 to +2500)
    const WORLD_W = 3000;
    const WORLD_H = 2000;
    const ORIGIN_X = 1500;
    const ORIGIN_Y = 1000;

    const scaleX = W / WORLD_W;
    const scaleY = H / WORLD_H;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw miniature strokes
    (strokes || []).forEach(stroke => {
      if (stroke.tool === 'eraser') return;

      const path = stroke.path || [];
      if (path.length === 0) return;

      if (stroke.tool === 'sticky' || stroke.tool === 'code') {
        const startX = (path[0].x + ORIGIN_X) * scaleX;
        const startY = (path[0].y + ORIGIN_Y) * scaleY;
        const cardW = (stroke.cardWidth || (stroke.tool === 'code' ? 260 : 180)) * scaleX;
        const cardH = (stroke.cardHeight || (stroke.tool === 'code' ? 160 : 140)) * scaleY;
        ctx.fillStyle = stroke.tool === 'code' ? '#38bdf8' : (stroke.color || '#fef08a');
        ctx.fillRect(startX, startY, Math.max(4, cardW), Math.max(4, cardH));
        return;
      }

      const strokeColor = bgTheme === 'dark-mode' && stroke.color === '#000000' ? '#f8fafc' : (stroke.color || '#3b82f6');
      ctx.strokeStyle = strokeColor;
      ctx.fillStyle = strokeColor;
      ctx.lineWidth = Math.max(1, (stroke.width || 3) * scaleX);

      ctx.beginPath();
      const firstX = (path[0].x + ORIGIN_X) * scaleX;
      const firstY = (path[0].y + ORIGIN_Y) * scaleY;
      ctx.moveTo(firstX, firstY);

      for (let i = 1; i < path.length; i++) {
        const px = (path[i].x + ORIGIN_X) * scaleX;
        const py = (path[i].y + ORIGIN_Y) * scaleY;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    ctx.restore();

    // Draw active Viewport Camera Box
    const windowW = window.innerWidth || 1200;
    const windowH = window.innerHeight || 800;

    // Screen corners in world space
    const worldTopLeftX = -panOffset.x / zoom;
    const worldTopLeftY = -panOffset.y / zoom;
    const worldW = windowW / zoom;
    const worldH = windowH / zoom;

    const vpMiniX = (worldTopLeftX + ORIGIN_X) * scaleX;
    const vpMiniY = (worldTopLeftY + ORIGIN_Y) * scaleY;
    const vpMiniW = worldW * scaleX;
    const vpMiniH = worldH * scaleY;

    ctx.save();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.fillRect(vpMiniX, vpMiniY, vpMiniW, vpMiniH);
    ctx.strokeRect(vpMiniX, vpMiniY, vpMiniW, vpMiniH);
    ctx.restore();
  }, [strokes, zoom, panOffset, bgTheme]);

  const handleMinimapClick = (e) => {
    const canvas = miniCanvasRef.current;
    if (!canvas || !onPanChange) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const W = canvas.width;
    const H = canvas.height;
    const WORLD_W = 3000;
    const WORLD_H = 2000;
    const ORIGIN_X = 1500;
    const ORIGIN_Y = 1000;

    const scaleX = W / WORLD_W;
    const scaleY = H / WORLD_H;

    const targetWorldX = clickX / scaleX - ORIGIN_X;
    const targetWorldY = clickY / scaleY - ORIGIN_Y;

    const windowW = window.innerWidth || 1200;
    const windowH = window.innerHeight || 800;

    const newPanX = -(targetWorldX * zoom) + windowW / 2;
    const newPanY = -(targetWorldY * zoom) + windowH / 2;

    onPanChange({ x: newPanX, y: newPanY });
  };

  return (
    <div
      title="Click minimap to navigate viewport"
      onClick={handleMinimapClick}
      className="cursor-pointer bg-white/85 backdrop-blur-xl border border-slate-200/80 p-1 rounded-xl shadow-lg hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between px-1 pb-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
        <span>Minimap</span>
        <span className="text-[8px] text-slate-400 font-mono">Radar</span>
      </div>
      <canvas
        ref={miniCanvasRef}
        width={160}
        height={100}
        className="block rounded-lg"
      />
    </div>
  );
}
