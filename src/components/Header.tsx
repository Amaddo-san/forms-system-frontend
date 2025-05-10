import React from "react";
import "./Header.css";
import logo from "../assets/uoj-logo.png";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  username: string;
};

const Header: React.FC<HeaderProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="custom-header">
      <div className="header-left">
        <i className="ri-user-line"></i>
        <span>@{username}</span>
      </div>
      <div className="header-center">
        <img src={logo} alt="logo" />
        <span>JU Activity Approval System</span>
      </div>
      <div className="header-right" onClick={handleLogout}>
        <i className="ri-logout-box-r-line"></i>
        <span>Logout</span>
      </div>
    </header>
  );
};

export default Header;
