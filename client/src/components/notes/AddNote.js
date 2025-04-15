import React, { useState } from 'react';

const AddNote = ({ clientId, leadId, opportunityId }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const noteData = {
      content,
      client_id: clientId,
      lead_id: leadId,
      opportunity_id: opportunityId,
    };

    const response = await fetch('http://localhost:5000/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData),
    });

    if (response.ok) {
      alert('Note added successfully');
      setContent('');
    } else {
      alert('Error adding note');
    }
  };

  return (
    <div>
      <h3>Add Note</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default AddNote;
