// src/components/AvailableActions.tsx

import React, { useState } from "react";
import instance from "../config/AxiosConfig";
import { RejectWithReasonModal } from "./RejectWithReasonModal";
import "./AvailableActions.css";

interface WorkflowActionResource {
    name: string;   // e.g. "رفض الطلب"
    href: string;   // e.g. "/api/activity-forms/{id}/reject"
    action: string; // e.g. "REJECT", "APPROVE", etc.
}

interface Props {
    actions: WorkflowActionResource[];
    currentStatus: string;
}

const BASE_URL = "http://localhost:8081";

// Map each status to the roles that may perform actions from it
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
        "ADMIN",
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
        "ADMIN",
    ],
};

const AvailableActions: React.FC<Props> = ({ actions, currentStatus }) => {
    // 1) Hooks must be at the top, unconditionally:
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [pendingRejectHref, setPendingRejectHref] = useState<string | null>(null);

    // Early return if no actions available:
    if (!actions || actions.length === 0) return null;

    const userRole = localStorage.getItem("userRole")?.toUpperCase();

    // 2) Filter actions by current status & user role:
    const filteredActions = actions.filter((a) => {
        const allowedRoles = statusToRoleMap[currentStatus] || [];

        // Special case: STUDENT may only “APPROVE” when status=NEW
        if (userRole === "STUDENT" && currentStatus === "NEW") {
            return a.action.toUpperCase() === "APPROVE";
        }
        return allowedRoles.includes(userRole || "");
    });

    // 3) Split “approve” actions from the rest:
    const approveActions = filteredActions.filter(
        (a) => a.action.toLowerCase() === "approve"
    );
    const otherActions = filteredActions.filter(
        (a) => a.action.toLowerCase() !== "approve"
    );

    // 4) Simple POST for approve/other (non-reject) actions:
    const handleSimpleActionClick = async (href: string) => {
        try {
            await instance.post(`${BASE_URL}${href}`, {}); // no body needed
            window.location.reload();
        } catch (error) {
            console.error("Action failed:", error);
            alert("فشل تنفيذ العملية. الرجاء المحاولة لاحقاً.");
        }
    };

    // 5) When user clicks “Reject,” store href and open modal:
    const handleRejectClick = (href: string) => {
        setPendingRejectHref(href);
        setShowRejectModal(true);
    };

    // 6) When modal “Confirm” is clicked, send rejectionReason:
    const handleRejectConfirm = async (reason: string) => {
        setShowRejectModal(false);

        if (!pendingRejectHref) {
            console.error("No href stored for reject!");
            return;
        }

        try {
            // Send JSON { rejectionReason } along with the POST
            await instance.post(`${BASE_URL}${pendingRejectHref}`, { rejectionReason: reason });
            window.location.reload();
        } catch (error) {
            console.error("Reject failed:", error);
            alert("فشل رفض الطلب. الرجاء المحاولة لاحقاً.");
        } finally {
            setPendingRejectHref(null);
        }
    };

    // 7) If user cancels in modal, just close it:
    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setPendingRejectHref(null);
    };

    return (
        <>
            <div className="actions-bar">
                {otherActions.map((action, idx) => {
                    // If it’s a REJECT action, open modal instead of immediate POST
                    if (action.action.toLowerCase() === "reject") {
                        return (
                            <button
                                key={idx}
                                className={`action-tag ${action.action.toLowerCase()}`}
                                title={action.href}
                                onClick={() => handleRejectClick(action.href)}
                            >
                                {action.name}
                            </button>
                        );
                    }

                    // Otherwise, do a simple POST/hard reload
                    return (
                        <button
                            key={idx}
                            className={`action-tag ${action.action.toLowerCase()}`}
                            title={action.href}
                            onClick={() => handleSimpleActionClick(action.href)}
                        >
                            {action.name}
                        </button>
                    );
                })}

                {approveActions.length > 0 && <div className="action-spacer" />}

                {approveActions.map((action, idx) => (
                    <button
                        key={`approve-${idx}`}
                        className={`action-tag ${action.action.toLowerCase()}`}
                        title={action.href}
                        onClick={() => handleSimpleActionClick(action.href)}
                    >
                        {action.name}
                    </button>
                ))}
            </div>

            {/* Render the modal when a reject action is pending */}
            {showRejectModal && (
                <RejectWithReasonModal
                    onConfirm={handleRejectConfirm}
                    onCancel={handleRejectCancel}
                />
            )}
        </>
    );
};

export default AvailableActions;
