import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import { ActivityFormService } from "../services/ActivityFormService";

const statuses = ["ALL", "Under Review", "Approved", "Rejected"];

const HomePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(4);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const username = user ? user.firstName : "User";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await ActivityFormService.getPaginated(currentPage - 1, itemsPerPage);
        setSubmissions(res.content);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };
    fetchPage();
  }, [currentPage, itemsPerPage]);

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
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div className="home-page" style={{ marginLeft: "220px", width: "100%" }}>
          <h2 className="section-title">Activity History</h2>

          <div className="table-controls">
            <input
              type="text"
              placeholder="Search by name, status, or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled // can re-enable once server-side search is added
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
                disabled // can re-enable once backend supports filtering
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
              {submissions.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/submission/${item.uuid}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{item.activityType}</td>
                  <td>{item.activityDate}</td>
                  <td>
                    <span className={`status-label ${item.status?.toLowerCase().replace(" ", "-")}`.trim()}>
                      {item.status}
                    </span>
                  </td>
                  <td className="table-actions0">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/submission/${item.uuid}`);
                      }}
                    >
                      <i className="ri-pencil-line"></i> View
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
              ))}
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
