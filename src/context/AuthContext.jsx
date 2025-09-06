// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { AuthCheck } from "../adapter/Login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(null); // null = unknown
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

  const logout = () => {
    setAuthenticated(false);
    //setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
