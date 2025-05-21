import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./RequestFormPage.css"; // Reuse the same form styling

const SubmissionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");
  const submission = submissions.find((s: any) => String(s.id) === id);

  return (
    <div>
      <Header username="student" />
      <main className="request-form-wrapper">
        {!submission ? (
          <div className="submission-message">
            <p className="not-found">Submission not found</p>
            <button className="back-btn" onClick={() => navigate("/home")}>🔙 Back to Home</button>
          </div>
        ) : (
          <div className="request-form-container">
            <h2>View Submitted Activity Request</h2>
            <form>
              <label>Activity Type:</label>
              <input type="text" value={submission.name} disabled />

              <label>Description:</label>
              <textarea value={submission.description} disabled />

              <label>Organization:</label>
              <input type="text" value={submission.organization} disabled />

              <label>Date:</label>
              <input type="date" value={submission.date} disabled />

              <label>Time:</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  From:
                  <input type="time" value={submission.fromTime} disabled />
                </div>
                <div style={{ flex: 1 }}>
                  To:
                  <input type="time" value={submission.toTime} disabled />
                </div>
              </div>

              <label>Location:</label>
              <input type="text" value={submission.location} disabled />

              <label>Audience:</label>
              <textarea value={submission.audience} disabled />

              <label>Services:</label>
              {submission.services.map((srv: string, idx: number) => (
                <input key={idx} type="text" value={srv} disabled />
              ))}

              <label>Supervisor Name:</label>
              <input type="text" value={submission.supervisor} disabled />

              <label>Student ID:</label>
              <input type="text" value={submission.studentId} disabled />

              <label>Status:</label>
              <input type="text" value={submission.status} disabled />
            </form>

            <button className="back-btn" onClick={() => navigate("/home")}>🔙 Back to Home</button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SubmissionDetailsPage;
