const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const port = process.env.PORT || 4000;
const app = express();

// Middleware
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (!process.env.CLIENT_URL || process.env.CLIENT_URL === '*') return true;
  const cleanOrigin = origin.trim().replace(/\/+$/, '').toLowerCase();
  const allowedOrigins = process.env.CLIENT_URL.split(',').map(u => u.trim().replace(/\/+$/, '').toLowerCase());
  if (allowedOrigins.includes(cleanOrigin)) return true;
  if (cleanOrigin.includes('localhost') || cleanOrigin.endsWith('.vercel.app')) return true;
  return true; // Fallback: allow all to prevent breaking deployments
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// In-memory storage (use Redis in production)
const rooms = new Map();
const MAX_STROKES_PER_ROOM = 1000;
const MAX_USERS_PER_ROOM = 50;
const ROOM_CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Room management
const createRoom = () => {
  const roomId = uuidv4().substring(0, 8).toUpperCase();
  rooms.set(roomId, {
    id: roomId,
    strokes: [],
    users: new Map(),
    createdAt: Date.now(),
    lastActivity: Date.now()
  });
  return roomId;
};

const getRoom = (roomId) => {
  const room = rooms.get(roomId);
  if (room) {
    room.lastActivity = Date.now();
  }
  return room;
};

const addUserToRoom = (roomId, socketId, userName) => {
  const room = getRoom(roomId);
  if (!room) return null;
  
  if (room.users.size >= MAX_USERS_PER_ROOM) {
    throw new Error('Room is full');
  }
  
  room.users.set(socketId, {
    id: socketId,
    name: userName,
    joinedAt: Date.now(),
    lastSeen: Date.now()
  });
  
  return room;
};

