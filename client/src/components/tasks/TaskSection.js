
import React from "react";
import TaskList from "./TaskList";
import AddTask from "./AddTask";

const TaskSection = () => {
  return (
    <div className="task-section">
      <h1 className="section-title">Task Management</h1>
      <div className="task-container">
        <div className="card add-task-card">
          <AddTask />
        </div>
        <div className="card task-list-card">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default TaskSection;
