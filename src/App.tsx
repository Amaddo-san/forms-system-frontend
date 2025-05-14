import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import RequestFormPage from "./pages/RequestFormPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import ReviewSubmissionPage from "./pages/ReviewSubmissionPage";
import HomeRedirector from "./pages/HomeRedirector";


const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomeRedirector />} />
        <Route path="/request-form" element={<RequestFormPage />} />
        <Route path="/submission/:id" element={<SubmissionDetailsPage />} />
        <Route path="/review/:id" element={<ReviewSubmissionPage />} />
      </Routes>
    </Router>
  );
};

export default App;
