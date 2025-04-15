
import React, { useEffect, useState } from "react";
import { fetchClients as fetchClientsFromApi, addClient as addClientApi } from "../../api";
import AddClient from "./AddClient";

const ClientSection = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [viewMode, setViewMode] = useState("grid"); // grid or list view

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const data = await fetchClientsFromApi();
    setClients(data);
  };

  const handleAddClient = async (newClient) => {
    await addClientApi(newClient);
    getClients(); // refresh client list
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address
    });
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  const handleEditChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/clients/${editingClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to update client");
      
      // Update local state
      setClients(clients.map(client => 
        client.id === editingClient.id ? {...client, ...formData} : client
      ));
      
      // Reset editing state
      setEditingClient(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update client");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/clients/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete client");
      
      // Update local state
      setClients(clients.filter(client => client.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete client");
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Dashboard Header */}
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h1 className="display-4 fw-bold text-primary">Client Manager</h1>
              <p className="lead text-muted">Manage your clients with ease</p>
            </div>
            <div className="d-flex align-items-center">
              <div className="bg-white p-2 rounded-pill shadow-sm">
                <span className="badge bg-primary rounded-pill px-3 py-2">
                  <i className="bi bi-people-fill me-1"></i> {clients.length} Clients
                </span>
              </div>
            </div>
          </div>

          {/* Add Client Section */}
          <div className="card mb-5 shadow border-0 rounded-3 overflow-hidden">
            <div className="card-header bg-gradient-primary-to-secondary text-white p-3">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  <i className="bi bi-person-plus-fill me-2"></i> Add New Client
                </h3>
                <span className="badge bg-white text-primary">Step 1</span>
              </div>
            </div>
            <div className="card-body p-4 bg-white">
              <AddClient onAdd={handleAddClient} />
            </div>
          </div>

          {/* Edit Client Form (Conditional) */}
          {editingClient && (
            <div className="card mb-5 shadow border-0 rounded-3 animate__animated animate__fadeIn">
              <div className="card-header bg-gradient-warning-to-danger p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0 text-white">
                    <i className="bi bi-pencil-square me-2"></i> Edit Client
                  </h3>
                  <button className="btn btn-sm btn-outline-light" onClick={handleCancelEdit}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
              <div className="card-body p-4 bg-white">
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    {["name", "email", "phone", "address"].map((field) => (
                      <div className="col-md-3 mb-3" key={field}>
                        <label className="form-label text-muted small">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-pill border-0 shadow-sm"
                          name={field}
                          value={formData[field]}
                          onChange={handleEditChange}
                          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-end">
                    <button type="button" className="btn btn-light rounded-pill me-2" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success rounded-pill px-4">
                      <i className="bi bi-check-lg me-1"></i> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Client List Section */}
          <div className="card shadow border-0 rounded-3 overflow-hidden">
            <div className="card-header bg-dark text-white p-3">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 text-white">
                  <i className="bi bi-people me-2"></i> Client Directory
                </h3>
                <div className="d-flex align-items-center">
                  <div className="input-group me-3">
                    <span className="input-group-text bg-transparent border-0">
                      <i className="bi bi-search text-white"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark border-0 text-white"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="btn-group">
                    <button 
                      className={`btn btn-sm ${viewMode === 'grid' ? 'btn-light' : 'btn-outline-light'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <i className="bi bi-grid-3x3-gap-fill"></i>
                    </button>
                    <button 
                      className={`btn btn-sm ${viewMode === 'list' ? 'btn-light' : 'btn-outline-light'}`}
                      onClick={() => setViewMode('list')}
                    >
                      <i className="bi bi-list-ul"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-4 bg-white">
              {filteredClients.length === 0 ? (
                <div className="text-center p-5">
                  <i className="bi bi-search display-1 text-muted"></i>
                  <h4 className="mt-3">No clients found</h4>
                  <p className="text-muted">Try adjusting your search criteria</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="row g-4">
                  {filteredClients.map((client) => (
                    <div className="col-md-4 mb-4" key={client.id}>
                      <div className="card h-100 border-0 shadow-sm hover-shadow rounded-3 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-primary-light opacity-10"></div>
                        <div className="card-header bg-transparent border-bottom-0 pt-3 pb-0">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0 text-primary">{client.name}</h5>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-light rounded-circle" data-bs-toggle="dropdown">
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                  <button 
                                    className="dropdown-item" 
                                    onClick={() => handleEditClick(client)}
                                  >
                                    <i className="bi bi-pencil text-primary me-2"></i> Edit
                                  </button>
                                </li>
                                <li>
                                  <button 
                                    className="dropdown-item" 
                                    onClick={() => handleDelete(client.id)}
                                  >
                                    <i className="bi bi-trash text-danger me-2"></i> Delete
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="card-body pt-0">
                          <div className="client-details">
                            <p className="card-text mb-2">
                              <span className="badge bg-light text-dark rounded-pill me-2">
                                <i className="bi bi-envelope text-primary"></i>
                              </span>
                              {client.email}
                            </p>
                            <p className="card-text mb-2">
                              <span className="badge bg-light text-dark rounded-pill me-2">
                                <i className="bi bi-telephone text-success"></i>
                              </span>
                              {client.phone}
                            </p>
                            <p className="card-text mb-0">
                              <span className="badge bg-light text-dark rounded-pill me-2">
                                <i className="bi bi-geo-alt text-danger"></i>
                              </span>
                              {client.address}
                            </p>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent border-top-0 d-flex justify-content-between">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => handleEditClick(client)}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDelete(client.id)}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClients.map((client) => (
                        <tr key={client.id}>
                          <td className="fw-bold">{client.name}</td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                          <td>{client.address}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-outline-primary me-2" 
                              onClick={() => handleEditClick(client)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger" 
                              onClick={() => handleDelete(client.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="card-footer bg-light p-3">
              <nav>
                <ul className="pagination pagination-sm justify-content-end mb-0">
                  <li className="page-item disabled"><a className="page-link" href="#">Previous</a></li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item"><a className="page-link" href="#">Next</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSection;