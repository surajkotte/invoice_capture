import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthCheck } from "../adapter/Login";

const LoginAuthCheck = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);
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

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (authenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default LoginAuthCheck;
