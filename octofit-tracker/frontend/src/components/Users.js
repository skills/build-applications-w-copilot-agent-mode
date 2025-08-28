import React, { useEffect, useState } from 'react';

const initialForm = { username: '', email: '' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);
  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  useEffect(() => {
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
      });
  }, [apiUrl]);

  const handleShow = () => {
    setEditId(null);
    setForm(initialForm);
    setShowModal(true);
  };
  const handleEditShow = (user) => {
    setEditId(user.id);
    setForm({ username: user.username, email: user.email });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    if (editId) {
      fetch(`${apiUrl}${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(updated => {
          setUsers(users.map(u => u.id === editId ? updated : u));
          setSubmitting(false);
          handleClose();
        })
        .catch(() => setSubmitting(false));
    } else {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
        .then(res => res.json())
        .then(newUser => {
          setUsers([newUser, ...users]);
          setSubmitting(false);
          handleClose();
        })
        .catch(() => setSubmitting(false));
    }
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="card-title text-warning mb-0">Users</h2>
          <button className="btn btn-warning text-white" onClick={handleShow}>
            <i className="bi bi-plus-circle"></i> Add User
          </button>
        </div>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEditShow(user)}>
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {showModal && (
          <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editId ? 'Edit User' : 'Add User'}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input type="text" className="form-control" name="username" value={form.username} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                    <button type="submit" className="btn btn-warning text-white" disabled={submitting}>
                      {submitting ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add User')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
