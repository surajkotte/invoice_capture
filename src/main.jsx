import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { reactRouter } from "./App.jsx";
import { RouterProvider } from "react-router-dom";
//import { ThemeProvider } from "./utils/ThemeProvider";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <Sonner />
      <RouterProvider router={reactRouter} />
    </ThemeProvider>
  </StrictMode>
);
