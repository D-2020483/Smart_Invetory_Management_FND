import React, { useState, useEffect } from "react";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/store/slices/themeSlice";
import { logout, restoreSession } from "@/store/slices/authSlice";
import { Toaster } from "@/components/ui/sonner";
import SignIn from "@/pages/auth/Sign_in.page";
import SignUp from "@/pages/auth/Sign_up.page";
import Dashboard from "@/pages/dashboard/dashboard";
import SettingsManagement from "./settings/settings";
import InventoryList from "./inventory/inventoryList";

function Homepage() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [authMode, setAuthMode] = useState("signin");
  const [activeView, setActiveView] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply dark/light mode to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  //load the saved theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  //save the theme to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);

  // logout handler
  const handleLogout = () => {
    dispatch(logout());
    setActiveView("dashboard");
  };

  // restore session
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // renders the different pages based on the activeView
  const renderMainContent = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryList />;
      case "settings":
        return <SettingsManagement />;
      default:
        return <Dashboard />;
    }
  };

  // if user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {authMode === "signin" ? (
          <SignIn onToggleMode={() => setAuthMode("signup")} />
        ) : (
          <SignUp onToggleMode={() => setAuthMode("signin")} />
        )}
        <Toaster />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar section */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content section */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">{renderMainContent()}</main>
      </div>

      <Toaster />
    </div>
  );
}

export default Homepage;
