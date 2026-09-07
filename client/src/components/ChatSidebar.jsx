import React, { useState, useRef, useEffect } from 'react';

export default function ChatSidebar({ messages, onlineUsers, onSendChat }) {
  const [collapsed, setCollapsed] = useState(true);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!collapsed) {
      scrollToBottom();
    }
  }, [messages, collapsed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendChat(text.trim());
    setText('');
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute bottom-4 right-4 z-40 bg-white/90 backdrop-blur-xl border border-slate-200/80 px-3.5 py-2 rounded-2xl shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all flex items-center space-x-2 text-slate-700 text-xs font-semibold hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          )}
        </div>
        <span>Chat ({messages.length})</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-xs sm:w-80 max-h-[50vh] sm:max-h-[calc(100vh-27rem)] h-72 min-h-[14rem] bg-white/95 sm:bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Room Chat</span>
        </div>

        <button
          onClick={() => setCollapsed(true)}
          title="Minimize Chat"
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-400 italic text-[11px]">
            No messages yet. Say hi!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx}>
              {msg.type === 'system' ? (
                <div className="text-center text-[10px] text-slate-400 my-1 py-0.5 bg-slate-100/60 rounded-full font-medium">
                  {msg.text}
                </div>
              ) : (
                <div className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-slate-400 font-medium px-1 mb-0.5">
                    {msg.sender}
                  </span>
                  <div
                    className={`px-3 py-1.5 rounded-2xl max-w-[85%] break-words ${
                      msg.sender === 'Me'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-slate-200/80 bg-slate-50/50 flex space-x-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
          className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
