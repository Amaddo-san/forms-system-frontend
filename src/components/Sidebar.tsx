import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const role = user?.occupation?.toUpperCase();

const homePath = role !== "STUDENT" ? "/doctor-home" : "/home";


  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>JUAS</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to={homePath} className={location.pathname === homePath ? "active" : ""}>
          <i className="ri-home-line"></i> Home
        </Link>
        <Link to="/request-form" className={location.pathname === "/request-form" ? "active" : ""}>
          <i className="ri-file-add-line"></i> Request Form
        </Link>
        <Link to="/app-configs" className={location.pathname === "/app-configs" ? "active" : ""}>
          <i className="ri-settings-3-line"></i> App Configs
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
