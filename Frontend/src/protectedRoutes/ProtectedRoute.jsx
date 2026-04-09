import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Decode token to get role
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload));
    const role = decoded?.role;

    if (allowedRole && role !== allowedRole) {
      // Wrong role — redirect to correct dashboard
      if (role === 'admin') return <Navigate to="/dashboard" />;
      if (role === 'user') return <Navigate to="/userDashboard" />;
      return <Navigate to="/login" />;
    }

    return children;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;