import React from "react";
import HomePage from "./HomePage";
import DoctorHomePage from "./DoctorHomePage";

const HomeRedirector: React.FC = () => {
  const role = localStorage.getItem("userRole");

  if (role === "doctor") return <DoctorHomePage />;
  return <HomePage />;
};

export default HomeRedirector;
