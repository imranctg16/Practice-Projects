import React, { useState, useEffect } from 'react';

// TaskForm component - handles creating and editing tasks
const TaskForm = ({ onSubmit, onCancel, initialData, isEditing }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Update form when editing different task
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        description: ''
      });
    }
    setFormError(null);
  }, [isEditing, initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formError) {
      setFormError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      // Call the parent's submit handler
      const result = await onSubmit(formData);
      
      if (result.success) {
        // Reset form if creating new task
        if (!isEditing) {
          setFormData({
            title: '',
            description: ''
          });
        }
      } else {
        setFormError(result.message || 'Failed to save task');
      }
    } catch (error) {
      setFormError('An error occurred while saving the task');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({
      title: '',
      description: ''
    });
    setFormError(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="task-form">
      <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
      
      {/* Form error message */}
      {formError && (
        <div className="error" style={{ marginBottom: '15px' }}>
          {formError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Description textarea */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)"
            disabled={isSubmitting}
            rows="3"
          />
        </div>

        {/* Form buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Add Task')}
          </button>
          
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;