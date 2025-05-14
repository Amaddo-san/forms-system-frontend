import React from "react";
import "./ConfirmModal.css";

interface ConfirmSubmitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmSubmitModal: React.FC<ConfirmSubmitModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>تأكيد إرسال الطلب</h3>
        <p>هل أنت متأكد من إرسال هذا الطلب؟</p>
        <div className="modal-buttons">
          <button className="confirm" onClick={onConfirm}>نعم، إرسال</button>
          <button className="cancel" onClick={onCancel}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSubmitModal;
