
import React, { useState } from "react";

const AddClient = ({ onAdd }) => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: "", email: "", phone: "", address: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {["name", "email", "phone", "address"].map((field) => (
          <div className="col-md-3 mb-2" key={field}>
            <input
              type="text"
              className="form-control"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          </div>
        ))}
      </div>
      <button type="submit" className="btn btn-success">Add Client</button>
    </form>
  );
};

export default AddClient;
