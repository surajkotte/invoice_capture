import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { reactRouter } from "./App.jsx";
import { RouterProvider } from "react-router-dom";
//import { ThemeProvider } from "./utils/ThemeProvider";
import { ThemeProvider } from "next-themes";
createRoot(document.getElementById("root")).render(
  <StrictMode>
   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={reactRouter} />
    </ThemeProvider>
  </StrictMode>
);
