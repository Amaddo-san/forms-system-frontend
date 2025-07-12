import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AppConfigService } from "../services/AppConfigService";
import { AppConfig } from "../models/AppConfig";
import "./AppConfigsPage.css";

const AppConfigsPage: React.FC = () => {
    const [configs, setConfigs] = useState<AppConfig[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AppConfigService.getAll()
            .then(setConfigs)
            .catch((err) => console.error("Failed to load configs", err))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = (id: number, field: "key" | "value", newValue: string) => {
        setConfigs(prev =>
            prev.map(config =>
                config.id === id ? { ...config, [field]: newValue } : config
            )
        );
    };

    const handleSave = async (config: AppConfig) => {
        try {
            const updated = await AppConfigService.updateConfig(config);
            setConfigs(prev =>
                prev.map(c => c.id === updated.id ? updated : c)
            );
            alert("Config updated!");
        } catch (error) {
            console.error("Failed to update config", error);
            alert("Failed to save. See console.");
        }
    };

    return (
        <div className="app-configs-container">
            <Sidebar />
            <div className="app-configs-content">
                <Header username="Admin" />
                <h2 className="page-title">App Configs</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="configs-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>UUID</th>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Created At</th>
                                <th>Last Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((config, index) => (
                                <tr key={config.id}>
                                    <td>{index + 1}</td>
                                    <td>{config.uuid}</td>
                                    <td>
                                        <input
                                            value={config.key}
                                            onChange={(e) =>
                                                handleUpdate(config.id, "key", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            value={config.value}
                                            onChange={(e) =>
                                                handleUpdate(config.id, "value", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>{config.createdAt}</td>
                                    <td>{config.lastUpdatedAt}</td>
                                    <td>
                                        <button
                                            className="save-btn"
                                            onClick={() => handleSave(config)}
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AppConfigsPage;
