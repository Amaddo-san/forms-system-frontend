import React, { useState } from "react";
import "./Header.css";
import logo from "../assets/uoj-logo.png";
import { logout } from "../services/LogoutService";

type Props = {
  username: string;
};

const DrHeader: React.FC<Props> = ({ username }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="UJ Logo" className="logo" />
        <span className="site-name">JU Activity System</span>
        <span className="site-name-mobile">JUAS</span>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <span>
          <i className="ri-user-line"></i> @{username}
        </span>
        <button className="logout-link" onClick={logout}>
          <i className="ri-logout-box-line"></i> Logout
        </button>
      </nav>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <i className="ri-menu-line"></i>
      </button>
    </header>
  );
};

export default DrHeader;
