import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const publicRoutes = ["/login", "/register"];

const ProtectedRoute = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return publicRoutes.includes(location.pathname) ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }
  return publicRoutes.includes(location.pathname) ? (
    <Navigate to="/dashboard" />
  ) : ( user.verified ? <Outlet /> : <Navigate to="/verify-email" />
  );
};

export default ProtectedRoute;
