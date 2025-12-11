import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "./stores/authStore";

// PrivateRoute component checks if the user is authenticated
const PrivateRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute;
