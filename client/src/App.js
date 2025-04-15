
import React, { useState } from "react";
import ClientSection from "./components/clients/ClientSection";
import LeadSection from "./components/leads/LeadSection";
import TaskSection from "./components/tasks/TaskSection";
// import OpportunitySection from "./components/opportunities/OpportunitySection";
import "./App.css";

const App = () => {
  const [activeSection, setActiveSection] = useState("Clients");

  const renderSection = () => {
    switch (activeSection) {
      case "Clients":
        return <ClientSection />;
      case "Leads":
        return <LeadSection />;
      case "Tasks":
        return <TaskSection />;
      // case "Opportunities":
      //   return <OpportunitySection />;
      default:
        return <ClientSection />;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
          <div className="position-sticky">
            <h2 className="text-center py-3">CRM Lite</h2>
            <ul className="nav flex-column">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  onClick={() => setActiveSection("Clients")}
                >
                  Clients
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setActiveSection("Leads")}
                >
                  Leads
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setActiveSection("Tasks")}
                >
                  Tasks
                </button>
              </li>
              {/* <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => setActiveSection("Opportunities")}
                >
                  Opportunities
                </button>
              </li> */}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h2">{activeSection}</h1>
          </div>
          <hr />
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default App;
