import React, { useState } from 'react';

const AddLead = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [status, setStatus] = useState('New');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadData = { name, email, phone, source, status };

    const response = await fetch('http://localhost:5000/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });

    if (response.ok) {
      alert('Lead added successfully');
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setSource('');
      setStatus('New');
    } else {
      alert('Error adding lead');
    }
  };

  return (
    <div className="add-lead-container">
      <h2 className="form-title">Add New Lead</h2>
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name"
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input 
            type="text" 
            id="phone"
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="source">Source</label>
          <input 
            type="text" 
            id="source"
            placeholder="Lead Source" 
            value={source} 
            onChange={(e) => setSource(e.target.value)} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status"
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Add Lead</button>
      </form>
    </div>
  );
};

export default AddLead;



