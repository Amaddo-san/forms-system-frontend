import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AppConfigService } from "../services/AppConfigService";
import "./AppConfigCreatePage.css";

const AppConfigCreatePage: React.FC = () => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AppConfigService.create({ key, value });
      alert("Configuration created successfully!");
      navigate("/app-configs");
    } catch (error) {
      console.error("Error creating config:", error);
      alert("Failed to create configuration.");
    }
  };

  return (
   <>
  <Header username="Admin" />
<div style={{  flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 80px)" }}>
    <Sidebar />
    <div style={{ marginLeft: "240px", flex: 1, padding: "24px" }}>
      <div className="config-create-card">
        <h2>Create New Config</h2>
        <form onSubmit={handleSubmit}>
          <label>Key:</label>
          <textarea
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
          />
          <label>Value:</label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <button type="submit" className="config-create-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</>

  );
};

export default AppConfigCreatePage;
