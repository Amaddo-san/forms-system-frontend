import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SubmissionDetailsPage.css";

const SubmissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
  const submission = submissions.find((s: any) => String(s.id) === id);

  if (!submission) {
    return (
      <div>
        <Header username="student" />
        <main className="submission-wrapper">
          <p className="not-found">Submission not found</p>
          <button onClick={() => navigate("/home")}>🔙 Back to Home</button>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header username="student" />
      <main className="submission-wrapper">
        <h2 className="details-title">Submission Details</h2>

        <div className="details-card">
          <p><strong>Event:</strong> {submission.name}</p>
          <p><strong>Date:</strong> {submission.date}</p>
          <p><strong>Status:</strong> {submission.status}</p>
          {/* You can show more fields if stored */}
        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>🔙 Back to Home</button>
      </main>
    </div>
  );
};

export default SubmissionDetailsPage;
