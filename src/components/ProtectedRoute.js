import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

const ProtectedRoute = ({ children, requireDealer = false }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace state={{ loginRequired: true }} />;
  }

  if (requireDealer && !["dealer", "seller", "admin"].includes(getUser()?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
