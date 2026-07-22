import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';

export function useWhiteboard({
  roomId,
  userName,
  joined,
  onRemoteDraw,
  onRemoteClear,
  onRemoteUndo,
  onRemoteLaser,
  onRemoteUpdateStroke,
  onRemoteDeleteStroke,
}) {
  const socketRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [messages, setMessages] = useState([]);
  const [strokes, setStrokes] = useState([]);
  const [cursors, setCursors] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [error, setError] = useState(null);

  const lastCursorEmit = useRef(Date.now());
  const lastLaserEmit = useRef(Date.now());

  // Store callback props in refs to avoid socket effect re-binding
  const callbacksRef = useRef({
    onRemoteDraw,
    onRemoteClear,
    onRemoteUndo,
    onRemoteLaser,
    onRemoteUpdateStroke,
    onRemoteDeleteStroke,
  });

  useEffect(() => {
    callbacksRef.current = {
      onRemoteDraw,
      onRemoteClear,
      onRemoteUndo,
      onRemoteLaser,
      onRemoteUpdateStroke,
      onRemoteDeleteStroke,
    };
  }, [onRemoteDraw, onRemoteClear, onRemoteUndo, onRemoteLaser, onRemoteUpdateStroke, onRemoteDeleteStroke]);

  // Socket connection initialization
  useEffect(() => {
    if (!joined || !roomId || !userName) return;

    const socket = io(SERVER_URL, {
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      setError(null);
      socket.emit('join-room', { roomId, userName });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('reconnect', () => {
      setConnectionStatus('connected');
      setError(null);
      socket.emit('join-room', { roomId, userName });
    });

    socket.on('connect_error', (err) => {
      setConnectionStatus('error');
      setError(`Connection failed: ${err.message}`);
    });

    socket.on('error', (err) => {
      setError(`Socket error: ${err.message || err}`);
    });

    // Room sync events
    socket.on('room-state', ({ strokes: roomStrokes, users }) => {
      setStrokes(roomStrokes || []);
      setOnlineUsers(users || []);
      if (callbacksRef.current.onRemoteUndo) {
        callbacksRef.current.onRemoteUndo(roomStrokes || []);
      }
    });

    socket.on('user-joined', ({ userName: name, users }) => {
      setMessages(prev => [...prev, { type: 'system', text: `${name} joined`, timestamp: Date.now() }]);
      if (users) setOnlineUsers(users);
    });

    socket.on('user-left', ({ userName: name, socketId, users }) => {
      if (name) {
        setMessages(prev => [...prev, { type: 'system', text: `${name} left`, timestamp: Date.now() }]);
      }
      setCursors(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
      if (users) setOnlineUsers(users);
    });

    socket.on('draw', (stroke) => {
      setStrokes(prev => [...prev, stroke]);
      if (callbacksRef.current.onRemoteDraw) {
        callbacksRef.current.onRemoteDraw(stroke);
      }
    });

    socket.on('update-stroke', (updatedStroke) => {
      setStrokes(prev => prev.map(s => (s.id === updatedStroke.id ? updatedStroke : s)));
      if (callbacksRef.current.onRemoteUpdateStroke) {
        callbacksRef.current.onRemoteUpdateStroke(updatedStroke);
      }
    });

    socket.on('delete-stroke', ({ strokeId }) => {
      setStrokes(prev => prev.filter(s => s.id !== strokeId));
      if (callbacksRef.current.onRemoteDeleteStroke) {
        callbacksRef.current.onRemoteDeleteStroke(strokeId);
      }
    });

    socket.on('clear', () => {
      setStrokes([]);
      if (callbacksRef.current.onRemoteClear) {
        callbacksRef.current.onRemoteClear();
      }
    });

    socket.on('undo', ({ strokes: updatedStrokes }) => {
      setStrokes(updatedStrokes || []);
      if (callbacksRef.current.onRemoteUndo) {
        callbacksRef.current.onRemoteUndo(updatedStrokes || []);
      }
    });

    socket.on('chat', ({ userName: sender, message, timestamp }) => {
      setMessages(prev => [...prev, {
        type: 'chat',
        sender,
        text: message,
        timestamp: timestamp || Date.now()
      }]);
    });

    socket.on('cursor', ({ socketId, cursor, userName: name }) => {
      setCursors(prev => ({
        ...prev,
        [socketId]: { ...cursor, name, lastSeen: Date.now() }
      }));
    });

    socket.on('laser', ({ socketId, point, color }) => {
      if (callbacksRef.current.onRemoteLaser) {
        callbacksRef.current.onRemoteLaser({ socketId, point, color });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [joined, roomId, userName]);

  const emitDraw = useCallback((strokeData) => {
    if (!socketRef.current) return;
    setStrokes(prev => [...prev, strokeData]);
    socketRef.current.emit('draw', strokeData);
  }, []);

  const emitUpdateStroke = useCallback((updatedStroke) => {
    if (!socketRef.current || !updatedStroke?.id) return;
    setStrokes(prev => prev.map(s => (s.id === updatedStroke.id ? updatedStroke : s)));
    socketRef.current.emit('update-stroke', { roomId, updatedStroke });
  }, [roomId]);

  const emitDeleteStroke = useCallback((strokeId) => {
    if (!socketRef.current || !strokeId) return;
    setStrokes(prev => prev.filter(s => s.id !== strokeId));
    socketRef.current.emit('delete-stroke', { roomId, strokeId });
  }, [roomId]);

  const emitClear = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('clear', roomId);
  }, [roomId]);

  const emitUndo = useCallback(() => {
    if (!socketRef.current) return;
    socketRef.current.emit('undo', { roomId });
  }, [roomId]);

  const emitChat = useCallback((message) => {
    if (!message || !socketRef.current) return;
    const chatData = { roomId, message, timestamp: Date.now() };
    socketRef.current.emit('chat', chatData);
    setMessages(prev => [...prev, {
      type: 'chat',
      sender: 'Me',
      text: message,
      timestamp: Date.now()
    }]);
  }, [roomId]);

  const emitCursor = useCallback((x, y) => {
    const now = Date.now();
    if (now - lastCursorEmit.current > 40 && socketRef.current) { // ~25fps throttle
      socketRef.current.emit('cursor', { roomId, cursor: { x, y } });
      lastCursorEmit.current = now;
    }
  }, [roomId]);

  const emitLaser = useCallback((x, y, color) => {
    const now = Date.now();
    if (now - lastLaserEmit.current > 30 && socketRef.current) {
      socketRef.current.emit('laser', { roomId, point: { x, y, color } });
      lastLaserEmit.current = now;
    }
  }, [roomId]);

  return {
    socket: socketRef.current,
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
  };
}
