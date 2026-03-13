import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthCheck } from "../adapter/Login";
import Spinner from "./ui/spinner";

const AuthenticationCheck = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null); // null = not checked yet
  const location = useLocation();

  useEffect(() => {
    const checkIsAuthenticated = async () => {
      try {
        const response = await AuthCheck();
        if (response?.messageType === "S") {
          setAuthenticated(true);
        } else {
          sessionStorage.removeItem("csrfToken"); 
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        sessionStorage.removeItem("csrfToken"); 
        setAuthenticated(false);
      }
    };

    checkIsAuthenticated();
  }, [location.pathname]);
  if (authenticated === null) {
    return <Spinner />;
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthenticationCheck;

// AuthenticationCheck.jsx
// import { Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const AuthenticationCheck = ({ children }) => {
//   const { authenticated } = useAuth();
//   const location = useLocation();
//   
//   if (authenticated === null) return <div>Loading...</div>;
//   if (!authenticated)
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   return children;
// };

// export default AuthenticationCheck;
