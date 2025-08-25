import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthCheck } from "../adapter/Login";

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
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setAuthenticated(false);
      }
    };

    checkIsAuthenticated();
  }, [location.pathname]);

  // While checking, don't redirect yet
  if (authenticated === null) {
    return <div>Loading...</div>; // or a spinner component
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthenticationCheck;
