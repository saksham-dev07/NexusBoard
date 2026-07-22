import React from 'react';

const SHORTCUTS = [
  { key: 'S', label: 'Select Tool', desc: 'Click or drag box to select objects' },
  { key: 'P', label: 'Pen Tool', desc: 'Freehand vector drawing' },
  { key: 'E', label: 'Eraser Tool', desc: 'Erase vector drawings' },
  { key: 'N', label: 'Sticky Note', desc: 'Add colorful digital sticky note' },
  { key: 'K', label: 'Code Snippet', desc: 'Add syntax-highlighted code card' },
  { key: 'D', label: 'Decision Node', desc: 'Draw flowchart decision rhombus' },
  { key: 'B', label: 'Process Box', desc: 'Draw flowchart process box' },
  { key: 'H', label: 'Database', desc: 'Draw database cylinder shape' },
  { key: 'M', label: 'Terminal Pill', desc: 'Draw start/end terminal node' },
  { key: 'U', label: 'Cloud Node', desc: 'Draw cloud service / API node' },
  { key: 'J', label: 'Star Badge', desc: 'Draw priority star badge shape' },
  { key: 'I', label: 'Triangle Node', desc: 'Draw delta / pyramid triangle' },
  { key: 'R', label: 'Rectangle', desc: 'Draw rectangles & boxes' },
  { key: 'C', label: 'Circle', desc: 'Draw circles & ellipses' },
  { key: 'L', label: 'Line', desc: 'Draw straight lines' },
  { key: 'A', label: 'Arrow', desc: 'Draw directional arrows' },
  { key: 'T', label: 'Text Tool', desc: 'Click canvas to type text' },
  { key: 'V', label: 'Laser Pointer', desc: 'Transient glowing presentation trail' },
  { key: 'F', label: 'Presentation Mode', desc: 'Toggle clean fullscreen view' },
  { key: 'Del / Backspace', label: 'Delete Selected', desc: 'Delete active selection' },
  { key: 'Space + Drag', label: 'Pan Canvas', desc: 'Drag across infinite canvas' },
  { key: 'Wheel', label: 'Zoom In/Out', desc: 'Zoom centered around cursor' },
  { key: 'Ctrl + Z', label: 'Undo', desc: 'Undo last stroke' },
];

export default function ShortcutsModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 z-50 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl w-full max-w-lg transition-all">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-sm">
              ?
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Keyboard & Mouse Shortcuts</h2>
              <p className="text-xs text-slate-500">Quick controls for pan, zoom, flowchart, and tools</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-1">
          {SHORTCUTS.map(s => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl"
            >
              <div>
                <div className="text-xs font-bold text-slate-800">{s.label}</div>
                <div className="text-[10px] text-slate-500">{s.desc}</div>
              </div>
              <kbd className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 shadow-sm flex-shrink-0 ml-2">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
