import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";
import logo from "../assets/uoj-logo.png";

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

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("فشل تسجيل الدخول. يرجى التحقق من المعلومات.");
    }
  };

  return (
    <>
      <div id="back">
        {/* Left Section */}
        <div className="left-section">
          <div className="left-bg-blur" />
          <div className="left-overlay-content">
            <img src={logo} alt="JU Logo" className="ju-logo" />
            <h1 className="site-title">
              <span className="desktop-title">JU Activity System</span>
              <span className="mobile-title">JUAS</span>
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="backRight" />
        <div id="slideBox">
          <div className="topLayer">
            <div className="right">
              <div className="content">
                <p className="welcome-quote">
                  Welcome to JUAS – your gateway to seamless activity booking and approval
                </p>
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-element form-stack input-icon-group">
                    <label htmlFor="username-login" className="form-label">Email</label>
                    <div className="input-wrapper">
                      <i className="ri-user-line"></i>
                      <input
                        id="username-login"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-element form-stack input-icon-group">
                    <label htmlFor="password-login" className="form-label">Password</label>
                    <div className="input-wrapper">
                      <i className="ri-lock-line"></i>
                      <input
                        id="password-login"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <i
                        className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", marginLeft: "auto" }}
                      />
                    </div>
                  </div>

                  <div className="form-element form-submit">
                    <button type="submit" className="login">Log In</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
