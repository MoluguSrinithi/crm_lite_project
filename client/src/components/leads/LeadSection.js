import React from "react";
import LeadList from "./LeadList";
import AddLead from "./AddLead";
import "../../Card.css";

const LeadSection = () => {
  return (
    <div className="lead-section">
      <h1 className="section-title">Lead Management</h1>
      <div className="lead-container">
        <div className="card add-lead-card">
          <AddLead />
        </div>
        <div className="card lead-list-card">
          <LeadList />
        </div>
      </div>
    </div>
  );
};

export default LeadSection;

