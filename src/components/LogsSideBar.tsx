import React from "react";
import "./LogsSidebar.css";

interface LogEntry {
    fromStatus: string;
    toStatus: string;
    action: string;
    performedBy: string;
    performedByRole: string;
    timestamp: string;
}

interface LogsSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    logs: LogEntry[];
}

const LogsSidebar: React.FC<LogsSidebarProps> = ({ isOpen, onClose, logs }) => {
    return (
        <div className={`logs-sidebar ${isOpen ? "open" : ""}`}>
            <div className="logs-header">
                <h3>سجل القرارات</h3>
                <button onClick={onClose}>✕</button>
            </div>
            <div className="logs-content">
                {logs.map((log, index) => (
                    <div key={index} className="log-entry">
                        <div>من: <strong>{log.fromStatus}</strong></div>
                        <div>إلى: <strong>{log.toStatus}</strong></div>
                        <div>العملية: {log.action}</div>
                        <div>بواسطة: {log.performedBy} ({log.performedByRole})</div>
                        <div className="log-time">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogsSidebar;
