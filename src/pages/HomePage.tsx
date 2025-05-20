import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import Sidebar from "../components/Sidebar"; // Sidebar
import "./HomePage.css";
import { useNavigate } from "react-router-dom";

// import { ActivityForm } from "../models/ActivityForm";
// import { ActivityFormService } from "../services/ActivityFormService";

const statuses = ["ALL", "Under Review", "Approved", "Rejected"];

const HomePage: React.FC = () => {
  // Dummy data for now
  const [searchQuery, setSearchQuery] = useState("");

  const [submissions, setSubmissions] = useState<any[]>([
    {
      id: "1",
      activityType: "Event A",
      activityDate: "2025-05-20",
      status: "Approved",
    },
    {
      id: "2",
      activityType: "Workshop B",
      activityDate: "2025-05-18",
      status: "Under Review",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const username = user ? user.firstName : "User";

  const navigate = useNavigate();

  /*
  // === Original Backend Fetch Logic ===
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await ActivityFormService.getAll();
        setSubmissions(data);
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };
    fetchSubmissions();
  }, []);
  */

  const filteredSubmissions = submissions.filter((s) => {
  const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;
  const searchLower = searchQuery.toLowerCase();
  const matchesSearch =
    s.activityType.toLowerCase().includes(searchLower) ||
    s.status.toLowerCase().includes(searchLower) ||
    s.activityDate.includes(searchLower);

  return matchesStatus && matchesSearch;
});

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const currentData = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    /*
    if (deleteId !== null) {
      try {
        const toDelete = submissions.find((s) => s.id === deleteId);
        if (toDelete) {
          await ActivityFormService.delete(toDelete);
          setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
        }
      } catch (error) {
        console.error("Error deleting submission:", error);
      }
    }
    */
    // TEMP: simulate delete
    if (deleteId !== null) {
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
    }
    setModalOpen(false);
  };
  
  const handleNewFormRequest = () => {
  const updated = submissions.map((s) => ({
    ...s,
    id: (parseInt(s.id) + 1).toString(),
  }));

  const newForm = {
    id: "1",
    activityType: "New Request",
    activityDate: new Date().toISOString().split("T")[0],
    status: "Under Review",
  };

  setSubmissions([newForm, ...updated]);
};


  return (
    <>
      <Header username={username} />
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div className="home-page" style={{ marginLeft: "220px", width: "100%" }}>
          <h2 className="section-title">Activity History</h2>
          <div className="search-bar">
  <input
    type="text"
    placeholder="Search by name, status, or date..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>

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
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
         
          {/* Table Design */}
          
          <table className="activity-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
<tbody>
  {currentData.map((item, index) => (
    <tr
      key={item.id}
      onClick={() => navigate(`/submission/${item.id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>{index + 1}</td>
      <td>{item.activityType}</td>
      <td>{item.activityDate}</td>
      <td>
        <span className={`status-label ${item.status.toLowerCase().replace(" ", "-")}`}>
          {item.status}
        </span>
      </td>
      <td className="table-actions">
        <button
          onClick={(e) => {
            e.stopPropagation(); // ⛔ prevent row click
            console.log("Edit", item.id);
          }}
        >
          <i className="ri-pencil-line"></i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // ⛔ prevent row click
            openDeleteModal(item.id!);
          }}
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>

          

          {currentData.length === 0 && (
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
