// src/components/RejectWithReasonModal.tsx

import React, { useState } from "react";

type RejectWithReasonModalProps = {
    onConfirm: (reason: string) => void;
    onCancel: () => void;
};

export const RejectWithReasonModal: React.FC<RejectWithReasonModalProps> = ({
    onConfirm,
    onCancel,
}) => {
    const [reason, setReason] = useState("");

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                direction: "rtl" // Ensure right-to-left layout
            }}
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 8,
                    maxWidth: 400,
                    width: "90%",
                    padding: 20,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    textAlign: "right" // Align text to the right
                }}
            >
                <h3 style={{ marginTop: 0 }}>سبب الرفض</h3>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="اكتب سبب الرفض هنا..."
                    style={{
                        width: "100%",
                        minHeight: 100,
                        padding: 8,
                        fontSize: 14,
                        boxSizing: "border-box",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        textAlign: "right" // Align textarea text to the right
                    }}
                />
                <div
                    style={{
                        marginTop: 16,
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            padding: "8px 16px",
                            background: "#555555",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={() => onConfirm(reason.trim())}
                        disabled={reason.trim().length === 0}
                        style={{
                            padding: "8px 16px",
                            background: reason.trim() ? "#d32f2f" : "#f4c2c2",
                            color: "white",
                            border: "none",
                            borderRadius: 4,
                            cursor: reason.trim() ? "pointer" : "not-allowed",
                        }}
                    >
                        تأكيد الرفض
                    </button>
                </div>
            </div>
        </div>
    );
};
