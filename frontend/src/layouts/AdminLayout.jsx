import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    document.body.classList.add("admin-page");

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarVisible(true);
      } else {
        setSidebarVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.classList.remove("admin-page");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarVisible(!sidebarVisible);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        isCollapsed={sidebarCollapsed}
        isVisible={sidebarVisible}
        onToggle={toggleSidebar}
      />

      <div
        className={`admin-main ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <AdminHeader onSidebarToggle={toggleSidebar} />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
