import axios from "axios";
import "./AvailableActions.css";

interface WorkflowActionResource {
    name: string;
    href: string;
    action: string;
}

interface Props {
    actions: WorkflowActionResource[];
    currentStatus: string;
}

const BASE_URL = "http://localhost:8081";

// ✅ Updated: each status can be handled by multiple roles
const statusToRoleMap: Record<string, string[]> = {
    NEW: ["STUDENT"],
    MODIFICATION: ["STUDENT"],

    PENDING_SUPERVISOR_REVIEW: ["PROFESSOR"],
    SUPERVISOR_APPROVED: ["PROFESSOR"],
    SUPERVISOR_REJECTED: ["PROFESSOR"],

    PENDING_FACULTY_REVIEW: ["FACULTY_ASSISTANT_DEAN", "FACULTY_DEAN"],
    FACULTY_REVIEWED: ["FACULTY_ASSISTANT_DEAN", "FACULTY_DEAN"],
    FACULTY_APPROVED: ["FACULTY_DEAN", "FACULTY_ASSISTANT_DEAN"],
    FACULTY_REJECTED: ["FACULTY_DEAN", "FACULTY_ASSISTANT_DEAN"],

    PENDING_UNION_REVIEW: ["MANAGER", "PRESIDENT"],
    UNION_REVIEWED: ["MANAGER", "PRESIDENT"],

    INVESTMENT_CENTER_REVIEW: ["MANAGER", "PRESIDENT"],
    INVESTMENT_CENTER_APPROVED: ["MANAGER", "PRESIDENT"],
    INVESTMENT_CENTER_REJECTED: ["MANAGER", "PRESIDENT"],

    PENDING_DEANSHIP_REVIEW: ["DEAN", "ASSISTANT_DEAN"],
    DEANSHIP_APPROVED: ["DEAN", "ASSISTANT_DEAN"],
    DEANSHIP_REJECTED: ["DEAN", "ASSISTANT_DEAN"],

    RECEIVED: ["ADMIN"],
    APPROVED: [
        "STUDENT",
        "PROFESSOR",
        "FACULTY_ASSISTANT_DEAN",
        "FACULTY_DEAN",
        "MANAGER",
        "PRESIDENT",
        "DEAN",
        "ASSISTANT_DEAN",
        "ADMIN"
    ],
    REJECTED: [
        "STUDENT",
        "PROFESSOR",
        "FACULTY_ASSISTANT_DEAN",
        "FACULTY_DEAN",
        "MANAGER",
        "PRESIDENT",
        "DEAN",
        "ASSISTANT_DEAN",
        "ADMIN"
    ]
};

const AvailableActions: React.FC<Props> = ({ actions, currentStatus }) => {
    if (!actions || actions.length === 0) return null;

    const userRole = localStorage.getItem("userRole")?.toUpperCase();

    // ✅ Filter based on status + role
    const filteredActions = actions.filter(action => {
        const allowedRoles = statusToRoleMap[currentStatus];

        // Special case: STUDENT can submit only from NEW
        if (userRole === "STUDENT" && currentStatus === "NEW") {
            return action.action === "APPROVE";
        }

        return allowedRoles?.includes(userRole || "") ?? false;
    });

    const handleClick = async (href: string) => {
        try {
            await axios.post(`${BASE_URL}${href}`);
            window.location.reload();
        } catch (error) {
            console.error("Action failed:", error);
            alert("فشل تنفيذ العملية. الرجاء المحاولة لاحقاً.");
        }
    };

    const approveActions = filteredActions.filter(a => a.action.toLowerCase() === "approve");
    const otherActions = filteredActions.filter(a => a.action.toLowerCase() !== "approve");

    return (
        <div className="actions-bar">
            {otherActions.map((action, index) => (
                <button
                    key={index}
                    className={`action-tag ${action.action.toLowerCase()}`}
                    title={action.href}
                    onClick={() => handleClick(action.href)}
                >
                    {action.name}
                </button>
            ))}

            {approveActions.length > 0 && <div className="action-spacer" />}

            {approveActions.map((action, index) => (
                <button
                    key={`approve-${index}`}
                    className={`action-tag ${action.action.toLowerCase()}`}
                    title={action.href}
                    onClick={() => handleClick(action.href)}
                >
                    {action.name}
                </button>
            ))}
        </div>
    );
};

export default AvailableActions;
