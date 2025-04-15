import React, { useState, useEffect } from 'react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Add editing state
  const [editingLead, setEditingLead] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [searchQuery]);

  const fetchLeads = async () => {
    const response = await fetch(`http://localhost:5000/leads?query=${searchQuery}`);
    const data = await response.json();
    setLeads(data);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle deleting a lead
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const response = await fetch(`http://localhost:5000/leads/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove lead from state
          setLeads(leads.filter(lead => lead.id !== id));
        } else {
          alert('Error deleting lead');
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        alert('Error deleting lead');
      }
    }
  };

  // Start editing a lead
  const startEditing = (lead) => {
    setEditingLead(lead.id);
    setEditName(lead.name);
    setEditEmail(lead.email);
    setEditPhone(lead.phone || '');
    setEditSource(lead.source || '');
    setEditStatus(lead.status || 'New');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingLead(null);
  };

  // Save edited lead
  const saveEdit = async (id) => {
    try {
      const leadData = { 
        name: editName, 
        email: editEmail, 
        phone: editPhone, 
        source: editSource,
        status: editStatus 
      };

      console.log('Updating lead with data:', leadData);

      const response = await fetch(`http://localhost:5000/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        // Update the lead in state
        setLeads(leads.map(lead => 
          lead.id === id 
            ? { ...lead, 
                name: editName, 
                email: editEmail, 
                phone: editPhone, 
                source: editSource,
                status: editStatus 
              } 
            : lead
        ));
        setEditingLead(null);
        // Refresh leads list
        fetchLeads();
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert(`Error updating lead: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error updating lead: Network error');
    }
  };

  // Status badge color
  const getStatusClass = (status) => {
    switch(status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'Qualified': return 'status-qualified';
      default: return '';
    }
  };

  return (
    <div className="lead-list-container">
      <h2 className="list-title">Your Leads</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search leads by name, email, or status..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      
      {leads.length === 0 ? (
        <div className="no-leads">No leads found. Add a new lead to get started.</div>
      ) : (
        <div className="leads-wrapper">
          {leads.map((lead) => (
            <div key={lead.id} className="lead-item">
              {editingLead === lead.id ? (
                <div className="lead-edit-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={(e) => setEditEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input 
                      type="text" 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Source</label>
                    <input 
                      type="text" 
                      value={editSource} 
                      onChange={(e) => setEditSource(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      value={editStatus} 
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button className="save-btn" onClick={() => saveEdit(lead.id)}>Save</button>
                    <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="lead-info">
                    <h3 className="lead-name">{lead.name}</h3>
                    <p className="lead-email">{lead.email}</p>
                    {lead.phone && <p className="lead-phone">{lead.phone}</p>}
                    {lead.source && <p className="lead-source">Source: {lead.source}</p>}
                    <div className={`lead-status ${getStatusClass(lead.status)}`}>
                      {lead.status}
                    </div>
                  </div>
                  <div className="lead-actions">
                    <button className="action-btn edit-btn" onClick={() => startEditing(lead)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(lead.id)}>Delete</button>
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

export default LeadList;