import React, { useState, useEffect } from "react";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClients = async (page = 1, query = "") => {
    const response = await fetch(`http://localhost:5000/clients?page=${page}&query=${query}`);
    const data = await response.json();
    setClients(data);

    const countResponse = await fetch(`http://localhost:5000/clients/count?query=${query}`);
    const countData = await countResponse.json();
    setTotalPages(Math.ceil(countData.count / 10));
  };

  useEffect(() => {
    fetchClients(currentPage, searchQuery);
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchClients(1, searchQuery);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      alert("Client deleted successfully");
      fetchClients(currentPage, searchQuery);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (client) => {
    const newName = prompt("Enter new name", client.name);
    const newEmail = prompt("Enter new email", client.email);
    const newPhone = prompt("Enter new phone", client.phone);
    const newAddress = prompt("Enter new address", client.address);

    if (newName && newEmail && newPhone && newAddress) {
      fetch(`http://localhost:5000/clients/${client.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          address: newAddress,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update");
          alert("Client updated successfully");
          fetchClients(currentPage, searchQuery);
        })
        .catch((err) => console.error("Update error:", err));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h2>Client List</h2>
      <input
        type="text"
        placeholder="Search clients..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <button onClick={handleSearchSubmit}>Search</button>

      {clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <p>Name: {client.name}</p>
              <p>Email: {client.email}</p>
              <p>Phone: {client.phone}</p>
              <p>Address: {client.address}</p>
              <button onClick={() => handleEdit(client)}>Edit</button>
              <button onClick={() => handleDelete(client.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientList;