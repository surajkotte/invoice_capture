import React, { useState, useRef, useEffect } from "react";
import {
  Grid3x3,
  Plus,
  User,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import useAuthHok from "./Hooks/useAuthHook";
import { useToast } from "./Hooks/useToastHook";
import { useAuth } from "../context/AuthContext";

const Menubar = ({ children }) => {
  const { isLoading, signOut } = useAuthHok();
  const { theme, setTheme } = useTheme(); // useTheme provides the current theme
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const currentPath = location.pathname;

  const menuItems = [
    {
      label: "Dashboard",
      key: "dashboard",
      path: "/dashboard",
      icon: Grid3x3,
    },
    {
      label: "Admin",
      key: "admin",
      path: "/admin",
      icon: Plus,
    },
    {
      label: "Upload",
      key: "upload",
      path: "/upload",
      icon: Upload,
    },
  ];

  const handleLogout = async () => {
    const response = await signOut();
    if (response?.messageType === "S") {
      logout();
      toast({
        title: "Logged out successfully",
        variant: "default",
      });
      navigate("/login", { state: { from: location }, replace: true });
    } else {
      toast({
        title: response?.message || "Logout failed",
        variant: "destructive",
      });
    }
    setShowUserMenu(false);
  };

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`h-screen min-w-screen flex flex-col`}>
      {/* <div
        className={`h-16 border-b shadow-md flex items-center gap-2 justify-center`}
      > */}
      <div
        className={`fixed top-0 left-0 right-0 h-16 border-b shadow-md flex items-center gap-2 justify-center z-50 bg-card`}
      >
        <div className="flex justify-start items-center">
          <span className="cursor-pointer ml-4 flex items-center font-bold text-lg">
            Invoice Capture
          </span>
        </div>
        <div className="flex justify-center gap-3 items-center flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link to={item.path} key={item.key + "Link"}>
                <Button
                  key={item.key}
                  variant={
                    currentPath === item.path ? "destructive" : "secondary"
                  }
                >
                  <IconComponent size={16} />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              flex items-center gap-2 p-3 rounded-md transition-all duration-200
              ${
                theme === "dark"
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            <User size={20} />
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>
          {showUserMenu && (
            <div
              className={`
                absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg border z-50
                ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }
              `}
            >
              <div className="py-1">
                <button
                  onClick={handleThemeToggle}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                    ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    console.log("Settings clicked");
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                    ${
                      theme === "dark"
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div
                  className={`my-1 border-t ${
                    theme === "dark" ? "border-gray-700" : "border-gray-200"
                  }`}
                />
                <button
                  onClick={handleLogout}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200
                    ${
                      theme === "dark"
                        ? "hover:bg-red-900 text-red-400 hover:text-red-300"
                        : "hover:bg-red-50 text-red-600 hover:text-red-700"
                    }
                  `}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`w-full h-full flex flex-col mt-16`}>{children}</div>
    </div>
  );
};

export default Menubar;
