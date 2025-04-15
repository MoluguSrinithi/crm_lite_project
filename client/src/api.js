
const BASE_URL = "http://localhost:5000"; // Adjust if your backend runs on a different port

export const fetchClients = async () => {
  const res = await fetch(`${BASE_URL}/clients`);
  return await res.json();
};

// ✅ Add this function to handle adding a client
export const addClient = async (client) => {
  const res = await fetch(`${BASE_URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });

  if (!res.ok) {
    throw new Error("Failed to add client");
  }

  return await res.json();
};

// Other existing exports
export const fetchLeads = async () => {
  const res = await fetch(`${BASE_URL}/leads`);
  return await res.json();
};

export const fetchNotes = async () => {
  const res = await fetch(`${BASE_URL}/notes`);
  return await res.json();
};

// TASKS
export const fetchTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  return await res.json();
};

export const addTask = async (task) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!res.ok) {
    throw new Error("Failed to add task");
  }

  return await res.json();
};

// OPPORTUNITIES
// export const fetchOpportunities = async () => {
//   const res = await fetch(`${BASE_URL}/opportunities`);
//   return await res.json();
// };

// export const addOpportunity = async (opportunity) => {
//   const res = await fetch(`${BASE_URL}/opportunities`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(opportunity),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to add opportunity");
//   }

//   return await res.json();
// };


