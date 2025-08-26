import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

// Main App component - manages global state and API calls
function App() {
  // State management
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  // API base URL - uses environment variable or defaults to localhost
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch all tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.data);
      } else {
        setError(data.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Network error: Could not connect to server');
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add new task to local state
        setTasks(prevTasks => [...prevTasks, data.data]);
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to create task');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMessage = 'Network error: Could not create task';
      setError(errorMessage);
      console.error('Create task error:', err);
      return { success: false, message: errorMessage };
    }
  };

  // Update existing task
  const updateTask = async (taskId, updates) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update task in local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId ? data.data : task
          )
        );
        return { success: true, data: data.data };
      } else {
        setError(data.message || 'Failed to update task');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMessage = 'Network error: Could not update task';
      setError(errorMessage);
      console.error('Update task error:', err);
      return { success: false, message: errorMessage };
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove task from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        return { success: true };
      } else {
        setError(data.message || 'Failed to delete task');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const errorMessage = 'Network error: Could not delete task';
      setError(errorMessage);
      console.error('Delete task error:', err);
      return { success: false, message: errorMessage };
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    await updateTask(taskId, { completed: !task.completed });
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleSaveEdit = async (taskData) => {
    if (!editingTask) return;
    
    const result = await updateTask(editingTask.id, taskData);
    if (result.success) {
      setEditingTask(null);
    }
    return result;
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>Task Manager</h1>
        <p>A simple CRUD application built with React and Node.js</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="error">
          {error}
          <button 
            onClick={fetchTasks} 
            className="btn btn-secondary btn-small"
            style={{ marginLeft: '10px' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Task form */}
      <TaskForm 
        onSubmit={editingTask ? handleSaveEdit : createTask}
        onCancel={editingTask ? handleCancelEdit : null}
        initialData={editingTask}
        isEditing={!!editingTask}
      />

      {/* Task list */}
      <TaskList 
        tasks={tasks}
        loading={loading}
        onToggleComplete={toggleTaskCompletion}
        onEditTask={handleEditTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;