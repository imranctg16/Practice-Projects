import React, { useState } from 'react';

// TaskItem component - displays individual task with actions
const TaskItem = ({ task, onToggleComplete, onEditTask, onDeleteTask }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete with confirmation
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsDeleting(true);
        await onDeleteTask(task.id);
      } catch (error) {
        console.error('Delete error:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Handle toggle completion
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
  };

  // Handle edit
  const handleEdit = () => {
    onEditTask(task);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        {/* Task title */}
        <div className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </div>

        {/* Task description */}
        {task.description && (
          <div className="task-description">
            {task.description}
          </div>
        )}

        {/* Task status badge */}
        <div className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </div>
      </div>

      {/* Task actions */}
      <div className="task-actions">
        {/* Complete/Uncomplete button */}
        <button
          onClick={handleToggleComplete}
          className={`btn btn-small ${task.completed ? 'btn-secondary' : 'btn-success'}`}
          title={task.completed ? 'Mark as pending' : 'Mark as complete'}
        >
          {task.completed ? 'Undo' : 'Complete'}
        </button>

        {/* Edit button */}
        <button
          onClick={handleEdit}
          className="btn btn-primary btn-small"
          title="Edit task"
        >
          Edit
        </button>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="btn btn-danger btn-small"
          disabled={isDeleting}
          title="Delete task"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default TaskItem;