const removeUserFromRoom = (roomId, socketId) => {
  const room = rooms.get(roomId);
  if (room) {
    room.users.delete(socketId);
    if (room.users.size === 0) {
      // Clean up empty rooms after delay
      setTimeout(() => {
        const currentRoom = rooms.get(roomId);
        if (currentRoom && currentRoom.users.size === 0) {
          rooms.delete(roomId);
          console.log(`Cleaned up empty room: ${roomId}`);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }
};

const addStrokeToRoom = (roomId, stroke) => {
  const room = getRoom(roomId);
  if (!room) return false;
  
  // Validate stroke data & cap points per stroke to prevent memory exhaustion
  if (!stroke.path || !Array.isArray(stroke.path) || stroke.path.length === 0 || stroke.path.length > 2000) {
    return false;
  }
  
  // Limit strokes per room
  if (room.strokes.length >= MAX_STROKES_PER_ROOM) {
    room.strokes.shift(); // Remove oldest stroke
  }
  
  const strokeWithId = {
    ...stroke,
    id: stroke.id || uuidv4(),
    timestamp: Date.now()
  };
  
  room.strokes.push(strokeWithId);
  return strokeWithId;
};

// API Routes
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'NexusBoard Socket.IO Server is active!',
    frontend: 'https://nexus-board-seven.vercel.app',
    health: '/health'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    rooms: rooms.size,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.post('/rooms', (req, res) => {
  try {
    const roomId = createRoom();
    res.json({ roomId });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

app.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params;
  const room = rooms.get(roomId);
  
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  
  res.json({
    roomId: room.id,
    userCount: room.users.size,
    strokeCount: room.strokes.length,
    createdAt: room.createdAt,
    lastActivity: room.lastActivity
  });
});

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6, // 1MB
  transports: ['websocket', 'polling']
});

// Rate limiting
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_EVENTS_PER_WINDOW = {
  draw: 60,
  cursor: 50,
  chat: 10,
  clear: 10,
  undo: 20,
  laser: 60
};

const checkRateLimit = (socketId, eventType) => {
  const now = Date.now();
  const key = `${socketId}:${eventType}`;
  
  if (!rateLimits.has(key)) {
    rateLimits.set(key, { count: 0, resetTime: now + RATE_LIMIT_WINDOW });
  }
  
  const limit = rateLimits.get(key);
  
  if (now > limit.resetTime) {
    limit.count = 0;
    limit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  limit.count++;
  return limit.count <= (MAX_EVENTS_PER_WINDOW[eventType] || 10);
};

// Validate or auto-associate room for socket operations
const validateSocketRoom = (socket, incomingRoomId) => {
  const normIncoming = (incomingRoomId || '').trim().toUpperCase();
  const socketRoom = (socket.data?.roomId || '').trim().toUpperCase();

  if (socketRoom && (!normIncoming || socketRoom === normIncoming)) {
    return socketRoom;
  }

  // Auto-recover room association if socket.data.roomId was delayed during mobile reconnect
  if (normIncoming) {
    let room = rooms.get(normIncoming);
    if (!room) {
      rooms.set(normIncoming, {
        id: normIncoming,
        strokes: [],
        users: new Map(),
        createdAt: Date.now(),
        lastActivity: Date.now()
      });
    }
    socket.join(normIncoming);
    socket.data = { ...(socket.data || {}), roomId: normIncoming };
    return normIncoming;
  }

  return socketRoom || null;
};

// Socket event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('join-room', ({ roomId, userName }) => {
    try {
      // Validate input
      if (!roomId || !userName || typeof userName !== 'string') {
        socket.emit('error', { message: 'Invalid room ID or username' });
        return;
      }
      
      userName = userName.trim().substring(0, 20);
      roomId = roomId.trim().toUpperCase();

      // Clean up previous room membership if switching rooms
      if (socket.data?.roomId) {
        removeUserFromRoom(socket.data.roomId, socket.id);
        socket.leave(socket.data.roomId);
      }
      
      // Check if room exists, create if not
      let room = rooms.get(roomId);
      if (!room) {
        rooms.set(roomId, {
          id: roomId,
          strokes: [],
          users: new Map(),
          createdAt: Date.now(),
          lastActivity: Date.now()
        });
        room = rooms.get(roomId);
      }
      
      // Add user to room
      try {
        addUserToRoom(roomId, socket.id, userName);
      } catch (error) {
        socket.emit('error', { message: error.message });
        return;
      }
      
      // Join socket room
      socket.join(roomId);
      socket.data = { roomId, userName };
      
      // Send room state to joining user
      socket.emit('room-state', {
        strokes: room.strokes,
        users: Array.from(room.users.values())
      });
      
      // Notify others
      socket.to(roomId).emit('user-joined', {
        userName,
        users: Array.from(room.users.values())
      });
      
      console.log(`User ${userName} joined room ${roomId}`);
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });
  
  socket.on('draw', (data) => {
    try {
      if (!checkRateLimit(socket.id, 'draw')) {
        socket.emit('error', { message: 'Rate limit exceeded' });
        return;
      }
      
      const roomId = validateSocketRoom(socket, data?.roomId);
      if (!roomId) {
        socket.emit('error', { message: 'Invalid room' });
        return;
      }
      
      // Add stroke to room
      const createdStroke = addStrokeToRoom(roomId, data);
      if (createdStroke) {
        socket.to(roomId).emit('draw', createdStroke);
      } else {
        socket.emit('error', { message: 'Invalid stroke data' });
      }
      
    } catch (error) {
      console.error('Error handling draw:', error);
      socket.emit('error', { message: 'Draw operation failed' });
    }
  });

  socket.on('update-stroke', ({ roomId, updatedStroke }) => {
    try {
      if (!checkRateLimit(socket.id, 'draw')) return;
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId || !updatedStroke?.id) return;
      
      const room = getRoom(targetRoomId);
      if (room) {
        const index = room.strokes.findIndex(s => s.id === updatedStroke.id);
        if (index !== -1) {
          room.strokes[index] = updatedStroke;
          socket.to(targetRoomId).emit('update-stroke', updatedStroke);
        }
      }
    } catch (error) {
      console.error('Error handling update-stroke:', error);
    }
  });

  socket.on('delete-stroke', ({ roomId, strokeId }) => {
    try {
      if (!checkRateLimit(socket.id, 'clear')) return;
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId || !strokeId) return;

      const room = getRoom(targetRoomId);
      if (room) {
        room.strokes = room.strokes.filter(s => s.id !== strokeId);
        io.in(targetRoomId).emit('delete-stroke', { strokeId });
      }
    } catch (error) {
      console.error('Error handling delete-stroke:', error);
    }
  });
  
  socket.on('clear', (roomId) => {
    try {
      if (!checkRateLimit(socket.id, 'clear')) return;
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId) return;
      
      const room = getRoom(targetRoomId);
      if (room) {
        room.strokes = [];
        io.in(targetRoomId).emit('clear');
      }
      
    } catch (error) {
      console.error('Error handling clear:', error);
    }
  });
  
  socket.on('undo', ({ roomId }) => {
    try {
      if (!checkRateLimit(socket.id, 'undo')) return;
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId) return;
      
      const room = getRoom(targetRoomId);
      if (room && room.strokes.length > 0) {
        room.strokes.pop();
        io.in(targetRoomId).emit('undo', { strokes: room.strokes });
      }
      
    } catch (error) {
      console.error('Error handling undo:', error);
    }
  });
  
  socket.on('chat', ({ roomId, message, timestamp }) => {
    try {
      if (!checkRateLimit(socket.id, 'chat')) {
        socket.emit('error', { message: 'Chat rate limit exceeded' });
        return;
      }
      
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId || !message) return;
      
      message = message.trim().substring(0, 500);
      if (!message) return;
      
      socket.to(targetRoomId).emit('chat', {
        userName: socket.data?.userName || 'Anonymous',
        message,
        timestamp: timestamp || Date.now()
      });
      
    } catch (error) {
      console.error('Error handling chat:', error);
    }
  });
  
  socket.on('cursor', ({ roomId, cursor }) => {
    try {
      if (!checkRateLimit(socket.id, 'cursor')) return;
      
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId || !cursor || typeof cursor.x !== 'number' || typeof cursor.y !== 'number') {
        return;
      }
      
      socket.to(targetRoomId).emit('cursor', {
        socketId: socket.id,
        cursor: { x: cursor.x, y: cursor.y },
        userName: socket.data?.userName || 'User'
      });
      
    } catch (error) {
      console.error('Error handling cursor:', error);
    }
  });

  socket.on('laser', ({ roomId, point }) => {
    try {
      if (!checkRateLimit(socket.id, 'laser')) return;
      const targetRoomId = validateSocketRoom(socket, roomId);
      if (!targetRoomId || !point || typeof point.x !== 'number' || typeof point.y !== 'number') {
        return;
      }
      
      socket.to(targetRoomId).emit('laser', {
        socketId: socket.id,
        point: { x: point.x, y: point.y },
        color: point.color || '#ef4444'
      });
      
    } catch (error) {
      console.error('Error handling laser:', error);
    }
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
    
    // Clean up rate limit keys for disconnected socket
    for (const key of rateLimits.keys()) {
      if (key.startsWith(`${socket.id}:`)) {
        rateLimits.delete(key);
      }
    }

    if (socket.data?.roomId) {
      const { roomId, userName } = socket.data;
      
      removeUserFromRoom(roomId, socket.id);
      
      const room = rooms.get(roomId);
      const users = room ? Array.from(room.users.values()) : [];
      
      socket.to(roomId).emit('user-left', {
        userName,
        socketId: socket.id,
        users
      });
    }
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Cleanup old rooms periodically
setInterval(() => {
  const now = Date.now();
  const roomsToDelete = [];
  
  for (const [roomId, room] of rooms.entries()) {
    if (now - room.lastActivity > ROOM_CLEANUP_INTERVAL) {
      roomsToDelete.push(roomId);
    }
  }
  
  roomsToDelete.forEach(roomId => {
    rooms.delete(roomId);
    console.log(`Cleaned up inactive room: ${roomId}`);
  });
  
  // Clean up rate limits
  for (const [key, limit] of rateLimits.entries()) {
    if (now > limit.resetTime + RATE_LIMIT_WINDOW) {
      rateLimits.delete(key);
    }
  }
}, ROOM_CLEANUP_INTERVAL);

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});