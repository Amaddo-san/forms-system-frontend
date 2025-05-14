import React, { useState } from "react";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import "./HomePage.css";
import { useEffect } from "react";
import TimelineItem from "../components/TimelineItem";
import { useNavigate } from "react-router-dom";

type Submission = {
  id: number;
  name: string;
  date: string;
  status: string;
};


const statuses = ["ALL", "Under Review", "Approved", "Rejected"];

const HomePage: React.FC = () => {
const [submissions, setSubmissions] = useState<Submission[]>(() => {
  const stored = localStorage.getItem("submissions");
  return stored ? JSON.parse(stored) : [];
});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const username = localStorage.getItem("username") || "user";
  const filteredSubmissions =
  selectedStatus === "ALL"
    ? submissions
    : submissions.filter((s) => s.status === selectedStatus);


    useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("submissions") || "[]");

  const translated = stored.map((s: any) => ({
    ...s,
    status:
      s.status === "قيد المراجعة"
        ? "Under Review"
        : s.status === "مقبول"
        ? "Approved"
        : s.status === "مرفوض"
        ? "Rejected"
        : s.status.trim(), // <- also strip any extra spaces
  }));

  setSubmissions(translated);
}, []);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const currentData = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setSubmissions((prev) => prev.filter((s) => s.id !== deleteId));
    }
    setModalOpen(false);
  };

  const navigate = useNavigate();


  return (
    <>
      <Header username={username} />

      <div className="home-page">
        <h2 className="section-title">Activity History</h2>

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

       <div className="timeline-wrapper">
{currentData.map((item, index) => (
<div onClick={() => navigate(`/submission/${item.id}`)} style={{ cursor: "pointer" }}>
    <TimelineItem
      key={item.id}
      id={item.id}
      name={item.name}
      date={item.date}
      status={item.status}
      onEdit={() => console.log("Edit", item.id)}
      onDelete={() => openDeleteModal(item.id)}
    />
  </div>
))}


  {currentData.length === 0 && (
    <p className="no-results">No results found.</p>
  )}
</div>


          {/* Pagination Controls */}
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
      

      {/* Delete Modal */}
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
