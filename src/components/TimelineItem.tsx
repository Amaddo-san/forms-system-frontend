import React from "react";
import "./TimelineItem.css";

type TimelineItemProps = {
  id: number;
  date: string;
  status: string;
  name: string;
  onEdit: () => void;
  onDelete: () => void;
};

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  status,
  name,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="timeline-card">
      <div className="timeline-header">
        <div className="timeline-date">{date}</div>
        <div className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
          {status}
        </div>
      </div>
      <div className="timeline-name">{name}</div>
      <div className="timeline-actions">
      <button className="edit-btn" onClick={(e) => {
  e.stopPropagation();
  onEdit();
}}>
  <i className="ri-edit-line"></i>
</button>

<button className="delete-btn" onClick={(e) => {
  e.stopPropagation();
  onDelete();
}}>
  <i className="ri-delete-bin-line"></i>
</button>

      </div>
    </div>
  );
};

export default TimelineItem;
