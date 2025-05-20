import React, { useState } from "react";
import Header from "../components/Header";
import "./RequestFormPage.css";
import { useNavigate } from "react-router-dom";
import ConfirmSubmitModal from "../components/ConfirmSubmitModal";
import Sidebar from "../components/Sidebar";
import { ActivityForm } from "../models/ActivityForm";
import { User, Faculty } from "../models/User";
import { Occupation } from "../models/Occupation";
import { ActivityFormService } from "../services/ActivityFormService";

const RequestFormPage: React.FC = () => {
  const navigate = useNavigate();

  // Load logged-in user from localStorage
  const userData = localStorage.getItem("user");
  const loggedInUser = userData ? JSON.parse(userData) : null;

  const username = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "ضيف";

  const [activityType, setActivityType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState("");
  const [services, setServices] = useState([""]);
  const [supervisor, setSupervisor] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submissionResult, setSubmissionResult] = useState<"success" | "cancel" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleServiceChange = (index: number, value: string) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };

  const addServiceField = () => {
    setServices([...services, ""]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmSubmission = async () => {
    if (!loggedInUser) {
      alert("يرجى تسجيل الدخول أولاً.");
      return;
    }

    const user = new User(
      loggedInUser.universityId,
      loggedInUser.email,
      loggedInUser.password ?? "",
      loggedInUser.phoneNumber,
      loggedInUser.firstName,
      loggedInUser.middleName,
      loggedInUser.lastName,
      loggedInUser.faculty as Faculty,
      loggedInUser.occupation as Occupation
    );

    const activityForm = new ActivityForm(
      "NEW",
      user,
      supervisor,
      activityType,
      date,
      organization,
      location,
      `${date}T${fromTime}`,
      `${date}T${toTime}`,
      user.phoneNumber,
      description
    );

    try {
      await ActivityFormService.submit(activityForm);
      setSubmissionResult("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء إرسال الطلب. الرجاء المحاولة مرة أخرى.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (submissionResult) {
    return (
      <div>
        <Header username={username} />
        <main className="request-form-wrapper">
          <div className="submission-message">
            {submissionResult === "success" ? (
              <>
                <h3>تم إرسال الطلب بنجاح!</h3>
                <p>شكراً لك، سيتم مراجعة طلبك من قبل الإدارة.</p>
              </>
            ) : (
              <>
                <h3>تم إلغاء الإرسال</h3>
                <p>يمكنك تعديل الحقول وإعادة المحاولة.</p>
              </>
            )}
            <button onClick={() => navigate("/home")}>العودة إلى الصفحة الرئيسية</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header username={username} />
      <div style={{ display: "flex" }}>
      <Sidebar />
            <div style={{ flex: 1, padding: "20px", overflowY: "auto", maxHeight: "calc(100vh - 64px)" }}>

      <main className="request-form-wrapper">
        <div className="request-form-container">
          <h2>نموذج طلب إقامة نشاط</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>نوع النشاط:</label>
              <div className="activity-type-group">
                {[
                  "مبادرة",
                  "محاضرة",
                  "دورة تدريبية",
                  "ورشة",
                  "معرض",
                  "مسابقة"
                ].map((type) => (
                  <div key={type} className="activity-type-option">
                    <input
                      type="radio"
                      name="activityType"
                      id={type}
                      value={type}
                      checked={activityType === type}
                      onChange={(e) => setActivityType(e.target.value)}
                      required
                    />
                    <label htmlFor={type}>{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <label>وصف النشاط:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>اسم الجهة المنظمة:</label>
            <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} required />

            <label>تاريخ النشاط:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

            <label>الوقت:</label>
            <div>
              من <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} required />
              إلى <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} required />
            </div>

            <label>مكان إقامة النشاط:</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

            <label>الجمهور المستهدف:</label>
            <textarea value={audience} onChange={(e) => setAudience(e.target.value)} required />

            <label>الخدمات المطلوبة:</label>
            {services.map((service, index) => (
              <input
                key={index}
                type="text"
                value={service}
                onChange={(e) => handleServiceChange(index, e.target.value)}
                required
              />
            ))}
            <button type="button" onClick={addServiceField}>إضافة خدمة</button>

            <label>اسم مشرف النشاط:</label>
            <input type="text" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} required />

            <label>الرقم الجامعي:</label>
            <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} required />

            <button type="submit">إرسال الطلب</button>
          </form>
        </div>
      </main>
      </div>
      </div>

      {showConfirmModal && (
        <ConfirmSubmitModal
          onConfirm={confirmSubmission}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default RequestFormPage;