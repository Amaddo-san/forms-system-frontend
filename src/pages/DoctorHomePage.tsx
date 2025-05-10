import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "./DoctorHomePage.css";
import { useNavigate } from "react-router-dom";

interface ActivityRequest {
  id: number;
  studentName: string;
  activityType: string;
  date: string;
  status: string;
}

const DoctorHomePage: React.FC = () => {
  const username = "dr.abdullah";
  const [requests, setRequests] = useState<ActivityRequest[]>([]);
  
  useEffect(() => {
    // Later: fetch from API
    const demoRequests = [
      {
        id: 1,
        studentName: "Ahmad Mohammad",
        activityType: "ورشة عمل",
        date: "2025-05-09",
        status: "قيد المراجعة"
      },
    ];
    setRequests(demoRequests);
  }, []);

  const navigate = useNavigate();
  
  const handleStatusChange = (id: number, newStatus: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  return (
    <div>
      <Header username={username} />
      <main className="doctor-home-wrapper">
        <h2>Review Student Activity Requests</h2>
        <div className="table-responsive">
      <table className="request-table">
  <thead>
    <tr>
      <th>Student</th>
      <th>Activity</th>
      <th>Date</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {requests.map((r) => (
      <tr key={r.id} onClick={() => navigate(`/review/${r.id}`)} style={{ cursor: "pointer" }}>
        <td>{r.studentName}</td>
        <td>{r.activityType}</td>
        <td>{r.date}</td>
        <td>{r.status}</td>
        <td>
          <button onClick={(e) => { e.stopPropagation(); handleStatusChange(r.id, "مقبول"); }}>Approve</button>
          <button onClick={(e) => { e.stopPropagation(); handleStatusChange(r.id, "مرفوض"); }}>Reject</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
        <div className="card-list">
  {requests.map((r) => (
    <div
  className="card"
  key={r.id}
  onClick={() => navigate(`/review/${r.id}`)}
  style={{ cursor: "pointer" }} >

      <div><strong>Student:</strong> {r.studentName}</div>
      <div><strong>Activity:</strong> {r.activityType}</div>
      <div><strong>Date:</strong> {r.date}</div>
      <div><strong>Status:</strong> {r.status}</div>
      <div className="card-actions">
        <button
  onClick={(e) => {
    e.stopPropagation();
    handleStatusChange(r.id, "مقبول");
  }}
>
  Approve
</button>

        <button
  onClick={(e) => {
    e.stopPropagation();
    handleStatusChange(r.id, "مرفوض");
  }}
>
  Reject
</button>

      </div>
    </div>
  ))}
  </div>
      </main>
    </div>
  );
};

export default DoctorHomePage;
