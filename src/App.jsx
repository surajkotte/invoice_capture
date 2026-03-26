import { useState } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Menubar from "./components/MenuBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login/Login";
import AuthenticationCheck from "./components/AuthenticationCheck";
import Analytics from "./components/Analytics/Analytics";
import LoginAuthCheck from "./components/LoginAuthCheck";
import SignUp from "./components/Login/SignUp";
import UploadFile from "./components/Upload/UploadFile";
import UserManagement from "./components/Administration/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-w-screen min-h-screen">
      <AuthenticationCheck>
        <Menubar>
          <Outlet />
        </Menubar>
      </AuthenticationCheck>
    </div>
  );
}

export const reactRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute requiredPermission="dashboard">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute requiredPermission="configuration">
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "/upload",
        element: (
          <ProtectedRoute requiredPermission="upload">
            <UploadFile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/analytics",
        element: (
          <ProtectedRoute requiredPermission="analytics">
            <Analytics />
          </ProtectedRoute>
        ),
      },
      {
        path: "/usermanagement",
        element: (
          <ProtectedRoute requiredPermission="usermanagement">
            <UserManagement />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/Login",
    element: (
      <LoginAuthCheck>
        <Login />
      </LoginAuthCheck>
    ),
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
]);
