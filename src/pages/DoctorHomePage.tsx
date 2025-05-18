import React, { useEffect, useState } from "react";
import Header from "../components/drHeader";
import "./DoctorHomePage.css";
import { useNavigate } from "react-router-dom";
import { ActivityFormService } from "../services/ActivityFormService";
import { ActivityForm } from "../models/ActivityForm";

const DoctorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ActivityForm[]>([]);

  const username = (() => {
    const userData = localStorage.getItem("user");
    const loggedInUser = userData ? JSON.parse(userData) : null;
    return loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : "ضيف";
  })();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await ActivityFormService.getAll();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching activity forms:", error);
        alert("تعذر تحميل بيانات الأنشطة.");
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (
    form: ActivityForm,
    action: "APPROVE" | "REJECT"
  ) => {
    console.log(`Attempting to change status of form ID ${form.id} to ${action}`);

    const updatedForm: ActivityForm = {
      ...form,
      workflowAction: action,
    };

    try {
      const result = await ActivityFormService.updateStatus(updatedForm);
      console.log("Backend response:", result);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === form.id
            ? { ...r, status: action === "APPROVE" ? "مقبول" : "مرفوض" }
            : r
        )
      );

      alert("تم تحديث حالة الطلب بنجاح");
    } catch (error: any) {
      console.error("Error during updateStatus call:", error.response || error);
      alert("تعذر تحديث حالة الطلب. تحقق من الاتصال أو سجل الأخطاء.");
    }
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
              {requests.map((activityRequest) => (
                <tr key={activityRequest.id}>
                  <td
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate(`/review/${activityRequest.id}`)}
                  >
                    {`${activityRequest.student.firstName} ${activityRequest.student.lastName}`}
                  </td>
                  <td>{activityRequest.activityType}</td>
                  <td>{activityRequest.activityDate}</td>
                  <td>{activityRequest.status}</td>
                  <td>
                    <button onClick={() => handleStatusChange(activityRequest, "APPROVE")}>Approve</button>
                    <button onClick={() => handleStatusChange(activityRequest, "REJECT")}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DoctorHomePage;
