import { useState } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Menubar from "./components/MenuBar";
import Dashboard from "./components/Dashboard/Dashboard";
import Admin from "./components/Admin/Admin";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-w-screen min-h-screen">
      <Menubar>
        <Outlet />
      </Menubar>
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
    ],
  },
]);
