import React, { useEffect, useState } from "react";
import Header from "../components/drHeader";
import Sidebar from "../components/Sidebar";
import "./DoctorHomePage.css"; // Use same design as student
import { useNavigate } from "react-router-dom";
// import { ActivityFormService } from "../services/ActivityFormService";
// import { ActivityForm } from "../models/ActivityForm";

const DoctorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<any[]>([
    {
      id: "1",
      student: { firstName: "Ali", lastName: "Omar" },
      activityType: "ورشة",
      activityDate: "2025-05-21",
      status: "Under Review",
    },
    {
      id: "2",
      student: { firstName: "Sara", lastName: "Hussein" },
      activityType: "محاضرة",
      activityDate: "2025-05-19",
      status: "Approved",
    },
  ]);

  const username = (() => {
    const userData = localStorage.getItem("user");
    const loggedInUser = userData ? JSON.parse(userData) : null;
    return loggedInUser ? `${loggedInUser.firstName} ${loggedInUser.lastName}` : "ضيف";
  })();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const total = requests.length;
  const approved = requests.filter((r) => r.status.toLowerCase() === "approved").length;
  const rejected = requests.filter((r) => r.status.toLowerCase() === "rejected").length;
  const underReview = requests.filter((r) => r.status.toLowerCase() === "under review").length;


  /*
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
  */

  const handleStatusChange = async (form: any, action: "APPROVE" | "REJECT") => {
    console.log(`Attempting to change status of form ID ${form.id} to ${action}`);

    /*
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
    */
  };

  return (
    <>
      <Header username={username} />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="home-page" style={{ marginLeft: "220px", width: "100%" }}>
          <div className="summary-cards">
  <div className="summary-card total">
    <h4>Total</h4>
    <p>{total}</p>
  </div>
  <div className="summary-card approved">
    <h4>Approved</h4>
    <p>{approved}</p>
  </div>
  <div className="summary-card rejected">
    <h4>Rejected</h4>
    <p>{rejected}</p>
  </div>
  <div className="summary-card review">
    <h4>Under Review</h4>
    <p>{underReview}</p>
  </div>
</div>

          <h2 className="section-title">Review Student Activity Requests</h2>
          <div className="table-controls">
  <input
    type="text"
    placeholder="Search by student or activity..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  <div className="filter-bar">
    <label htmlFor="status-filter">Status:</label>
    <select
      id="status-filter"
      value={selectedStatus}
      onChange={(e) => setSelectedStatus(e.target.value)}
    >
      {["ALL", "Approved", "Rejected", "Under Review"].map((status) => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  </div>
</div>

           
          <table className="activity-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests
   .filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      item.student.firstName.toLowerCase().includes(searchLower) ||
      item.student.lastName.toLowerCase().includes(searchLower) ||
      item.activityType.toLowerCase().includes(searchLower);

    const matchesStatus =
      selectedStatus === "ALL" ||
      item.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  })
  .map((item, index) => (

                <tr
                  key={item.id}
                  onClick={() => navigate(`/review/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{`${item.student.firstName} ${item.student.lastName}`}</td>
                  <td>{item.activityType}</td>
                  <td>{item.activityDate}</td>
                  <td>
                    <span className={`status-label ${item.status.toLowerCase().replace(" ", "-")}`}>
                      {item.status}
                    </span>
                  </td>
                  
                  <td className="table-actions">
  <button
    className="approve-btn hover-underline"
    onClick={(e) => {
      e.stopPropagation();
      handleStatusChange(item, "APPROVE");
    }}
  >
    APPROVE
  </button>
  <button
    className="reject-btn hover-underline"
    onClick={(e) => {
      e.stopPropagation();
      handleStatusChange(item, "REJECT");
    }}
  >
    REJECT
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>

          {requests.length === 0 && (
            <p className="no-results">No requests available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorHomePage;
