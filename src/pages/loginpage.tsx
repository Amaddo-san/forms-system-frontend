import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Username:", username);
  console.log("Password:", password);

  // Set fake role based on the username
  if (username.startsWith("dr.")) {
    localStorage.setItem("userRole", "doctor");
  } else {
    localStorage.setItem("userRole", "student");
  }

  navigate("/home");
};


  return (
    <div className="login-background">
      <div className="login-header">
  <img src={require("../assets/uoj-logo.png")} alt="logo" className="logo" />
  <span className="site-name">JU Activity <br />Approval System</span>
</div>

      <div className="login-card">
        <h2>Sign In</h2>
        <p>Please enter your email and password to continue.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="ri-user-line"></i>
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <i className="ri-lock-2-line"></i>
            <input
               type={showPassword ? "text" : "password"}
               placeholder="password"
               value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
              <i
                 className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
               ></i>

          </div>
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
