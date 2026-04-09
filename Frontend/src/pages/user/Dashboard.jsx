import React, { useEffect, useState } from 'react';
import { API_URL } from '../../api';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  'done': 'bg-green-100 text-green-700',
};

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // null = add, object = edit
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');
  const [taskSaving, setTaskSaving] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch users
  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${API_URL}/user/userList`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('Failed to fetch users'); return res.json(); })
      .then(data => { setUsers(Array.isArray(data.data) ? data.data : []); setLoadingUsers(false); })
      .catch(err => { setError(err.message); setLoadingUsers(false); });
  }, [navigate, token]);

  // Fetch tasks
  const fetchTasks = () => {
    fetch(`${API_URL}/task/myTasks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => { if (!res.ok) throw new Error('Failed to fetch tasks'); return res.json(); })
      .then(data => { setTasks(Array.isArray(data.data) ? data.data : []); setLoadingTasks(false); })
      .catch(err => { setError(err.message); setLoadingTasks(false); });
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Open form for Add
  const openAddTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskStatus('todo');
    setShowTaskForm(true);
  };

  // Open form for Edit
  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setShowTaskForm(true);
  };

  // Submit Add or Edit
  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskSaving(true);
    const isEditing = !!editingTask;
    const url = isEditing
      ? `${API_URL}/task/updateTask/${editingTask._id}`
      : `${API_URL}/task/addTask`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle, description: taskDescription, status: taskStatus }),
      });
      if (!res.ok) throw new Error('Failed to save task');
      setShowTaskForm(false);
      fetchTasks(); // refresh task list
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskSaving(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/task/deleteTask/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-4">
          
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* ── TASKS SECTION ── */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Tasks</h2>
          <button onClick={openAddTask} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">
            + Add Task
          </button>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'Add Task'}</h2>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-semibold">Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={e => setTaskTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Description</label>
                  <textarea
                    value={taskDescription}
                    onChange={e => setTaskDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-semibold">Status</label>
                  <select
                    value={taskStatus}
                    onChange={e => setTaskStatus(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button type="submit" disabled={taskSaving}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    {taskSaving ? 'Saving...' : editingTask ? 'Update Task' : 'Add Task'}
                  </button>
                  <button type="button" onClick={() => setShowTaskForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Task List */}
        {loadingTasks ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Click "+ Add Task" to create one.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <div key={task._id} className="bg-white border border-gray-200 rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{task.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[task.status]}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                <div className="flex space-x-2">
                  <button onClick={() => openEditTask(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default Dashboard;