import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ActionBar from "../components/ActionBar";
import { ActivityFormService } from "../services/ActivityFormService";
import { ActivityForm } from "../models/ActivityForm";
import { getStatusLabel } from "../models/Status";
import { ActivityFormLog } from "../models/ActivityFormLog";
import LogsSidebar from "../components/LogsSideBar";
import { User } from "../models/User";
import RemarksPopup from "../components/RemarksPopup";
import "./SubmissionDetailsPage.css";

const SubmissionDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState<ActivityForm | null>(null);
  const [logs, setLogs] = useState<ActivityFormLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [showRemarksPopup, setShowRemarksPopup] = useState(false);

  const [savedRemarks, setSavedRemarks] = useState<string[]>([]);
  const [pendingRemarks, setPendingRemarks] = useState<string[]>([]);
  const [tempRemark, setTempRemark] = useState("");

  const userData = localStorage.getItem("user");
  const loggedInUser: User | null = userData ? JSON.parse(userData) : null;
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
          setSavedRemarks(form.remarks || []);
          setPendingRemarks([]);
        }
      } catch (error) {
        console.error("Failed to load submission:", error);
      }
    };
    fetchData();
  }, [uuid]);

  const toggleLogs = () => setShowLogs(!showLogs);

  const handleAddRemark = () => {
    if (tempRemark.trim()) {
      setPendingRemarks([...pendingRemarks, tempRemark.trim()]);
      setTempRemark("");
    }
  };

  const handleSaveRemarks = async () => {
    if (!uuid || pendingRemarks.length === 0) return;
    try {
      const updatedForm = await ActivityFormService.addRemarks(uuid, pendingRemarks);
      setSubmission(updatedForm);
      setSavedRemarks(updatedForm.remarks || []);
      setPendingRemarks([]);
      setTempRemark("");
      setShowRemarksPopup(false);
    } catch (error) {
      console.error("Failed to save remarks", error);
    }
  };

  const handleCancelRemarks = () => {
    setPendingRemarks([]);
    setTempRemark("");
    setShowRemarksPopup(false);
  };

  return (
    <div>
      <Header username={username} />
      <div className="submission-layout">
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          
          {submission && (
  <div className="action-bar-container">
    <ActionBar
      actions={submission.availableActions}
      currentStatus={submission.status || ""}
    />
      <button className="remarks-top-btn" onClick={() => setShowRemarksPopup(true)}>
        Remarks
      </button>
      <button className="logs-toggle-btn" onClick={toggleLogs}>
        Logs
      </button>
    </div>
)}


          <main className="request-form-wrapper">
            {!submission ? (
              <div className="submission-message">
                <p className="not-found">تعذر العثور على النشاط</p>
                <button className="back-btn" onClick={() => navigate("/home")}>
                  العودة
                </button>
              </div>
            ) : (
              <div className="request-form-container">
                <h2>نموذج عرض بيانات النشاط</h2>

                <div
                  className={`status-badge ${submission.status === "NEW" ||
                    submission.status?.toLowerCase().includes("approved")
                    ? "status-green"
                    : submission.status?.toLowerCase().includes("rejected")
                      ? "status-red"
                      : "status-orange"
                    }`}
                >
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
                    من{" "}
                    <input
                      type="time"
                      value={submission.startTime?.slice(11, 16)}
                      disabled
                    />
                    إلى{" "}
                    <input
                      type="time"
                      value={submission.endTime?.slice(11, 16)}
                      disabled
                    />
                  </div>

                  <label>مكان إقامة النشاط:</label>
                  <input type="text" value={submission.location} disabled />

                  <label>رقم الهاتف:</label>
                  <input type="text" value={submission.phoneNumber} disabled />

                  {/* ✅ Sponsors section here */}
                  <label>الرعاة:</label>
                  <ul className="sponsor-list">
                    {submission.sponsors && submission.sponsors.length > 0 ? (
                      submission.sponsors.map((s, i) => (
                        <li key={i} className="sponsor-item">{s}</li>
                      ))
                    ) : (
                      <li className="sponsor-item">لا يوجد رعاة</li>
                    )}
                  </ul>

                  <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>
                    بيانات المشرف
                  </h4>
                  <input
                    type="text"
                    value={`${submission.supervisor.firstName} ${submission.supervisor.middleName ?? ""} ${submission.supervisor.lastName}`}
                    disabled
                  />

                  {submission.student && (
                    <>
                      <hr
                        style={{
                          marginTop: "15px",
                          marginBottom: "10px",
                          border: "none",
                          height: "2px",
                          color: "grey",
                        }}
                      />
                      <h4>بيانات الطالب</h4>
                      <label>الرقم الجامعي:</label>
                      <input type="text" value={submission.student.universityId} disabled />
                      <label>اسم الطالب:</label>
                      <input type="text" value={`${submission.student.firstName} ${submission.student.middleName ?? ""} ${submission.student.lastName}`} disabled />
                      <label>كلية الطالب:</label>
                      <input type="text" value={submission.student.faculty} disabled />
                    </>
                  )}
                </form>

                <button className="back-btn" onClick={() => navigate("/home")}>
                  العودة
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <LogsSidebar isOpen={showLogs} onClose={toggleLogs} logs={logs} />

      {showRemarksPopup && (
        <RemarksPopup
          savedRemarks={savedRemarks}
          pendingRemarks={pendingRemarks}
          tempRemark={tempRemark}
          onTempRemarkChange={setTempRemark}
          onAddRemark={handleAddRemark}
          onSave={handleSaveRemarks}
          onCancel={handleCancelRemarks}
        />
      )}
    </div>
  );
};

export default SubmissionDetailsPage;
