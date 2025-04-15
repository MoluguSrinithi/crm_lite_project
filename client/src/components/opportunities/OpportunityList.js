import React, { useState, useEffect } from 'react';

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    const response = await fetch('http://localhost:5000/opportunities');
    const data = await response.json();
    setOpportunities(data);
  };

  return (
    <div>
      <h2>Opportunities</h2>
      <ul>
        {opportunities.map((opp) => (
          <li key={opp.id}>
            <p>{opp.name}</p>
            <p>Value: {opp.potential_value}</p>
            <p>Status: {opp.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OpportunityList;
