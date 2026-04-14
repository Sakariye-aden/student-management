import { Navigate } from "react-router";
import useAuthStore from "../../lib/store/useStore";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated , user} = useAuthStore();

  if (isAuthenticated && user ) {

      const roleRoutes: Record<string, string> = {
          principle: "/principal",
          "vice principle": "/vice-principal",
          "dean of students": "/dean",
          teacher: "/teacher",
          student: "/student",
        };

        const route = roleRoutes[user.role.toLowerCase()];
        if (route) {
           return <Navigate to={route} replace />;
        } 
  }

  

  return children;
};

export default PublicRoute;