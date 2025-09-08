import { useState } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Menubar from "./components/MenuBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Admin from "./components/Admin/Admin";
import Login from "./components/Login/Login";
import AuthenticationCheck from "./components/AuthenticationCheck";
import LoginAuthCheck from "./components/LoginAuthCheck";
import SignUp from "./components/Login/SignUp";
import UploadFile from "./components/Upload/UploadFile";

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
        element: <Dashboard />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/upload",
        element: <UploadFile />,
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
