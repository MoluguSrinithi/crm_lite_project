
import React, { useState, useEffect } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Error fetching tasks:', response.statusText);
      }
    } catch (error) {
      console.error('Network error when fetching tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:5000/tasks/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          // Remove task from state
          setTasks(tasks.filter(task => task.id !== id));
        } else {
          const errorData = await response.json();
          console.error('Server error:', errorData);
          alert(`Error deleting task: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task: Network error');
      }
    }
  };

  

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    
    // Format date properly - handle both date formats from backend
    let formattedDate = '';
    if (task.due_date) {
      // Handle ISO format or MySQL date format
      if (task.due_date.includes('T')) {
        formattedDate = task.due_date.split('T')[0];
      } else {
        formattedDate = task.due_date;
      }
    }
    setEditDueDate(formattedDate);
    
    setEditStatus(task.status);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const saveEdit = async (id) => {
    try {
      const taskData = { 
        title: editTitle, 
        description: editDescription, 
        status: editStatus, 
        due_date: new Date(editDueDate).toUTCString() 
      };

      console.log('Updating task with data:', taskData);

      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        // Update the task in state
        setTasks(tasks.map(task => 
          task.id === id 
            ? { ...task, 
                title: editTitle, 
                description: editDescription, 
                due_date: editDueDate, 
                status: editStatus 
              } 
            : task
        ));
        setEditingTask(null);
        // Refresh tasks list
        fetchTasks();
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Server error:', errorData);
        alert(`Error updating task: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Error updating task: Network error');
    }
  };

  // Status badge color function
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Check if a task is overdue
  const isOverdue = (dateString, status) => {
    if (status === 'Completed' || !dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    return dueDate < today;
  };

  return (
    <div className="task-list-container">
      <h2 className="list-title">Your Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks found. Add a new task to get started.</div>
      ) : (
        <div className="tasks-wrapper">
          {tasks.map((task) => (
            <div key={task.id} className={`task-item ${isOverdue(task.due_date, task.status) ? 'task-overdue' : ''}`}>
              {editingTask === task.id ? (
                <div className="task-edit-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={(e) => setEditTitle(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      value={editDescription} 
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input 
                      type="date" 
                      value={editDueDate} 
                      onChange={(e) => setEditDueDate(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={editStatus} 
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdit(task.id)}>Save</button>
                    <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-info">
                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                    <div className="task-meta">
                      <span className={`task-status ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                      <span className={`task-due-date ${isOverdue(task.due_date, task.status) ? 'overdue' : ''}`}>
                        Due: {formatDate(task.due_date)}
                        {isOverdue(task.due_date, task.status) && <span className="overdue-label"> (Overdue)</span>}
                      </span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="action-btn edit-btn" onClick={() => startEditing(task)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;