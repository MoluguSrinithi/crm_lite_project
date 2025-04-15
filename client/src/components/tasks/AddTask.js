
import React, { useState } from 'react';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = { title, description, status, due_date: dueDate };

    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      alert('Task added successfully');
      // Clear form
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDueDate('');
    } else {
      alert('Error adding task');
    }
  };

  return (
    <div className="add-task-container">
      <h2 className="form-title">Add New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input 
            type="text" 
            id="title"
            placeholder="Task title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            placeholder="Task description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            required 
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input 
            type="date" 
            id="dueDate"
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
