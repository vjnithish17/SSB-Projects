import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Authentication checking
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role checking
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    // Admin
    if (user.role === "admin") {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    // Technician
    if (user.role === "technician") {
      return (
        <Navigate
          to="/technician/dashboard"
          replace
        />
      );
    }

    // Customer
    return (
      <Navigate
        to="/customer/dashboard"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
