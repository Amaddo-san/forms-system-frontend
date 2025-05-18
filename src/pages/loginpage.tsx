import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Store token & user
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Let HomeRedirector handle routing logic
      navigate("/");

    } catch (error) {
      console.error("Login error:", error);
      alert("فشل تسجيل الدخول. يرجى التحقق من المعلومات.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="hero-bg"></div>

      <div className="login-header">
        <img src={require("../assets/uoj-logo.png")} alt="logo" className="logo" />
        <span className="site--name">JU Activity System</span>
      </div>

      <div className="login-card">
        <h2>Sign In</h2>
        <p>Please enter your username and password</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="ri-user-line"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <i className="ri-lock-line"></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
