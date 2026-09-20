import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

const PublicOnlyRoute = ({ children }) => {
  if (isLoggedIn()) {
    const user = getUser();
    return <Navigate to={["dealer", "seller", "admin"].includes(user?.role) ? "/admin" : "/"} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
