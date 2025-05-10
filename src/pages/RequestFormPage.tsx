import React, { useState } from "react";
import Header from "../components/Header";
import "./RequestFormPage.css";
import { useNavigate } from "react-router-dom";

const RequestFormPage: React.FC = () => {
  const username: string = "ahmad123"; // placeholder, replace with dynamic login
  const navigate = useNavigate();
  const [activityType, setActivityType] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [fromTime, setFromTime] = useState<string>("");
  const [toTime, setToTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [audience, setAudience] = useState<string>("");
  const [services, setServices] = useState<string[]>([""]);
  const [supervisor, setSupervisor] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [submissionResult, setSubmissionResult] = useState<"success" | "cancel" | null>(null);

  const handleCheckboxChange = (type: string) => {
    setActivityType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

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

  const confirmed = window.confirm("هل أنت متأكد من إرسال هذا الطلب؟");
  if (!confirmed) {
    setSubmissionResult("cancel");
    return;
  }

  const submission = {
    eventName: activityType.join(" - "),
    date: new Date().toLocaleDateString(),
    status: "قيد المراجعة", // default status
  };

  const existing = JSON.parse(localStorage.getItem("submissions") || "[]");
  localStorage.setItem("submissions", JSON.stringify([...existing, submission]));

  setSubmissionResult("success");
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
      <main className="request-form-wrapper">
      <div className="request-form-container">
        <h2>نموذج طلب إقامة نشاط</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>نوع النشاط:</label>
            <div className="activity-type-group">
              {["مبادرة", "محاضرة", "دورة تدريبية", "ورشة", "معرض", "مسابقة"].map((type) => (
                <div key={type} className="activity-type-option">
                  <input
                    type="checkbox"
                    checked={activityType.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    id={type}
                  />
                  <label htmlFor={type}>{type}</label>
                </div>
              ))}
            </div>
          </div>

          <label>وصف النشاط:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>اسم الجهة المنظمة:</label>
          <input type="text" value={organization} onChange={(e) => setOrganization(e.target.value)} />

          <label>تاريخ النشاط:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <label>الوقت:</label>
          <div>
            من <input type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} />
            إلى <input type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} />
          </div>

          <label>مكان إقامة النشاط:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

          <label>الجمهور المستهدف:</label>
          <textarea value={audience} onChange={(e) => setAudience(e.target.value)} />

          <label>الخدمات المطلوبة:</label>
          {services.map((service, index) => (
            <input
              key={index}
              type="text"
              value={service}
              onChange={(e) => handleServiceChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addServiceField}>
            إضافة خدمة
          </button>

          <label>اسم مشرف النشاط:</label>
          <input type="text" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} />

          <label>الرقم الجامعي:</label>
          <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />

          <button type="submit">إرسال الطلب</button>
        </form>
        </div>
      </main>
    </div>
  );
};

export default RequestFormPage;
