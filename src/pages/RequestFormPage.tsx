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
import { UserService } from "../services/UserService";

const RequestFormPage: React.FC = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const loggedInUser: User | null = userData
    ? (JSON.parse(userData) as User)
    : null;

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
  const [sponsors, setSponsors] = useState([""]);
  const [submissionResult, setSubmissionResult] = useState<"success" | "cancel" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [professors, setProfessors] = useState<User[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<User | null>(null);
  const [supervisorSearch, setSupervisorSearch] = useState("");

  const fetchProfessors = async (keyword: string) => {
    if (keyword.trim() === "") return;
    try {
      const res = await UserService.searchProfessorsByName(keyword);
      setProfessors(res);
    } catch (err) {
      console.error("Error fetching professors", err);
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };

  const addServiceField = () => {
    setServices([...services, ""]);
  };

  const removeServiceField = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSponsorChange = (index: number, value: string) => {
    const updated = [...sponsors];
    updated[index] = value;
    setSponsors(updated);
  };

  const addSponsorField = () => {
    setSponsors([...sponsors, ""]);
  };

  const removeSponsorField = (index: number) => {
    setSponsors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSupervisorChange = (typed: string) => {
    setSupervisorSearch(typed);
    fetchProfessors(typed);

    const found = professors.find(
      (p) =>
        `${p.firstName} ${p.middleName ?? ""} ${p.lastName}`.trim() ===
        typed.trim()
    );
    setSelectedProfessor(found || null);
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
      loggedInUser.id,
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

    const activityForm = new ActivityForm({
      status: "NEW",
      student: user,
      supervisor: selectedProfessor ?? undefined,
      activityType: activityType,
      activityDate: date,
      organizingEntity: organization,
      location: location,
      startTime: `${date}T${fromTime}`,
      endTime: `${date}T${toTime}`,
      phoneNumber: user.phoneNumber,
      description: description,
      requiredServices: services,
      sponsors: sponsors.filter(s => s.trim() !== "")
    });

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

  return (
    <div>
      <Header username={username} />
      <div className="request-form-layout">
        <Sidebar />
        <div className="request-form-content">
          <main className="request-form-wrapper">
            <div className="request-form-container">
              {submissionResult === "success" ? (
                <>
                  <h2>✅ تم إرسال الطلب بنجاح</h2>
                  <p style={{ marginBottom: "20px" }}>
                    شكراً لك! سيتم مراجعة طلبك من قبل الإدارة.
                  </p>
                  <button className="back-btn" onClick={() => navigate("/home")}>
                    العودة إلى الصفحة الرئيسية
                  </button>
                </>
              ) : (
                <>
                  <h2>نموذج طلب إقامة نشاط</h2>
                  <form onSubmit={handleSubmit}>
                    <label>نوع النشاط:</label>
                    <div className="activity-type-group">
                      {["مبادرة", "محاضرة", "دورة تدريبية", "ورشة", "معرض", "مسابقة"].map((type) => (
                        <label key={type} className={`activity-type-option ${activityType === type ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="activityType"
                            value={type}
                            checked={activityType === type}
                            onChange={(e) => setActivityType(e.target.value)}
                            required
                          />
                          {type}
                        </label>
                      ))}
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
                      <div key={index} className="service-input-wrapper">
                        <input
                          type="text"
                          value={service}
                          onChange={(e) => handleServiceChange(index, e.target.value)}
                          required
                          placeholder="الخدمة المطلوبة"
                        />
                        {services.length > 1 && (
                          <span
                            className="clear-icon"
                            onClick={() => removeServiceField(index)}
                            title="حذف الخدمة"
                          >
                            ×
                          </span>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addServiceField}>إضافة خدمة</button>
                    <br />
                    <br />
                    <label>الرعاة (اختياري):</label>
                    {sponsors.map((sponsor, index) => (
                      <div key={index} className="service-input-wrapper">
                        <input
                          type="text"
                          value={sponsor}
                          onChange={(e) => handleSponsorChange(index, e.target.value)}
                          placeholder="اسم الراعي"
                        />
                        {sponsors.length > 1 && (
                          <span
                            className="clear-icon"
                            onClick={() => removeSponsorField(index)}
                            title="حذف الراعي"
                          >
                            ×
                          </span>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={addSponsorField}>إضافة راعي</button>

                    <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>بيانات المشرف</h4>
                    <label>اسم مشرف النشاط:</label>
                    <input
                      type="text"
                      list="professor-options"
                      value={
                        selectedProfessor
                          ? `${selectedProfessor.firstName} ${selectedProfessor.middleName ?? ""} ${selectedProfessor.lastName}`
                          : supervisorSearch
                      }
                      onChange={(e) => handleSupervisorChange(e.target.value)}
                      placeholder="ابحث عن المشرف باسم كامل"
                      required
                    />
                    <datalist id="professor-options">
                      {professors.map((prof) => (
                        <option
                          key={prof.id}
                          value={`${prof.firstName} ${prof.middleName ?? ""} ${prof.lastName}`}
                        />
                      ))}
                    </datalist>

                    {selectedProfessor && (
                      <>
                        <label>الرقم الجامعي للمشرف:</label>
                        <input type="text" disabled value={selectedProfessor.universityId} />
                        <label>كلية المشرف:</label>
                        <input type="text" disabled value={selectedProfessor.faculty} />
                      </>
                    )}

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

                    {loggedInUser ? (
                      <>
                        <label>الرقم الجامعي:</label>
                        <input type="text" value={loggedInUser.universityId} disabled />
                        <label>اسم الطالب:</label>
                        <input type="text" value={`${loggedInUser.firstName} ${loggedInUser.middleName ?? ""} ${loggedInUser.lastName}`} disabled />
                        <label>كلية الطالب:</label>
                        <input type="text" value={loggedInUser.faculty} disabled />
                      </>
                    ) : (
                      <p>يرجى تسجيل الدخول لعرض بيانات الطالب</p>
                    )}

                    <button type="submit">إرسال الطلب</button>
                  </form>
                </>
              )}
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
