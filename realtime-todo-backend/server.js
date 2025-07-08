require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const connectDB = require('./config/db');

// Routes and Controllers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const actionRoutes = require('./routes/actionRoutes');
const taskController = require('./controllers/taskController'); // Keep this import

// ✅ 1. FIRST connect to DB
connectDB();

const app = express();
const server = http.createServer(app);

// ✅ 2. Configure CORS BEFORE routes
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// ✅ 3. Initialize Socket.IO EARLY
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    // Socket.IO primarily uses GET/POST for its transport, but including others for consistency with REST API is fine.
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
});

// ✅ 4. PROPERLY inject io instance using the already imported taskController
taskController.setIO(io);

// ✅ 5. Configure socket auth and error handling (middleware for all incoming socket connections)
io.use((socket, next) => {
  // Example: Add your authentication logic here.
  // If auth fails, call next(new Error('Authentication error'));
  // Otherwise, call next();
  next();
});

io.on('connection', (socket) => {
  console.log('✅ Connected:', socket.id);

  // Add a console.log here to confirm this server.js is running and receiving the event
  socket.on('update_task_status', async (payload, ack) => {
    console.log(`[Server.js] Received 'update_task_status' event from client ${socket.id}. Payload:`, payload);
    try {
      await taskController.updateTaskStatusFromSocket(payload, ack);
    } catch (err) {
      console.error('❌ Socket error during update_task_status:', err);
      // Ensure the client receives an error acknowledgment
      ack?.({ error: err.message || 'Unknown server error' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ Disconnected (${reason}): ${socket.id}`);
  });
});

// ✅ 6. Add global error handler for Socket.IO engine
io.engine.on('connection_error', (err) => {
  console.error('❌ Socket transport error:', err);
});

// REST API Routes (AFTER socket setup, but order here doesn't strictly matter for Socket.IO)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/actions', actionRoutes);

// Fallback route (optional, but good for basic API check)
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server+Socket.IO running on ${PORT}`);
});
