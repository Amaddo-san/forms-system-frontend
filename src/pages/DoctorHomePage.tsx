import React, { useEffect, useState } from "react";
import Header from "../components/drHeader";
import Sidebar from "../components/Sidebar";
import "./DoctorHomePage.css";
import { useNavigate } from "react-router-dom";
import { ActivityFormService } from "../services/ActivityFormService";
import { ActivityForm } from "../models/ActivityForm";
import { Status } from "../models/Status";

const DoctorHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ActivityForm[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(8);
  const statusOptions = ["ALL", ...Object.values(Status)];

  const userData = localStorage.getItem("user");
  const loggedInUser = userData ? JSON.parse(userData) : null;
  const username = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "User";

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const res = await ActivityFormService.getPaginated(currentPage - 1, itemsPerPage);
        let data = res.content;

        // Apply status filter
        if (selectedStatus !== "ALL") {
          data = data.filter((item) =>
            item.status?.toLowerCase() === selectedStatus.toLowerCase()
          );
        }

        // Apply search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          data = data.filter((item) =>
            item.student?.firstName.toLowerCase().includes(query) ||
            item.student?.lastName.toLowerCase().includes(query) ||
            item.activityType?.toLowerCase().includes(query)
          );
        }

        setRequests(data);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Error fetching activity forms:", error);
        alert("تعذر تحميل بيانات الأنشطة.");
      }
    };

    fetchAndFilter();
  }, [currentPage, itemsPerPage, searchQuery, selectedStatus]);

  const approved = requests.filter((r) => r.status?.toLowerCase() === Status.APPROVED.toLowerCase()).length;
  const rejected = requests.filter((r) => r.status?.toLowerCase() === Status.REJECTED.toLowerCase()).length;
const underReview = requests.filter(
  (r) =>
    r.status?.toLowerCase() !== Status.APPROVED.toLowerCase() &&
    r.status?.toLowerCase() !== Status.REJECTED.toLowerCase()
).length;
  const total = requests.length;

  const handleStatusChange = async (form: ActivityForm, action: "APPROVE" | "REJECT") => {
    try {
      const updatedForm = { ...form, workflowAction: action };
      const result = await ActivityFormService.updateStatus(updatedForm);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === form.id ? { ...r, status: result.status } : r
        )
      );
      alert("تم تحديث حالة الطلب بنجاح");
    } catch (error: any) {
      console.error("Error updating status:", error.response || error);
      alert("تعذر تحديث حالة الطلب.");
    }
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
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statusOptions.map((status) => (
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
              {requests.length > 0 ? (
                requests.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/submission/${item.uuid}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{`${item.student?.firstName} ${item.student?.lastName}`}</td>
                    <td>{item.activityType}</td>
                    <td>{item.activityDate}</td>
                    <td>
                      <span className={`status-label ${item.status?.toLowerCase().replace(" ", "-")}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button
                        className="approve-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item, "APPROVE");
                        }}
                      >
                        APPROVE
                      </button>
                      <button
                        className="reject-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item, "REJECT");
                        }}
                      >
                        REJECT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="no-results">
                    No matching requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorHomePage;
