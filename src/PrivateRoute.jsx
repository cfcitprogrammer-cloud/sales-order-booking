import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "./stores/authStore";

const PrivateRoute = ({ children, requireRole = false }) => {
  const { user, role, loading } = useAuthStore();
  const location = useLocation(); // store attempted path

  if (loading) return null; // or a spinner

  if (!user) {
    // Not logged in → redirect to login with original path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireRole && (!role || role === null)) {
    console.log("ROLE MISSING");
    return <Navigate to="/verify" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
