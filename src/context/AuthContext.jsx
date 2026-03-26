// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { AuthCheck } from "../adapter/Login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null); // null = unknown
  const [user, setUser] = useState(null);
  //  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await AuthCheck();
        if (res?.messageType === "S") {
          setAuthenticated(true);
          // setUser(res.user); // optional if backend returns user
        } else {
          setAuthenticated(false);
        }
      } catch {
        setAuthenticated(false);
      }
    };
    init();
  }, []);
  useEffect(() => {
    const storedUser = sessionStorage.getItem("app_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("app_user", JSON.stringify(userData));
  };
  const hasPermission = (permissionKey) => {
    if (!user || !user.permissions) return false;
    return user.permissions[permissionKey] === "X";
  };
  const logout = () => {
    setAuthenticated(false);
    setUser(null);
    sessionStorage.removeItem("app_user");
    //setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, logout, login, hasPermission, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
