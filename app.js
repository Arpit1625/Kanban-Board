const express = require('express');
const cors = require('cors');

// Route imports
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');
const taskRoutes = require('./routes/taskRoutes'); // ✅ NEW

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug route mounting logs
console.log('✅ Mounting /api/auth');
console.log('✅ Mounting /api/boards');
console.log('✅ Mounting /api/columns');
console.log('✅ Mounting /api/tasks');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/columns', columnRoutes);
app.use('/api/tasks', taskRoutes); // ✅ NEW

// Test root
app.get('/', (req, res) => {
  res.send('Kanban API is running...');
});

module.exports = app;
