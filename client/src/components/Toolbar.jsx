import React, { useRef } from 'react';

const PRESET_COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Yellow
  '#8b5cf6', // Purple
  '#ec4899', // Pink
];

const STICKY_COLORS = [
  '#fef08a', // Yellow
  '#fbcfe8', // Pink
  '#bae6fd', // Cyan
  '#bbf7d0', // Green
  '#e9d5ff', // Purple
];

const EMOJI_STAMPS = ['🚀', '💡', '✅', '❌', '🔥', '⚠️', '⭐', '🎯'];

const CATEGORIZED_TOOLS = [
  {
    category: 'General & Select',
    items: [
      { id: 'select', label: 'Select', key: 'S', icon: 'M15 15l-2 5l-3-3l-3 3l-2-5M3 3l7 18l3-7l7-3L3 3z' },
      { id: 'pen', label: 'Pen', key: 'P', icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z' },
      { id: 'eraser', label: 'Eraser', key: 'E', icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
      { id: 'laser', label: 'Laser', key: 'V', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    ],
  },
  {
    category: 'Cards & Notes',
    items: [
      { id: 'sticky', label: 'Sticky', key: 'N', icon: 'M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z' },
      { id: 'code', label: 'Code Card', key: 'K', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
      { id: 'text', label: 'Text', key: 'T', icon: 'M4 6h16M12 6v14' },
      { id: 'stamp', label: 'Stamp', key: 'X', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    ],
  },
  {
    category: 'Flowchart Suite',
    items: [
      { id: 'decision', label: 'Decision', key: 'D', icon: 'M12 2l10 10-10 10L2 12z' },
      { id: 'process', label: 'Process', key: 'B', icon: 'M4 6h16v12H4z' },
      { id: 'database', label: 'Data', key: 'H', icon: 'M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3zm0 6c0 1.657 3.582 3 8 3s8-1.343 8-3M4 18c0 1.657 3.582 3 8 3s8-1.343 8-3' },
      { id: 'pill', label: 'Terminal', key: 'M', icon: 'M8 6h8a6 6 0 010 12H8A6 6 0 018 6z' },
      { id: 'cloud', label: 'Cloud', key: 'U', icon: 'M3 15a4 4 0 004 4h9a5 5 0 001.09-.12A4.5 4.5 0 0019 10a4.5 4.5 0 00-3-4.16 6.5 6.5 0 00-11.83 3.66A4 4 0 003 15z' },
    ],
  },
  {
    category: 'Shapes & Lines',
    items: [
      { id: 'rectangle', label: 'Rect', key: 'R', icon: 'M3 3h18v18H3V3z' },
      { id: 'circle', label: 'Circle', key: 'C', icon: 'M12 21a9 9 0 100-18 9 9 0 000 18z' },
      { id: 'triangle', label: 'Triangle', key: 'I', icon: 'M12 3l9 17H3L12 3z' },
      { id: 'star', label: 'Star', key: 'J', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
      { id: 'line', label: 'Line', key: 'L', icon: 'M4 20L20 4' },
      { id: 'arrow', label: 'Arrow', key: 'A', icon: 'M14 5l7 7m0 0l-7 7m7-7H3' },
    ],
  },
];

const BG_THEMES = [
  { id: 'grid-lines', label: 'Grid' },
  { id: 'dot-grid', label: 'Dots' },
  { id: 'blank', label: 'Blank' },
  { id: 'dark-mode', label: 'Dark' },
];

export default function Toolbar({
  tool,
  setTool,
  color,
  setColor,
  width,
  setWidth,
  lineStyle,
  setLineStyle,
  selectedStamp,
  setSelectedStamp,
  bgTheme,
  setBgTheme,
  onUndo,
  onClear,
  onExport,
  onImportJSON,
  onImageUpload,
  onTogglePresentation,
}) {
  const activeColors = tool === 'sticky' ? STICKY_COLORS : PRESET_COLORS;
  const imageInputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (onImageUpload) onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="absolute top-4 right-4 z-40 flex flex-col space-y-2.5 bg-white/85 backdrop-blur-xl border border-slate-200/80 p-3 rounded-2xl shadow-xl shadow-slate-200/50 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto transition-all">
      {/* Categorized Tools Sections */}
      <div className="space-y-2.5">
        {CATEGORIZED_TOOLS.map(cat => (
          <div key={cat.category} className="space-y-1">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {cat.category}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1 bg-slate-100/80 p-1 rounded-xl">
              {cat.items.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTool(t.id);
                    if (t.id === 'sticky' && !STICKY_COLORS.includes(color)) {
                      setColor('#fef08a');
                    }
                  }}
                  title={`${t.label} (Press ${t.key})`}
                  className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all ${
                    tool === t.id
                      ? 'bg-white text-blue-600 shadow-sm scale-105 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 mb-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                  </svg>
                  <span className="text-[9px] truncate max-w-full">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Emoji Stamp Picker (Active when Stamp tool is selected) */}
      {tool === 'stamp' && (
        <div className="space-y-1 bg-amber-50/80 p-2 rounded-xl border border-amber-200/80 animate-fade-in">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
            Select Emoji Stamp
          </span>
          <div className="grid grid-cols-4 gap-1">
            {EMOJI_STAMPS.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStamp(s)}
                className={`py-1 text-lg rounded-lg transition-transform ${
                  selectedStamp === s ? 'bg-white shadow-md scale-110 ring-2 ring-amber-400' : 'hover:bg-white/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Upload Button & Hidden Input */}
      <div className="flex space-x-1.5">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
        <button
          onClick={() => imageInputRef.current?.click()}
          className="w-full py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-xl border border-sky-200/80 transition-colors flex items-center justify-center space-x-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Upload Image / Diagram</span>
        </button>
      </div>

      <div className="h-px bg-slate-200/80 my-0.5" />

      {/* Line Style Selector (Solid / Dashed / Dotted) */}
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Line Style
        </span>
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-xl">
          {[
            { id: 'solid', label: 'Solid ──' },
            { id: 'dashed', label: 'Dashed ╌' },
            { id: 'dotted', label: 'Dotted ┈' },
          ].map(ls => (
            <button
              key={ls.id}
              onClick={() => setLineStyle(ls.id)}
              className={`py-1 text-[10px] font-semibold rounded-lg transition-all ${
                lineStyle === ls.id
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {ls.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Theme Selector */}
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          Canvas Theme
        </span>
        <div className="grid grid-cols-4 gap-1 bg-slate-100/80 p-1 rounded-xl">
          {BG_THEMES.map(b => (
            <button
              key={b.id}
              onClick={() => setBgTheme(b.id)}
              className={`py-1 text-[11px] font-semibold rounded-lg transition-all ${
                bgTheme === b.id
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      {tool !== 'eraser' && tool !== 'code' && (
        <div className="space-y-1.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {tool === 'sticky' ? 'Sticky Color' : 'Color Palette'}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              {activeColors.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    c === '#ffffff' ? 'border border-slate-300' : ''
                  } ${
                    color === c ? 'scale-125 ring-2 ring-blue-500 ring-offset-1' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            {tool !== 'sticky' && (
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-6 h-6 rounded-lg cursor-pointer border-0 opacity-0 absolute inset-0"
                />
                <div
                  className="w-6 h-6 rounded-lg border border-slate-200 shadow-inner flex items-center justify-center pointer-events-none"
                  style={{ backgroundColor: color }}
                >
                  <svg className="w-3 h-3 text-white mix-blend-difference" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stroke Width / Font Slider */}
      {tool !== 'sticky' && tool !== 'code' && (
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            <span>{tool === 'text' ? 'Font Size' : 'Stroke Size'}</span>
            <span className="text-slate-600 font-mono text-xs">{width}px</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <input
              type="range"
              min={tool === 'text' ? '12' : '1'}
              max={tool === 'text' ? '72' : '50'}
              value={width}
              onChange={e => setWidth(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div
              className="rounded-full bg-slate-800 flex-shrink-0 transition-all"
              style={{
                width: `${Math.min(width, 20)}px`,
                height: `${Math.min(width, 20)}px`,
                backgroundColor: tool === 'eraser' ? '#94a3b8' : color,
              }}
            />
          </div>
        </div>
      )}

      <div className="h-px bg-slate-200/80 my-0.5" />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={onUndo}
          title="Undo (Ctrl+Z)"
          className="flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          <span>Undo</span>
        </button>

        <button
          onClick={onClear}
          className="flex items-center justify-center space-x-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Clear All</span>
        </button>
      </div>

      {/* Import / Export Options */}
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={() => onExport('png')}
          className="px-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold rounded-xl transition-colors text-center"
        >
          Export PNG
        </button>
        <button
          onClick={() => onExport('json')}
          className="px-1.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold rounded-xl transition-colors text-center"
        >
          Export JSON
        </button>
        <label className="px-1.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded-xl transition-colors text-center cursor-pointer">
          Import JSON
          <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={onImportJSON}
          />
        </label>
      </div>

      <button
        onClick={onTogglePresentation}
        className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-purple-500/20 flex items-center justify-center space-x-1.5"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>Present Mode (F)</span>
      </button>
    </div>
  );
}
