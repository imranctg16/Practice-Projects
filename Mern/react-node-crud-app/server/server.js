const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// In-memory data store (replaces database for simplicity)
let tasks = [
  { id: 1, title: 'Learn React', description: 'Complete React tutorial', completed: false },
  { id: 2, title: 'Build API', description: 'Create Express REST API', completed: true },
  { id: 3, title: 'Setup Docker', description: 'Dockerize the application', completed: false }
];

// Helper function to find task by ID
const findTaskById = (id) => tasks.find(task => task.id === parseInt(id));

// Helper function to generate new ID
const generateId = () => tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

// CRUD Routes

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req, res) => {
  console.log('GET /api/tasks - Fetching all tasks');
  res.json({
    success: true,
    data: tasks,
    message: 'Tasks retrieved successfully'
  });
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  console.log('POST /api/tasks - Creating new task:', req.body);
  
  const { title, description } = req.body;
  
  // Validation
  if (!title || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }
  
  // Create new task
  const newTask = {
    id: generateId(),
    title: title.trim(),
    description: description ? description.trim() : '',
    completed: false
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    data: newTask,
    message: 'Task created successfully'
  });
});

// PUT /api/tasks/:id - Update an existing task
app.put('/api/tasks/:id', (req, res) => {
  console.log(`PUT /api/tasks/${req.params.id} - Updating task:`, req.body);
  
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const { title, description, completed } = req.body;
  
  // Validation
  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Title cannot be empty'
    });
  }
  
  // Update task (only update provided fields)
  if (title !== undefined) tasks[taskIndex].title = title.trim();
  if (description !== undefined) tasks[taskIndex].description = description.trim();
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  
  res.json({
    success: true,
    data: tasks[taskIndex],
    message: 'Task updated successfully'
  });
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  console.log(`DELETE /api/tasks/${req.params.id} - Deleting task`);
  
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const deletedTask = tasks.splice(taskIndex, 1)[0];
  
  res.json({
    success: true,
    data: deletedTask,
    message: 'Task deleted successfully'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET    /api/tasks     - Get all tasks`);
  console.log(`   POST   /api/tasks     - Create new task`);
  console.log(`   PUT    /api/tasks/:id - Update task`);
  console.log(`   DELETE /api/tasks/:id - Delete task`);
  console.log(`   GET    /api/health    - Health check`);
});