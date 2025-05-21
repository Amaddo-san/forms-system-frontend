import React, { useState, useEffect } from "react";
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
  const [professors, setProfessors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<User | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  const fetchProfessors = async (keyword: string) => {
    if (keyword.trim() === "") return;
    try {
      const res = await UserService.searchProfessorsByName(keyword);
      setProfessors(res);
    } catch (err) {
      console.error("Error fetching professors", err);
    }
  };

  const fetchStudents = async (keyword: string) => {
    if (keyword.trim() === "") return;
    try {
      const res = await UserService.searchStudentsByUniversityId(keyword);
      setStudents(res);
    } catch (err) {
      console.error("Error fetching students", err);
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

  const handleSupervisorChange = (value: string) => {
    setSupervisor(value);
    fetchProfessors(value);
    const found = professors.find(
      (p) => `${p.firstName} ${p.middleName} ${p.lastName}` === value
    );
    setSelectedProfessor(found || null);
  };

  const handleStudentIdChange = (value: string) => {
    setStudentId(value);
    fetchStudents(value);
    const found = students.find((s) => s.universityId === value);
    setSelectedStudent(found || null);
  };

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
                <label>نوع النشاط:</label>
                <div className="activity-type-group">
                  {["مبادرة", "محاضرة", "دورة تدريبية", "ورشة", "معرض", "مسابقة"].map((type) => (
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

                <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>بيانات المشرف</h4>
                <label>اسم مشرف النشاط:</label>
                <input
                  type="text"
                  list="professor-options"
                  value={supervisor}
                  onChange={(e) => handleSupervisorChange(e.target.value)}
                  required
                />
                <datalist id="professor-options">
                  {professors.map((prof) => (
                    <option key={prof.id} value={`${prof.firstName} ${prof.middleName} ${prof.lastName}`} />
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

                <hr style={{ marginTop: "15px", marginBottom: "10px", border: "none", height: "2px", color: "grey" }} />
                <h4>بيانات الطالب</h4>
                <label>الرقم الجامعي:</label>
                <input
                  type="text"
                  list="student-options"
                  value={studentId}
                  onChange={(e) => handleStudentIdChange(e.target.value)}
                  required
                />
                <datalist id="student-options">
                  {students.map((s) => (
                    <option key={s.id} value={s.universityId}>
                      {s.universityId} - {s.firstName} {s.lastName}
                    </option>
                  ))}
                </datalist>

                {selectedStudent && (
                  <>
                    <label>اسم الطالب:</label>
                    <input type="text" disabled value={`${selectedStudent.firstName} ${selectedStudent.middleName} ${selectedStudent.lastName}`} />
                    <label>كلية الطالب:</label>
                    <input type="text" disabled value={selectedStudent.faculty} />
                  </>
                )}

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
