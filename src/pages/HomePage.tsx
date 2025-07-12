import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { ActivityFormService } from "../services/ActivityFormService";
import { Status } from "../models/Status";

const statuses = ["ALL", ...Object.values(Status)];

const HomePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(8);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userData = localStorage.getItem("user");
  const loggedInUser = userData ? JSON.parse(userData) : null;
  const username = loggedInUser
    ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
    : "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const res = await ActivityFormService.getPaginated(currentPage - 1, itemsPerPage);
        let data = res.content;

        // Filter by status if selected (skip "ALL")
        if (selectedStatus !== "ALL") {
          data = data.filter(item => item.status === selectedStatus);
        }

        // Apply search (basic lowercase match)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          data = data.filter(item =>
            item.activityType?.toLowerCase().includes(query) ||
            item.status?.toLowerCase().includes(query) ||
            item.activityDate?.toLowerCase().includes(query)
          );
        }
        data.sort((a, b) => (b.id || 0) - (a.id || 0));
        setSubmissions(data);
        setTotalPages(res.totalPages); // keep this for now
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };

    fetchAndFilter();
  }, [currentPage, itemsPerPage, searchQuery, selectedStatus]);


  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
    }
    setModalOpen(false);
  };

  return (
    <>
      <Header username={username} />
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />

        <div className="home-page" style={{ marginLeft: "220px", width: "100%", overflow: "auto" }}>

          <h2 className="section-title">Activity History</h2>

          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by name, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            // can re-enable once server-side search is added
            />

            <div className="filter-bar">
              <label htmlFor="status-filter">Filter by status:</label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="activity-table0">
            <thead>
              <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item, index) => {
                const statusText = item.status || "";
                const lower = statusText.toLowerCase();

                // Determine which CSS class to apply
                const statusClass = lower.includes("rejected")
                  ? "rejected"
                  : lower.includes("approved")
                    ? "approved"
                    : lower.includes("new")
                      ? "new"
                      : "under-review";

                return (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/submission/${item.uuid}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{item.activityType}</td>
                    <td>{item.activityDate}</td>
                    <td>
                      <span className={`status-label ${statusClass}`}>
                        {statusText}
                      </span>
                    </td>
                    <td className="table-actions0">
                      <button
                        className="view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/submission/${item.uuid}`);
                        }}
                      >
                        <i className="ri-eye-line"></i> View
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(item.id!);
                        }}
                      >
                        <i className="ri-delete-bin-line"></i> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {submissions.length === 0 && (
            <p className="no-results">No results found.</p>
          )}

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

      {modalOpen && (
        <ConfirmModal
          message="Are you sure you want to delete this submission?"
          onCancel={() => setModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default HomePage;
