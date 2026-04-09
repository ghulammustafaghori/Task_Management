import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch existing user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/users/getSingleUser/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(data => {
        setUsername(data.data.username);
        setEmail(data.data.email);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/users/updateUser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      if (!res.ok) throw new Error('Failed to update user');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div className="p-6">Loading user...</div>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {saving ? 'Saving...' : 'Update User'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;