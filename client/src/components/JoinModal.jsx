import React, { useState } from 'react';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

export default function JoinModal({ onJoin }) {
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoinOrCreate = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      let targetRoomId = roomId.trim();
      if (!targetRoomId) {
        const res = await fetch(`${SERVER_URL}/rooms`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed to create room on server');
        const data = await res.json();
        targetRoomId = data.roomId;
      }
      onJoin({ userName: userName.trim(), roomId: targetRoomId });
    } catch (err) {
      setError(err.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-4 z-50">
      <div className="bg-white/95 sm:bg-white/90 backdrop-blur-xl border border-white/20 p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md transition-all duration-300">
        <div className="flex flex-col items-center mb-5 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-2.5 sm:mb-3">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight text-center">Collaborative Whiteboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 text-center">Real-time vector sketching & chat</p>
        </div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center space-x-2 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleJoinOrCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alex"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Room ID <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Leave blank for new room"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm uppercase font-mono tracking-wider"
              value={roomId}
              onChange={e => setRoomId(e.target.value.toUpperCase())}
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={!userName.trim() || loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm mt-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span>{roomId.trim() ? 'Join Room' : 'Create New Room'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
