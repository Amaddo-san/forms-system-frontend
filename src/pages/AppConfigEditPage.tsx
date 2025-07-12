import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AppConfig } from "../models/AppConfig";
import "./AppConfigCreatePage.css";

const AppConfigEditPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();

  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // 🔧 Replace this with real API call
    setConfig({
      id: 1,
      uuid: uuid || "",
      key: "sample.key",
      value: "sample value",
      createdAt: "2025-07-12",
      lastUpdatedAt: "2025-07-12",
    });
  }, [uuid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!config) return;
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = () => {
    // 🔧 Replace this with AppConfigService.update(config.key, config)
    alert("Saved successfully!");
    setIsEditable(false);
  };

  return (
    <>
      <Header username="Admin" />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div className="form-card">
          <h2 className="form-title">View Config</h2>

          <label>Key:</label>
          <input
            name="key"
            value={config?.key || ""}
            onChange={handleChange}
            disabled={!isEditable}
          />

          <label>Value:</label>
          <textarea
            name="value"
            value={config?.value || ""}
            onChange={handleChange}
            disabled={!isEditable}
          />

          {!isEditable ? (
            <button className="create-btn" onClick={handleEdit}>
              Edit
            </button>
          ) : (
            <button className="create-btn" onClick={handleSave}>
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AppConfigEditPage;
