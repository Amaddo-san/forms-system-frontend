import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage";
import RequestFormPage from "./pages/RequestFormPage";
import SubmissionDetailsPage from "./pages/SubmissionDetailsPage";
import ReviewSubmissionPage from "./pages/ReviewSubmissionPage";
import HomeRedirector from "./pages/HomeRedirector";
import DoctorHomePage from "./pages/DoctorHomePage";
import HomePage from "./pages/HomePage";
import AppConfigsPage from "./pages/AppConfigsPage";
import AppConfigCreatePage from "./pages/AppConfigCreatePage";
import AppConfigEditPage from "./pages/AppConfigEditPage"; 


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRedirector />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/doctor-home" element={<DoctorHomePage />} />
        <Route path="/request-form" element={<RequestFormPage />} />
        <Route path="/submission/:uuid" element={<SubmissionDetailsPage />} />
        <Route path="/review/:id" element={<ReviewSubmissionPage />} />
        <Route path="/app-configs" element={<AppConfigsPage />} />
        <Route path="/app-configs/create" element={<AppConfigCreatePage />} />
        <Route path="/app-configs/edit/:uuid" element={<AppConfigEditPage />} />
      </Routes>
    </Router>
  );
};

export default App;
