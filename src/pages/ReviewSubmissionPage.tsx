import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SubmissionDetailsPage.css"; // reuse styles

interface Submission {
  id: number;
  studentName: string;
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

const ReviewSubmissionPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const username = "dr.abdullah";

  const [submission, setSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("submissions") || "[]");
    const found = data.find((s: Submission) => String(s.id) === id);
    setSubmission(found || null);
  }, [id]);

  if (!submission) return <div>Submission not found</div>;

  return (
    <div>
      <Header username={username} />
      <main className="submission-details-wrapper">
        <h2>مراجعة تفاصيل النشاط</h2>
        <div className="details-card">
          <p><strong>اسم الطالب:</strong> {submission.studentName}</p>
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
          <p><strong>الحالة الحالية:</strong> {submission.status}</p>
        </div>
        <button onClick={() => navigate("/home")}>🔙 العودة</button>
      </main>
    </div>
  );
};

export default ReviewSubmissionPage;
