import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SubmissionDetailsPage.css";

interface Submission {
  id: number;
  eventName: string;
  description: string;
  organization: string;
  date: string;
  fromTime: string;
  toTime: string;
  location: string;
  audience: string;
  services: string[];
  supervisor: string;
  studentId: string;
  status: string;
}

const SubmissionDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = "ahmad123";

  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("submissions") || "[]");
    const found = data.find((s: Submission) => s.id === Number(id));
    setSubmission(found || null);
  }, [id]);

  if (!submission) {
    return <div>Submission not found</div>;
  }

  return (
    <div>
      <Header username={username} />
      <main className="submission-details-wrapper">
        <h2>تفاصيل النشاط المقدم</h2>
        <div className="details-card">
          <p><strong>نوع النشاط:</strong> {submission.eventName}</p>
          <p><strong>وصف النشاط:</strong> {submission.description}</p>
          <p><strong>اسم الجهة المنظمة:</strong> {submission.organization}</p>
          <p><strong>التاريخ:</strong> {submission.date}</p>
          <p><strong>الوقت:</strong> من {submission.fromTime} إلى {submission.toTime}</p>
          <p><strong>المكان:</strong> {submission.location}</p>
          <p><strong>الجمهور المستهدف:</strong> {submission.audience}</p>
          <p><strong>الخدمات المطلوبة:</strong> {submission.services.join("، ")}</p>
          <p><strong>اسم مشرف النشاط:</strong> {submission.supervisor}</p>
          <p><strong>الرقم الجامعي:</strong> {submission.studentId}</p>
          <p><strong>الحالة:</strong> {submission.status}</p>
        </div>
        <button onClick={() => navigate("/home")}>🔙 العودة</button>
      </main>
    </div>
  );
};

export default SubmissionDetailsPage;
