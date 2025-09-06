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
  if (authenticated === null) {
    return <div>Loading...</div>; // or a spinner component
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
//   console.log(authenticated);
//   if (authenticated === null) return <div>Loading...</div>;
//   if (!authenticated)
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   return children;
// };

// export default AuthenticationCheck;
