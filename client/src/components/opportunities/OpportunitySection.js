import React from "react";
import OpportunityList from "./OpportunityList";
import AddOpportunity from "./AddOpportunity";
import { fetchOpportunities, addOpportunity } from "../../api";


const OpportunitySection = () => {
  return (
    <div>
      <AddOpportunity />
      <OpportunityList />
    </div>
  );
};

export default OpportunitySection;
