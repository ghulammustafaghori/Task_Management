import React, { useEffect, useState } from "react";
import { API_URL } from "../../api";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const STATUS_COLORS = {
  todo: "bg-gray-100 text-gray-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};
const PRIORITY_COLORS = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-purple-100 text-purple-700",
  high: "bg-red-100 text-red-700",
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskSaving, setTaskSaving] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all"); // <-- filter

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user info
  const userId = user?._id;

  const [socket, setSocket] = useState(null);

  // Initialize Socket.io
  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [token]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks/myTasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [navigate, token]);

  // Real-time Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("task-created", (task) => {
      if (task.userId === userId) setTasks((prev) => [task, ...prev]);
    });

    socket.on("task-updated", (updatedTask) => {
      if (updatedTask.userId === userId) {
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
        );
      }
    });

    socket.on("task-deleted", (deletedTaskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId));
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, [socket, userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openAddTask = () => {
    setEditingTask(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskStatus("todo");
    setTaskPriority("medium");
    setShowTaskForm(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskSaving(true);
    const isEditing = !!editingTask;
    const url = isEditing
      ? `${API_URL}/api/tasks/updateTask/${editingTask._id}`
      : `${API_URL}/api/tasks/addTask`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          priority: taskPriority,
        }),
      });
      if (!res.ok) throw new Error("Failed to save task");
      setShowTaskForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks/deleteTask/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter tasks based on filterStatus
  const filteredTasks =
    filterStatus === "all"
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  return (
    <div className="p-6">
      {/* Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="font-semibold">Hello, {user?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Filter & Add Task */}
      <div className="mb-6 flex justify-between items-center">
        <div className="space-x-2">
          <span
            className={`cursor-pointer px-3 py-1 rounded-full ${
              filterStatus === "all" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilterStatus("all")}
          >
            All
          </span>
          <span
            className={`cursor-pointer px-3 py-1 rounded-full ${
              filterStatus === "todo"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setFilterStatus("todo")}
          >
            Pending
          </span>
          <span
            className={`cursor-pointer px-3 py-1 rounded-full ${
              filterStatus === "in-progress"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
            onClick={() => setFilterStatus("in-progress")}
          >
            In-Progress
          </span>
          <span
            className={`cursor-pointer px-3 py-1 rounded-full ${
              filterStatus === "done" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
            onClick={() => setFilterStatus("done")}
          >
            Done
          </span>
        </div>

        <button
          onClick={openAddTask}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
        >
          + Add Task
        </button>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <form onSubmit={handleTaskSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description</label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Status</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold">Priority</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={taskSaving}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {taskSaving
                    ? "Saving..."
                    : editingTask
                    ? "Update Task"
                    : "Add Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
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
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500">
          No tasks found for selected filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white border border-gray-200 rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className="flex">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      STATUS_COLORS[task.status]
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 ml-2 rounded-full ${
                      PRIORITY_COLORS[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEditTask(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;