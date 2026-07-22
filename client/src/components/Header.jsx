import React, { useState } from 'react';

export default function Header({ roomId, onlineUsers, connectionStatus, onLeave, onOpenShortcuts, onTogglePresentation }) {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(roomId);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = roomId;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const statusColor = {
    connected: 'bg-emerald-500 shadow-emerald-500/50',
    disconnected: 'bg-amber-500 shadow-amber-500/50',
    error: 'bg-rose-500 shadow-rose-500/50',
  }[connectionStatus] || 'bg-slate-400';

  return (
    <header className="absolute top-4 left-4 z-40 flex items-center space-x-3 bg-white/80 backdrop-blur-xl border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-200/50">
      <div className="flex items-center space-x-2">
        <span className={`w-2.5 h-2.5 rounded-full shadow-md ${statusColor} animate-pulse`} />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Room</span>
      </div>

      <button
        onClick={copyRoomId}
        title="Click to copy Room ID"
        className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors group"
      >
        <span className="font-mono text-sm font-bold text-slate-800 tracking-wide">{roomId}</span>
        <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>

      {copied && (
        <span className="text-xs font-medium text-emerald-600 animate-fade-in">Copied!</span>
      )}

      <div className="h-4 w-px bg-slate-200" />

      <div className="flex items-center space-x-1.5 text-slate-600 text-xs font-medium">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>{onlineUsers.length} Online</span>
      </div>

      <div className="h-4 w-px bg-slate-200" />

      {/* Presentation Mode */}
      <button
        onClick={onTogglePresentation}
        title="Toggle Fullscreen Presentation Mode (F)"
        className="flex items-center space-x-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg transition-colors"
      >
        <svg className="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span>Present</span>
      </button>

      <div className="h-4 w-px bg-slate-200" />

      {/* Keyboard Shortcuts Button */}
      <button
        onClick={onOpenShortcuts}
        title="View Keyboard Shortcuts (?)"
        className="flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
      >
        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">?</span>
        <span>Shortcuts</span>
      </button>

      <div className="h-4 w-px bg-slate-200" />

      <button
        onClick={onLeave}
        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors"
      >
        Leave
      </button>
    </header>
  );
}
