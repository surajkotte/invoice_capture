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
  ChartArea,
  FileUser,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthHok from "./Hooks/useAuthHook";
import { useToast } from "./Hooks/useToastHook";
import { useAuth } from "../context/AuthContext";
import SettingsModal from "./SettingsModel";
const Menubar = ({ children }) => {
  const { isLoading, signOut } = useAuthHok();
  const { theme, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const userMenuRef = useRef(null);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, hasPermission } = useAuth();
  const currentPath = location.pathname;

  const menuItems = [
    { label: "Dashboard", key: "dashboard", path: "/dashboard", icon: Grid3x3 },
    {
      label: "Configuration",
      key: "configuration",
      path: "/admin",
      icon: Plus,
    },
    { label: "Upload", key: "upload", path: "/upload", icon: Upload },
    {
      label: "Analytics",
      key: "analytics",
      path: "/analytics",
      icon: ChartArea,
    },
    {
      label: "User Management",
      key: "usermanagement",
      path: "/usermanagement",
      icon: FileUser,
    },
    {
      label: "Queues",
      key: "getqueue",
      path: "/queues",
      icon: FileUser,
    }
  ];
  const authorizedMenuItems = menuItems.filter((item) =>
    hasPermission(item.key),
  );
  const handleLogout = async () => {
    const response = await signOut();
    if (response?.messageType === "S") {
      sessionStorage.clear();
      sessionStorage.removeItem("language");
      sessionStorage.removeItem("dateformat");
      sessionStorage.removeItem("currency");
      sessionStorage.removeItem("theme");
      logout();
      toast({ title: "Logged out successfully", variant: "default" });
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
    const savedTheme = sessionStorage.getItem("theme");
    if (savedTheme) {
      // If your storage uses "1" for light and "2" for dark:
      setTheme(savedTheme === "1" ? "light" : "dark");
    }
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setTheme]);

  return (
    <div className="h-screen min-w-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-border shadow-sm flex items-center gap-2 justify-center z-50 bg-background text-foreground">
        <div className="flex justify-start items-center">
          <span className="cursor-pointer ml-4 flex items-center font-bold text-lg">
            Invoice Capture
          </span>
        </div>

        {/* <div className="flex justify-center gap-3 items-center flex-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link to={item.path} key={item.key + "Link"}>
                <Button
                  key={item.key}
                  variant={currentPath === item.path ? "default" : "ghost"}
                >
                  <IconComponent size={16} className="mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div> */}
        <div className="flex justify-center gap-3 items-center flex-1">
          {authorizedMenuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link to={item.path} key={item.key + "Link"}>
                <Button
                  key={item.key}
                  variant={currentPath === item.path ? "default" : "ghost"}
                >
                  <IconComponent size={16} className="mr-2" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="relative mr-4" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-md transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
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
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-md border border-border bg-popover text-popover-foreground z-50 overflow-hidden">
              <div className="py-1">
                {/* <button
                  onClick={handleThemeToggle}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button> */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowSettings(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="my-1 border-t border-border" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 text-destructive hover:bg-destructive/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      <div className="w-full h-full flex flex-col mt-16 bg-background">
        {children}
      </div>
    </div>
  );
};

export default Menubar;
