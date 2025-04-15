import React, { useState, useEffect } from 'react';

const NoteList = ({ clientId, leadId, opportunityId }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, [clientId, leadId, opportunityId]);

  const fetchNotes = async () => {
    let url = 'http://localhost:5000/notes';
    if (clientId) url += `?client_id=${clientId}`;
    if (leadId) url += `?lead_id=${leadId}`;
    if (opportunityId) url += `?opportunity_id=${opportunityId}`;

    const response = await fetch(url);
    const data = await response.json();
    setNotes(data);
  };

  return (
    <div>
      <h3>Notes</h3>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <p>{note.content}</p>
            <p>Created At: {note.created_at}</p>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoteList;
