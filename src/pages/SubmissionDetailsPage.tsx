import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AvailableActions from "../components/AvailableActions";
import "./RequestFormPage.css";
import { ActivityFormService } from "../services/ActivityFormService";
import { ActivityForm } from "../models/ActivityForm";
import ActionBar from "../components/ActionBar";
import { getStatusLabel } from "../models/Status";

const SubmissionDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ActivityForm | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (uuid) {
          const data = await ActivityFormService.getByUuid(uuid);
          setSubmission(data);
        }
      } catch (error) {
        console.error("Failed to load submission:", error);
      }
    };
    fetchData();
  }, [uuid]);

  return (
    <div>
      <Header username="الطالب" />
      <div style={{ display: "flex" }}>
        <Sidebar />

        {/* ✅ Scrollable area with action bar + form content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", minHeight: "calc(100vh - 64px)" }}>
          {/* ✅ Action buttons aligned to form width */}
          {submission && (
            <ActionBar
            actions={submission.availableActions}
            currentStatus={submission.status || ""}
          />
          )}


          <main className="request-form-wrapper">
            {!submission ? (
              <div className="submission-message">
                <p className="not-found">تعذر العثور على النشاط</p>
                <button className="back-btn" onClick={() => navigate("/home")}>العودة</button>
              </div>
            ) : (
              <div className="request-form-container">
                <h2>نموذج عرض بيانات النشاط</h2>

                <div className={`status-badge ${submission.status === "NEW" || submission.status === "Approved"
                  ? "status-green"
                  : submission.status === "Rejected"
                    ? "status-red"
                    : "status-orange"
                  }`}>
                  الحالة: {getStatusLabel(submission.status || "")}
                </div>

                <form>
                  <label>نوع النشاط:</label>
                  <input type="text" value={submission.activityType} disabled />

                  <label>وصف النشاط:</label>
                  <textarea value={submission.description} disabled />

                  <label>اسم الجهة المنظمة:</label>
                  <input type="text" value={submission.organizingEntity} disabled />

                  <label>تاريخ النشاط:</label>
                  <input type="date" value={submission.activityDate} disabled />

                  <label>الوقت:</label>
                  <div>
                    من <input type="time" value={submission.startTime?.slice(11, 16)} disabled />
                    إلى <input type="time" value={submission.endTime?.slice(11, 16)} disabled />
                  </div>

                  <label>مكان إقامة النشاط:</label>
                  <input type="text" value={submission.location} disabled />

                  <label>رقم الهاتف:</label>
                  <input type="text" value={submission.phoneNumber} disabled />

                  <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>بيانات المشرف</h4>
                  <label>اسم مشرف النشاط:</label>
                  <input type="text" value={submission.supervisorName} disabled />

                  {submission.student && (
                    <>
                      <hr style={{ marginTop: "15px", marginBottom: "10px", border: "none", height: "2px", color: "grey" }} />
                      <h4>بيانات الطالب</h4>
                      <label>الرقم الجامعي:</label>
                      <input type="text" value={submission.student.universityId} disabled />

                      <label>اسم الطالب:</label>
                      <input
                        type="text"
                        value={`${submission.student.firstName} ${submission.student.middleName ?? ""} ${submission.student.lastName}`}
                        disabled
                      />

                      <label>كلية الطالب:</label>
                      <input type="text" value={submission.student.faculty} disabled />
                    </>
                  )}
                </form>

                <button className="back-btn" onClick={() => navigate("/home")}>العودة</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailsPage;
