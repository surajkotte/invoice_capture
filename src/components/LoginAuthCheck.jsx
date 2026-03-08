import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthCheck } from "../adapter/Login";
import { useAuth } from "../context/AuthContext";
import Spinner from "./ui/spinner";

const LoginAuthCheck = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null);
  //  const { authenticated } = useAuth();
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
    return <Spinner />;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  return children;
};

export default LoginAuthCheck;
