import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./HomePage.css";

interface Submission {
  id: number;
  eventName: string;
  date: string;
  status: string;
}


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const username = "ahmad123";
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("submissions");
    if (stored) {
      setSubmissions(JSON.parse(stored));
    }
  }, []);

  const getStatusClass = (status: string): string => {
  switch (status) {
    case "مقبول":
    case "Approved":
      return "approved";
    case "مرفوض":
    case "Rejected":
      return "rejected";
    default:
      return "pending";
  }
};



  return (
    <div>
      <Header username={username} />
      <main className="home-wrapper">
        <button className="request-button" onClick={() => navigate("/request-form")}>
          نموذج طلب إقامة نشاط
        </button>

        {submissions.length > 0 && (
          <div className="submission-table">
            <h3 style={{ marginTop: "30px" }}>:Activity history</h3>
            <table>
              <thead>
                <tr>
                  <th>submission date </th>
                  <th>event name</th>
                  <th>status</th>
                </tr>
              </thead>
            <tbody>
  {submissions.map((item, index) => (
    <tr key={index} onClick={() => navigate(`/submission/${item.id}`)} style={{ cursor: "pointer" }}>
      <td className="status-cell">
        <span className={`status-icon ${getStatusClass(item.status)}`}></span>
        {item.status}
      </td>
      <td>{item.eventName}</td>
      <td>{item.date}</td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
