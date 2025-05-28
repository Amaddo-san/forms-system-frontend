import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ActionBar from "../components/ActionBar";
import { ActivityFormService } from "../services/ActivityFormService";
import { ActivityForm } from "../models/ActivityForm";
import { getStatusLabel } from "../models/Status";
import { ActivityFormLog } from "../models/ActivityFormLog";
import "./SubmissionDetailsPage.css";
import "../components/LogsSidebar.css";
import LogsSidebar from "../components/LogsSideBar";

const SubmissionDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ActivityForm | null>(null);
  const [logs, setLogs] = useState<ActivityFormLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const userData = localStorage.getItem("user");
  const loggedInUser = userData ? JSON.parse(userData) : null;
  const username = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "User";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (uuid) {
          const form = await ActivityFormService.getByUuid(uuid);
          const history = await ActivityFormService.getLogsByUuid(uuid);
          setSubmission(form);
          setLogs(history);
        }
      } catch (error) {
        console.error("Failed to load submission:", error);
      }
    };
    fetchData();
  }, [uuid]);

  const toggleLogs = () => setShowLogs(!showLogs);

  return (
    <div>
      <Header username={username} />
      <div className="submission-layout">
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          {submission && (
            <>
              <div className="action-bar-container">
                <ActionBar
                  actions={submission.availableActions}
                  currentStatus={submission.status || ""}
                />
                <button className="logs-toggle-btn" onClick={toggleLogs}>
                  Logs
                </button>
              </div>
            </>
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


      <LogsSidebar
        isOpen={showLogs}
        onClose={toggleLogs}
        logs={logs}
      />

    </div>
  );
};

export default SubmissionDetailsPage;
