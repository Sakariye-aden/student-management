import { Navigate, Outlet } from "react-router";
import useAuthStore from "../../lib/store/useStore";

const RoleProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // redirect to their own dashboard if they try another role’s route
    switch (user.role) {
      case "teacher":
        return <Navigate to="/teacher" replace />;
      case "student":
        return <Navigate to="/student" replace />;
      case "dean of student":
        return <Navigate to="/dean" replace />;
      case "vice principle":
        return <Navigate to="/vice-principal" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />; // render nested routes
};

export default RoleProtectedRoute;