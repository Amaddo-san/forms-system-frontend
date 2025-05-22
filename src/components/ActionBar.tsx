import React from "react";
import AvailableActions from "./AvailableActions";
import "./ActionBar.css";

interface WorkflowActionResource {
    name: string;
    href: string;
    action: string;
}

interface ActionBarProps {
    title?: string;
    actions: WorkflowActionResource[];
    currentStatus: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ title, actions, currentStatus }) => {
    if (!actions || actions.length === 0) return null;

    return (
        <div className="action-bar-container">
            {title && <h3 className="action-bar-title">{title}</h3>}
            <div className="action-bar-actions">
                <AvailableActions
                    actions={actions}
                    currentStatus={currentStatus}
                />
            </div>
        </div>
    );
};

export default ActionBar;
