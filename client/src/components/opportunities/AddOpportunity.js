import React, { useState } from 'react';

const AddOpportunity = () => {
  const [name, setName] = useState('');
  const [potentialValue, setPotentialValue] = useState('');
  const [status, setStatus] = useState('Negotiation');
  const [leadId, setLeadId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const opportunityData = { name, potential_value: potentialValue, status, lead_id: leadId };

    const response = await fetch('http://localhost:5000/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opportunityData),
    });

    if (response.ok) {
      alert('Opportunity added successfully');
    } else {
      alert('Error adding opportunity');
    }
  };

  return (
    <div>
      <h2>Add Opportunity</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Opportunity Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Potential Value" value={potentialValue} onChange={(e) => setPotentialValue(e.target.value)} required />
        <input type="text" placeholder="Lead ID" value={leadId} onChange={(e) => setLeadId(e.target.value)} required />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Negotiation">Negotiation</option>
          <option value="Contract Sent">Contract Sent</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <button type="submit">Add Opportunity</button>
      </form>
    </div>
  );
};

export default AddOpportunity;
