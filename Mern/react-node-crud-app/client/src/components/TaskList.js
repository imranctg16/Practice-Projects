import React from 'react';
import TaskItem from './TaskItem';

// TaskList component - displays list of tasks
const TaskList = ({ tasks, loading, onToggleComplete, onEditTask, onDeleteTask }) => {
  // Loading state
  if (loading) {
    return (
      <div className="task-list">
        <h2>Your Tasks</h2>
        <div className="loading">
          Loading tasks...
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <h2>Your Tasks</h2>
        <div className="empty-state">
          <h3>No tasks yet!</h3>
          <p>Add your first task using the form above.</p>
        </div>
      </div>
    );
  }

  // Sort tasks - incomplete first, then by ID (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete tasks first
    }
    return b.id - a.id; // Newest first within same completion status
  });

  return (
    <div className="task-list">
      <h2>Your Tasks ({tasks.length})</h2>
      
      {/* Task statistics */}
      <div style={{ padding: '0 20px 10px', color: '#666', fontSize: '14px' }}>
        {tasks.filter(t => !t.completed).length} pending, {tasks.filter(t => t.completed).length} completed
      </div>

      {/* Render each task */}
      {sortedTasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;