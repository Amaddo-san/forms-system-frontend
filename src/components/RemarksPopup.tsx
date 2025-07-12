import React from "react";
import "./RemarksPopup.css";

interface RemarksPopupProps {
    savedRemarks: string[];
    pendingRemarks: string[];
    tempRemark: string;
    onTempRemarkChange: (value: string) => void;
    onAddRemark: () => void;
    onSave: () => void;
    onCancel: () => void;
}

const RemarksPopup: React.FC<RemarksPopupProps> = ({
    savedRemarks,
    pendingRemarks,
    tempRemark,
    onTempRemarkChange,
    onAddRemark,
    onSave,
    onCancel,
}) => {
    return (
        <div className="remarks-popup-overlay">
            <div className="remarks-popup">
                <h3>الملاحظات</h3>

                <div className="remarks-section">
                    <h4>الملاحظات المحفوظة</h4>
                    <div className="remarks-box">
                        {savedRemarks.length > 0 ? (
                            savedRemarks.map((remark, idx) => (
                                <div key={idx} className="remark-item">• {remark}</div>
                            ))
                        ) : (
                            <div className="no-remarks">لا توجد ملاحظات محفوظة</div>
                        )}
                    </div>
                </div>

                {pendingRemarks.length > 0 && (
                    <div className="remarks-section">
                        <h4>الملاحظات التي لم تُحفظ بعد</h4>
                        <div className="remarks-box remarks-pending">
                            {pendingRemarks.map((remark, idx) => (
                                <div key={idx} className="remark-item">• {remark}</div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="remarks-section">
                    <h4>إضافة ملاحظة جديدة</h4>
                    <div className="remarks-new-box">
                        <textarea
                            value={tempRemark}
                            onChange={(e) => onTempRemarkChange(e.target.value)}
                            placeholder="أضف ملاحظة جديدة هنا"
                            rows={3}
                        />
                        <button
                            className="add-remark-btn"
                            onClick={onAddRemark}
                            disabled={!tempRemark.trim()}
                        >
                            إضافة
                        </button>
                    </div>
                </div>

                <div className="remarks-actions">
                    <button className="save-remark-btn" onClick={onSave}>حفظ</button>
                    <button className="cancel-remark-btn" onClick={onCancel}>إلغاء</button>
                </div>
            </div>
        </div>
    );
};

export default RemarksPopup;
