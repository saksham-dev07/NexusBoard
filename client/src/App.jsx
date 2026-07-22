import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useWhiteboard } from './hooks/useWhiteboard';
import JoinModal from './components/JoinModal';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import ChatSidebar from './components/ChatSidebar';
import WhiteboardCanvas from './components/WhiteboardCanvas';
import Minimap from './components/Minimap';
import ShortcutsModal from './components/ShortcutsModal';

export default function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');

  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(5);
  const [lineStyle, setLineStyle] = useState('solid'); // 'solid' | 'dashed' | 'dotted'
  const [selectedStamp, setSelectedStamp] = useState('🚀');
  const [bgTheme, setBgTheme] = useState('grid-lines');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const [remoteLaser, setRemoteLaser] = useState(null);
  const canvasRef = useRef(null);

  // Viewport Zoom & Pan state passed from Canvas for Minimap & Spawning
  const [viewportZoom, setViewportZoom] = useState(1);
  const [viewportPan, setViewportPan] = useState({ x: 0, y: 0 });

  // Callbacks for incoming remote events
  const handleRemoteDraw = useCallback((stroke) => {
    canvasRef.current?.drawStroke(stroke);
  }, []);

  const handleRemoteUpdateStroke = useCallback((updatedStroke) => {
    canvasRef.current?.redraw();
  }, []);

  const handleRemoteDeleteStroke = useCallback((strokeId) => {
    canvasRef.current?.redraw();
  }, []);

  const handleRemoteClear = useCallback(() => {
    canvasRef.current?.redraw();
  }, []);

  const handleRemoteUndo = useCallback(() => {
    canvasRef.current?.redraw();
  }, []);

  const handleRemoteLaser = useCallback((data) => {
    setRemoteLaser(data);
  }, []);

  const {
    connectionStatus,
    messages,
    strokes,
    cursors,
    onlineUsers,
    error,
    setError,
    emitDraw,
    emitUpdateStroke,
    emitDeleteStroke,
    emitClear,
    emitUndo,
    emitChat,
    emitCursor,
    emitLaser,
  } = useWhiteboard({
    roomId,
    userName,
    joined,
    onRemoteDraw: handleRemoteDraw,
    onRemoteUpdateStroke: handleRemoteUpdateStroke,
    onRemoteDeleteStroke: handleRemoteDeleteStroke,
    onRemoteClear: handleRemoteClear,
    onRemoteUndo: handleRemoteUndo,
    onRemoteLaser: handleRemoteLaser,
  });

  const handleJoin = ({ userName: name, roomId: room }) => {
    setUserName(name);
    setRoomId(room);
    setJoined(true);
  };

  const handleLeave = () => {
    setJoined(false);
    setRoomId('');
    setUserName('');
  };

  const handleFinishStroke = (strokeData) => {
    if (!strokeData) return;
    const fullStroke = {
      id: strokeData.id || `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...strokeData,
      roomId,
      timestamp: Date.now(),
    };
    emitDraw(fullStroke);
  };

  const handleImageUpload = (base64Data, customWorldPt = null) => {
    if (!base64Data) return;

    const img = new Image();
    img.src = base64Data;
    img.onload = () => {
      const maxW = 320;
      let targetW = Math.min(maxW, img.naturalWidth || maxW);
      let targetH = img.naturalHeight && img.naturalWidth ? targetW * (img.naturalHeight / img.naturalWidth) : 200;

      // Spawning location: Custom drop point or active Viewport Screen Center
      let spawnPt = customWorldPt;
      if (!spawnPt) {
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        spawnPt = {
          x: (viewW / 2 - viewportPan.x) / viewportZoom - targetW / 2,
          y: (viewH / 2 - viewportPan.y) / viewportZoom - targetH / 2,
        };
      }

      const newStroke = {
        id: `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        tool: 'image',
        src: base64Data,
        path: [spawnPt],
        imgWidth: Math.round(targetW),
        imgHeight: Math.round(targetH),
        roomId,
        timestamp: Date.now(),
      };
      emitDraw(newStroke);
      setTool('select');
    };
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const importedStrokes = data.strokes || (Array.isArray(data) ? data : []);

        importedStrokes.forEach(st => {
          if (st && st.tool) {
            emitDraw({
              ...st,
              id: st.id || `stroke_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
              roomId,
            });
          }
        });
      } catch (err) {
        console.error('Import JSON failed:', err);
        setError('Failed to import JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = (format) => {
    try {
      const link = document.createElement('a');
      link.download = `${roomId || 'whiteboard'}.${format}`;

      if (format === 'json') {
        const data = {
          strokes,
          metadata: {
            roomId,
            exportDate: new Date().toISOString(),
            strokeCount: strokes.length,
          },
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        link.href = URL.createObjectURL(blob);
      } else {
        const canvas = canvasRef.current?.getCanvas();
        if (!canvas) return;
        link.href = canvas.toDataURL('image/png');
      }

      link.click();
    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed');
    }
  };

  // Keyboard Shortcuts (Ctrl+Z, S, P, E, N, K, D, B, H, M, U, J, I, R, C, L, A, T, V, F, ?)
  useEffect(() => {
    if (!joined) return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const k = e.key.toLowerCase();
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      } else if (e.key === 'Escape') {
        setShowShortcuts(false);
        setIsPresentationMode(false);
      } else if ((e.ctrlKey || e.metaKey) && k === 'z') {
        e.preventDefault();
        emitUndo();
      } else if (k === 's') {
        setTool('select');
      } else if (k === 'p') {
        setTool('pen');
      } else if (k === 'e') {
        setTool('eraser');
      } else if (k === 'n') {
        setTool('sticky');
        setColor('#fef08a');
      } else if (k === 'k') {
        setTool('code');
      } else if (k === 'x') {
        setTool('stamp');
      } else if (k === 'd') {
        setTool('decision');
      } else if (k === 'b') {
        setTool('process');
      } else if (k === 'h') {
        setTool('database');
      } else if (k === 'm') {
        setTool('pill');
      } else if (k === 'u') {
        setTool('cloud');
      } else if (k === 'j') {
        setTool('star');
      } else if (k === 'i') {
        setTool('triangle');
      } else if (k === 'r') {
        setTool('rectangle');
      } else if (k === 'c') {
        setTool('circle');
      } else if (k === 'l') {
        setTool('line');
      } else if (k === 'a') {
        setTool('arrow');
      } else if (k === 't') {
        setTool('text');
      } else if (k === 'v') {
        setTool('laser');
      } else if (k === 'f') {
        setIsPresentationMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [joined, emitUndo]);

  if (!joined) {
    return <JoinModal onJoin={handleJoin} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-slate-100">
      {/* Error Banner */}
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-rose-500 text-white text-xs py-2 px-4 text-center z-50 flex items-center justify-center space-x-2 shadow-lg animate-fade-in">
          <span>{error}</span>
          <button className="underline font-semibold ml-2" onClick={() => setError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {/* Presentation Mode Top Banner */}
      {isPresentationMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl border border-slate-700 flex items-center space-x-3 text-xs animate-fade-in">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          <span className="font-semibold tracking-wide">Presentation Mode</span>
          <span className="text-slate-400 text-[11px]">(Press Esc to exit)</span>
          <button
            onClick={() => setIsPresentationMode(false)}
            className="ml-2 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold"
          >
            Exit
          </button>
        </div>
      )}

      {/* Top Header */}
      {!isPresentationMode && (
        <Header
          roomId={roomId}
          onlineUsers={onlineUsers}
          connectionStatus={connectionStatus}
          onLeave={handleLeave}
          onOpenShortcuts={() => setShowShortcuts(true)}
          onTogglePresentation={() => setIsPresentationMode(prev => !prev)}
        />
      )}

      {/* Main Canvas */}
      <WhiteboardCanvas
        ref={canvasRef}
        tool={tool}
        color={color}
        width={width}
        lineStyle={lineStyle}
        selectedStamp={selectedStamp}
        strokes={strokes}
        cursors={cursors}
        bgTheme={bgTheme}
        onFinishStroke={handleFinishStroke}
        onUpdateStroke={emitUpdateStroke}
        onDeleteStroke={emitDeleteStroke}
        onCursorMove={emitCursor}
        onLaserMove={emitLaser}
        remoteLaserEvents={remoteLaser}
        onSelectTool={setTool}
        onImageUpload={handleImageUpload}
        onViewportChange={({ zoom: z, panOffset: p }) => {
          setViewportZoom(z);
          setViewportPan(p);
        }}
      />

      {/* Interactive Minimap (Bottom-Left above Zoom controls) */}
      {!isPresentationMode && (
        <div className="absolute bottom-16 left-4 z-40">
          <Minimap
            strokes={strokes}
            zoom={viewportZoom}
            panOffset={viewportPan}
            bgTheme={bgTheme}
            onPanChange={(newPan) => canvasRef.current?.setPan(newPan)}
          />
        </div>
      )}

      {/* Right Toolbar */}
      {!isPresentationMode && (
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          width={width}
          setWidth={setWidth}
          lineStyle={lineStyle}
          setLineStyle={setLineStyle}
          selectedStamp={selectedStamp}
          setSelectedStamp={setSelectedStamp}
          bgTheme={bgTheme}
          setBgTheme={setBgTheme}
          onUndo={emitUndo}
          onClear={emitClear}
          onExport={handleExport}
          onImportJSON={handleImportJSON}
          onImageUpload={handleImageUpload}
          onTogglePresentation={() => setIsPresentationMode(prev => !prev)}
        />
      )}

      {/* Chat Sidebar */}
      {!isPresentationMode && (
        <ChatSidebar
          messages={messages}
          onlineUsers={onlineUsers}
          onSendChat={emitChat}
        />
      )}

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <ShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
